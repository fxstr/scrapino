import { JSDOM, VirtualConsole } from 'jsdom';
import { Handler, HandlerConstructor } from '../types/Handler.js';

const HTMLHandlerClass: HandlerConstructor = class HTMLHandler implements Handler {
  #response: Response;

  #url: string;

  #getTextPromise: Promise<string> | undefined;

  constructor(response: Response, url: string) {
    this.#response = response;
    this.#url = url;
  }

  static get mimeTypes(): string[] {
    return ['text/html'];
  }

  /**
   * Make sure we only call text() once.
   */
  async #getTextFromResponse(): Promise<string> {
    if (!this.#getTextPromise) this.#getTextPromise = this.#response.text();
    return this.#getTextPromise;
  }

  // Should also respect config (stuff to ignore)
  extractContent(): Promise<string> {
    return this.#getTextFromResponse();
  }

  async getLinks(): Promise<string[]> {
    const html = await this.#getTextFromResponse();
    // Just ignore all output. To not do so, add virtualConsole.on('error', {} => {});
    const virtualConsole = new VirtualConsole();
    const dom = new JSDOM(
      html,
      {
        virtualConsole,
        url: this.#url,
        // JS would be nice for SPA; but: when scripts within a page fail, this package will fail
        // as well and it's a potential security issue. As a default, don't run scripts, maybe
        // one day provide an opt-in.
        // runScripts: 'dangerously',
        pretendToBeVisual: true,
        resources: 'usable',
      },
    );
    const aTags: NodeListOf<HTMLAnchorElement> = dom.window.document.querySelectorAll('a');
    const links: string[] = Array.from(aTags).map((link: HTMLAnchorElement): string => link.href);
    const absoluteLinks: string[] = links
      .map((link: string): string => new URL(link, this.#url).href);
    return absoluteLinks;
  }
};

export default HTMLHandlerClass;
