export default `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Intro to Crawling</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 2rem;
      background-color: #f9f9f9;
      color: #333;
    }
    h1 {
      color: #0077cc;
    }
    article {
      max-width: 700px;
      margin: auto;
      background: white;
      padding: 2rem;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>
  <article>
    <h1>The Basics of Web Crawling</h1>
    <p>
      Web crawling is the process by which bots systematically browse the World Wide Web to index content for search engines. A web crawler, also known as a spider or bot, starts with a list of URLs to visit, called the seed.
    </p>
    <p>
      As it visits these websites, the crawler identifies all the hyperlinks in the page and adds them to its list of URLs to crawl. This process repeats recursively, allowing the bot to discover new pages and gather data across the internet.
    </p>
    <p>
      Crawlers respect the <code>robots.txt</code> file found on websites, which tells them what they're allowed to access. This is crucial to avoid overloading servers or collecting sensitive data.
    </p>
    <h2>Common Uses</h2>
    <ul>
      <li>Search engine indexing (Google, Bing, etc.)</li>
      <li>Price monitoring for e-commerce</li>
      <li>SEO analysis</li>
      <li>Academic or data-driven research</li>
    </ul>
    <p>
      While crawling sounds simple, building an efficient and respectful crawler requires attention to performance, legality, and ethics.
    </p>
  </article>
</body>
</html>
`;
