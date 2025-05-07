type InvokeJinaOptions = {
  content: string;
  url: string;
  jinaAPIKey: string;
  mimeType: string;
};

/**
 * Sends content/url to Jina and returns the extracted content.
 */
export default async ({
  content,
  url,
  jinaAPIKey,
  mimeType,
}: InvokeJinaOptions): Promise<string> => {
  const baseURL = 'https://r.jina.ai';

  // Mapping between mime types and the field names that Jina expects
  const extractionFieldNames: { [key: string]: string } = {
    'application/pdf': 'pdf',
    'text/html': 'html',
  };
  const extractionFieldName: string | undefined = extractionFieldNames[mimeType];

  if (!extractionFieldName) {
    throw new Error(`Can not extract content for mime type ${mimeType}; only ${Object.keys(extractionFieldNames).join(', ')} are supported.`);
  }

  const body = {
    url,
    ...{ [extractionFieldName]: content },
  };

  // Docs here: https://jina.ai/reader/
  const response = await fetch(baseURL, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${jinaAPIKey}`,
      'Content-Type': 'application/json',
    },
  });
  return response.text();
};
