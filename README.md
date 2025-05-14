# Run

## Fetch content
Starts crawling from an entry point and calls handlers whenever a page has been fetched.
Example:

```
import { Crawler } from 'scrapino';

const baseUrl = 'https://www.vsao-bern.ch';
const crawler = new Crawler({
  entryPointURL: baseUrl,
  guardrail: [baseUrl, 'https://www.vsao.ch'],
  handleDocument: ({ content, url, mimeType }: HandleSuccessParams): void => {
    console.log('Got content %s with mime type %s for URL %s', content, mimeType, url);
  },
  handleError: (error: Error): void => {
    console.error('Failed: %o', error);
  },
});
crawler.crawl();
```

The `Crawler` class takes the following constructor arguments:
- `entryPointURL: string`: URL to start crawling from
- `guardrail?: string[]`: Array of URLs that limit the scope of crawling. If not specified, defaults
to `entryPointURL`. Needed to make sure you don't crawl the whole internet.
- `handleDocument?: (params: { content: string, url: string, mimeType: string }) => void`: Callback
that gets called whenever a document has been fetched successfully
- `handleError?: (error: Error) => void`: Callback that gets called whenever an error occurs
- `maxAmountOfParallelJobs?: number`: Maximum amount of parallel requests, defaults to 1
- `crawlInterval: number`: Interval between requests in milliseconds, defaults to 1000; if your
site goes down, increase it (or fix your site).
- `logFunction?: (message: string) => void`: Log function; defaults to  `console.log`; just pass
`() => {}` if you want to avoid logs.


## Extract content

The use of `Crawler` returns raw HTML. Not the nicest format to read (nor to save it in a vector
data base in case you're building a chatbot). There's a helper function that converts your HTML 
to Markdown and guesses the date when the content was created.

It depends on two external services: [ChatGPT](https://chatgpt.com/) and [Jina](https://jina.ai/);
in order to use them (and this function), you must provide their API Keys.

```javascript
import { extractContent } from 'scrapino';

const jinaAPIKey = '…';
const openAIAPIKey = '…';

const content = await extractContent({
  content: '<html>…</html>',
  jinaAPIKey,
  openAIAPIKey,
  mimeType: 'text/html',
  url: 'https://www.vsao-bern.ch/news/2022/05/05/review-2011-to-2021',
});
```

### Parameters
The `extractContent` function takes the following parameters:
- `content: string`: Original content that should be converted to Markdown; either HTML text or PDF content (Buffer)
- `jinaAPIKey: string`: Well, the Jina API Key
- `openAIAPIKey: string`: Your OpenAI API Key
- `mimeType: 'text/html' | 'application/pdf'`: Your MIME type; only the HTML and PDF are supported
- `url`: The URL where your content originated from

### Return value
The `extractContent` function returns a `Promise` that resolves:
```json
{
  url: string;
  originalContent: string;
  markdownContent: string;
  date: string | null;
}
```


# Test
`npx tsc && node --test`

# Publish
`npx tsc` before you `npm publish`.

# Some Features
- Quite forgiving
- Streams output (the handler is called whenever data becomes available)
- Provides a way to extract the relevant content from the pages fetched
- Typescript