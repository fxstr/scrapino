import { OpenAI } from 'openai';

type ExtractDateOptions = {
  markdown: string;
  url: string;
  openAIAPIKey: string;
};

/**
 * Tries to extract the date on which content was created.
 */
export default async ({
  markdown,
  url,
  openAIAPIKey,
}: ExtractDateOptions): Promise<string | null> => {
  const openai = new OpenAI({ apiKey: openAIAPIKey });
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'developer',
        content:
        `
          You extract the date on which content was created.
          Go through the content and also take the URL into consideration to extract
          the date when the content was created.
          Return the date in the form of YYYY-MM-DD.
          If the day is not known, use 1; if the month is not known, use 1.
          Do not guess. Just extract from the content. If the date is not present, return
          the string "unknown".          
        `,
      }, {
        role: 'user',
        content: `
          Content:
          ---
          ${markdown}
          ---
          URL: ${url}
        `,
      },
    ],
  });

  return completion.choices[0].message.content;
};
