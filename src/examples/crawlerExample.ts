// To run:
// npx tsc && node dist/examples/crawlerExample.js

import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { HandleSuccessParams } from '../types/HandleSuccessParams.js';
import { Crawler } from '../index.js';

const basePath = dirname(fileURLToPath(new URL(import.meta.url)));
let counter = 0;
const dataDir = join(basePath, '../../data/original');
rmSync(dataDir, { recursive: true });
mkdirSync(dataDir, { recursive: true });

const baseUrl = 'https://www.vsao-bern.ch';
const crawler = new Crawler({
  entryPointURL: baseUrl,
  guardrail: [baseUrl],
  handleDocument: ({ content, url, mimeType }: HandleSuccessParams): void => {
    // eslint-disable-next-line no-console
    console.log('Got Doc for URL', url);
    const fileContent = {
      content,
      url,
      mimeType,
    };
    writeFileSync(
      join(dataDir, `${counter.toString()}.json`),
      JSON.stringify(fileContent),
    );
    counter += 1;
  },
  handleError: (error: Error): void => {
    // eslint-disable-next-line no-console
    console.log('ERRRRRROR!!!!!', error);
  },
});
crawler.crawl();
