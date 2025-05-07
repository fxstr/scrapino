import removeLinkListsFromMD from './removeLinkListsFromMD.js';
import extractDate from './extractDate.js';
import invokeJina from './invokeJina.js';

type ExtractOptions = {
  content: string;
  jinaAPIKey: string;
  openAIAPIKey: string;
  url: string;
  mimeType: string;
};

type ExtractedContent = {
  url: string;
  originalContent: string;
  markdownContent: string;
  date: string | null;
};

/**
 * Extracts the content of a page using Jina (to convert HTML/PDF to Markdown) and OpenAI (to
 * extract the date).
 */
export default async ({
  content,
  jinaAPIKey,
  openAIAPIKey,
  url,
  mimeType,
}: ExtractOptions): Promise<ExtractedContent> => {
  const extractedContent = await invokeJina({
    content,
    url,
    mimeType,
    jinaAPIKey,
  });

  // Menus contain a looot of links (and basically just that); they are barely relevant, even worse:
  // they're dangerous because they flood our precious unique content with irrelevant and
  // repetitive words that are part of every single page. Remove them.
  const cleanedContent = removeLinkListsFromMD(extractedContent);

  // The date a page was created can be very important for its relevancy. It's therefore a superbly
  // relevant weighting factor. Try to extract it.
  const date = await extractDate({ markdown: cleanedContent, url, openAIAPIKey });

  return {
    url,
    originalContent: content,
    markdownContent: cleanedContent,
    date,
  };
};
