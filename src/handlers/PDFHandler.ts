import { Handler, HandlerConstructor } from '../types/Handler.js';

const PDFHandlerClass: HandlerConstructor = class HTMLHandler implements Handler {
  #response: Response;

  #getBufferPromise: Promise<string> | undefined;

  constructor(response: Response) {
    this.#response = response;
  }

  static get mimeTypes(): string[] {
    return ['application/pdf'];
  }

  /**
   * Make sure we only call text() once.
   */
  async #getContentFromResponse(): Promise<string> {
    const extractContent = async (): Promise<string> => {
      const arrayBuffer = await this.#response.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      return Buffer.from(uint8Array).toString('base64');
    };

    if (!this.#getBufferPromise) this.#getBufferPromise = extractContent();
    return this.#getBufferPromise;
  }

  /**
   * Returns content of the PDF as base64 string.
   */
  extractContent(): Promise<string> {
    return this.#getContentFromResponse();
  }

  // Let's KISS here: just assume that the PDF does not contain any relevant links.
  // Might use that library one day: https://www.npmjs.com/package/pdf-parse
  // Ignore eslint as we must obey the interface's contract.
  // eslint-disable-next-line class-methods-use-this
  getLinks(): Promise<string[]> {
    return Promise.resolve([]);
  }
};

export default PDFHandlerClass;
