interface Handler {
  extractContent: () => Promise<string>;
  getLinks: () => Promise<string[]>;
}

interface HandlerConstructor {
  new (response: Response, url: string): Handler;
  readonly mimeTypes: string[];
}

export type { Handler, HandlerConstructor };
