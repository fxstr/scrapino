// To run:
// npx tsc && node dist/examples/readmeExample.js

import { Crawler, type HandleSuccessParams } from '../index.js';

const baseUrl = 'https://www.vsao-bern.ch';
const crawler = new Crawler({
  entryPointURL: baseUrl,
  // Limit the scope of the data we're fetching to two domains; defaults to the entryPointURL
  // if not specified
  guardrail: [baseUrl, 'https://www.vsao.ch'],
  handleDocument: ({ content, url, mimeType }: HandleSuccessParams): void => {
    console.log('Got content %s with mime type %s for URL %s', content, mimeType, url);
  },
  handleError: (error: Error): void => {
    console.error('Failed: %o', error);
  },
  logFunction: ():void => {},
});
crawler.crawl();
