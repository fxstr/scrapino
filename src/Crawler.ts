import ResourceTable from './ResourceTable.js';
import ResourceTableEntry from './ResourceTableEntry.js';
import workResource from './workResource.js';
import {
  CrawlerOptions,
  CrawlerDefaultOptions,
  CrawlerParameterOptions,
} from './types/CrawlerOptions.js';

const defaultOptions: CrawlerDefaultOptions = {
  maxAmountOfParallelJobs: 1,
  // eslint-disable-next-line no-console
  handleDocument: (): void => { console.warn('handleDocument not implemented'); },
  // eslint-disable-next-line no-console
  handleError: (): void => { console.warn('handleError not implemented'); },
  crawlInterval: 1000,
  guardrail: [],
  // eslint-disable-next-line no-console
  logFunction: console.log,
};

export default class Crawler {
  #resourceTable: ResourceTable;

  #options: CrawlerOptions;

  constructor(options: CrawlerParameterOptions) {
    this.#resourceTable = new ResourceTable({ logFunction: options.logFunction });
    this.#options = { ...defaultOptions, ...options };
    // We do need a guardrail (without, infinity is near). If it's not set, default to the url
    // we use as an entryPoint.
    if (!this.#options.guardrail.length) {
      options.guardrail?.push(options.entryPointURL);
    }
  }

  crawl(): void {
    this.#resourceTable.addResource(this.#options.entryPointURL);
    // eslint-disable-next-line no-void
    void this.#work();
  }

  #handleLinks(links: string[]): void {
    links.forEach((link: string): void => {
      if (!link.startsWith(this.#options.entryPointURL)) {
        this.#options.logFunction(`Skipping link ${link}; does not start with ${this.#options.entryPointURL}`);
        return;
      }
      this.#options.logFunction(`Discovered link ${link}`);
      this.#resourceTable.addResource(link);
    });
  }

  async #work(): Promise<void> {
    const amountOfRunningJobs = this.#resourceTable.getResourcesByStatus('fetching').length;
    const amountOfJobsToRun = this.#options.maxAmountOfParallelJobs - amountOfRunningJobs;
    // The maximum amount of parallel jobs is reached or exceeded
    if (amountOfJobsToRun <= 0) {
      setTimeout((): void => {
        // eslint-disable-next-line no-void
        void this.#work();
      }, this.#options.crawlInterval);
      return;
    }
    const pendingResources = this.#resourceTable.getResourcesByStatus('pending');
    this.#options.logFunction(`Resources to be fetched: ${pendingResources.length.toString()}`);
    // We're all done.
    if (pendingResources.length === 0 && amountOfRunningJobs === 0) return;
    const resourcesToFetch = pendingResources.slice(0, amountOfJobsToRun);
    const promises = resourcesToFetch.map(async (resource: ResourceTableEntry): Promise<void> => {
      // eslint-disable-next-line no-param-reassign
      resource.status = 'fetching';
      try {
        await workResource({
          resource,
          handleSuccess: this.#options.handleDocument,
          handleLinks: this.#handleLinks.bind(this),
        });
        // eslint-disable-next-line no-param-reassign
        resource.status = 'success';
      } catch (error) {
        // eslint-disable-next-line no-param-reassign
        resource.status = 'error';
        this.#options.handleError(error as Error);
      }
    });
    await Promise.all(promises);
    // eslint-disable-next-line no-void
    setTimeout((): void => { void this.#work(); }, 8000);
  }
}
