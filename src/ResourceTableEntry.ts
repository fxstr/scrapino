/**
 * Single entry for the ResourceTable (i.e. a resource/URL to fetch and its status)
 */
import { StatusValues } from './types/StatusValues';

export default class ResourceTableEntry {
  #url: string;

  #status: StatusValues = 'pending';

  #inboundLinkCount: number = 0;

  constructor(url: string) {
    this.#url = url;
  }

  get status(): StatusValues {
    return this.#status;
  }

  set status(status: StatusValues) {
    this.#status = status;
  }

  get url(): string {
    return this.#url;
  }

  increaseInboundLinkCount(): void {
    this.#inboundLinkCount += 1;
  }
}
