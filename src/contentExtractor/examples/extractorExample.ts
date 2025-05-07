// Run:
// npx tsc && node --env-file=.env dist/contentExtractor/examples/extractorExample.js

import { extractContent } from '../../index.js';
import testContent from './testContent.js';

const jinaAPIKey = process.env.JINA_API_KEY;
const openAIAPIKey = process.env.OPENAI_API_KEY;

if (!jinaAPIKey || !openAIAPIKey) {
  throw new Error('Missing required environment variables: JINA_API_KEY and/or OPENAI_API_KEY');
}

const content = await extractContent({
  content: testContent,
  jinaAPIKey,
  openAIAPIKey,
  mimeType: 'text/html',
  url: 'https://www.vsao-bern.ch/news/2022/05/05/review-2011-to-2021',
});

console.log(content);
