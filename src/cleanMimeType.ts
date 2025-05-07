/**
 * Mime Type may include charset; remove it (e.g. text/html; charset=utf-8)
 */
export default (mimeType: string): string => (
  mimeType.split(';')[0].trim()
);
