/**
 * Normalizes an URL:
 * - Removes trailing slash
 * - Removes hashes (might become an option for SPAs)
 * - Does not remove query parameters though (might become an option later)
 */
export default (url: string): string => (
  url
    // Remove # first (because the URL will not end with / if it has a hash)
    .replace(/#.*$/, '')
    // Remove trailing slash
    .replace(/\/$/, '')
);
