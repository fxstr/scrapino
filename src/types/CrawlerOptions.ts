import type { HandleSuccessParams } from './HandleSuccessParams.js';

// Everything required; will consist of parameters and defaults.
type CrawlerOptions = {
  maxAmountOfParallelJobs: number;
  handleDocument: (arg0: HandleSuccessParams) => void;
  handleError: (error: Error) => void;
  entryPointURL: string;
  crawlInterval: number;
  guardrail: string[];
  logFunction: (message: string) => void;
};

// Default options: Everything except for url
type CrawlerDefaultOptions = Omit<CrawlerOptions, 'entryPointURL'> & { entryPointURL?: string };
// Params that will be passed to the constructor; must at least contain url
type CrawlerParameterOptions = Partial<CrawlerOptions> & { entryPointURL: string };

export type { CrawlerOptions, CrawlerDefaultOptions, CrawlerParameterOptions };
