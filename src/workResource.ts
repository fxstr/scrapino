import fetchResource from './fetchResource.js';
import ResourceTableEntry from './ResourceTableEntry.js';
import HTMLHandler from './handlers/HTMLHandler.js';
import PDFHandler from './handlers/PDFHandler.js';
import { HandlerConstructor } from './types/Handler.js';
import cleanMimeType from './cleanMimeType.js';
import { HandleSuccessParams } from './types/HandleSuccessParams.js';

// Should indeed be DI'd
const handlers: HandlerConstructor[] = [HTMLHandler, PDFHandler];

/**
 * Does what needs to be done with a resource. Fetches and handles it.
 */
export default async ({
  resource,
  handleSuccess,
  handleLinks,
}: {
  resource: ResourceTableEntry,
  handleSuccess: (arg0: HandleSuccessParams) => void,
  handleLinks: (links: string[]) => void,
}): Promise<void> => {
  const response = await fetchResource(resource.url);
  if (!response.ok) {
    throw new Error(`Could not fetch resource ${resource.url}: status is ${response.status.toString()}`);
  }

  const mimeType: string = cleanMimeType(response.headers.get('content-type') || 'text/html');
  console.log('Fetched %s, mimeType is %s', resource.url, mimeType);

  const HandlerClasses = handlers.filter(
    (HandlerClass): boolean => HandlerClass.mimeTypes.includes(mimeType),
  );
  if (HandlerClasses.length === 0) {
    throw new Error(`No handler found for mime type ${mimeType}`);
  }
  if (HandlerClasses.length > 1) {
    throw new Error(`Multiple handlers found for mime type ${mimeType}: ${HandlerClasses.map((handler): string => handler.name).join(', ')}`);
  }

  const handler = new HandlerClasses[0](response, resource.url);
  const content = await handler.extractContent();
  handleSuccess({ content, url: resource.url, mimeType });
  const links = await handler.getLinks();
  handleLinks(links);
};
