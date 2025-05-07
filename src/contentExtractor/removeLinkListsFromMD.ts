/**
 * A website's main menu might appear as a lot of links without any relevant content in-between.
 * Remove them as this will rank irrelevant pages as relevant just because they contain a search
 * term in the menu (that appears on every page).
 */
export default (md: string): string => {
  // A link can also have no text, e.g. [](https://test.com) or contain an image
  // [![alt-text](image-url)]()
  // Image is just a ! in front of a linkRegex
  // const imageRegex = /(!\[[^\]]*\]\([^)]+\))/g;
  const linkRegex = /(\[[^\]]*\]\([^)]+\))/g;
  // const linkRegex = new RegExp(`(\[[^\]]*\]\([^)]+\))`, 'gi');
  // TODO: Chinese & other character set support
  // A link followed by non-alphanumeric characters, then another (non-captured) link
  const linksNotEmbeddedInContent = new RegExp(`(${linkRegex.source}[^a-zA-Z0-9]*)(?=${linkRegex.source})`, 'gs');
  // To make sure that we can also capture the last link in a series of links, add it at the end
  const consecutiveLinks = new RegExp(`(${linksNotEmbeddedInContent.source})+${linkRegex.source}?`, 'gs');
  return md.replace(consecutiveLinks, '');
};
