import ResourceTableEntry from './ResourceTableEntry.js';
import { StatusValues } from './types/StatusValues.js';
import normalizeURL from './normalizeURL.js';

type ResourceTableDefaultOptions = {
  logFunction: (message: string) => void;
};
type ResourceTableOptions = Partial<ResourceTableDefaultOptions>;

const defaultOptions: ResourceTableDefaultOptions = { logFunction: console.log };

/**
 * Table with URLs and their fetch status
 */
export default class ResourceTable {
  #entries: Map<string, ResourceTableEntry> = new Map();

  #options: ResourceTableDefaultOptions;

  constructor(options: ResourceTableOptions) {
    this.#options = { ...defaultOptions, ...options };
  }

  addResource(url: string): void {
    const normalizedURL = normalizeURL(url);
    if (!this.#entries.has(normalizedURL)) {
      this.#options.logFunction(`Add normalized URL to queue: ${normalizedURL}`);
      this.#entries.set(normalizedURL, new ResourceTableEntry(url));
    }
    this.#entries.get(normalizedURL)?.increaseInboundLinkCount();
  }

  getResourcesByStatus(status: StatusValues): ResourceTableEntry[] {
    return [...this.#entries.values()].filter(
      (entry): boolean => entry.status === status,
    );
  }
}
