import fs from "fs";
import path from "path";

const API_BASE = process.env.VITE_API_URL || "https://snippet-backend-ahvf.onrender.com/api";

function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default async function handler(req, res) {
  const { slug } = req.query;
  const indexPath = path.join(process.cwd(), "dist", "index.html");
  let html = fs.readFileSync(indexPath, "utf-8");

  try {
    const response = await fetch(`${API_BASE}/snippets/${slug}/`);
    if (response.ok) {
      const snippet = await response.json();
      const title = `${escapeHtml(snippet.title)} — Snippets`;
      const description = escapeHtml(
        snippet.description ||
          `A ${snippet.language} snippet by ${snippet.owner} on Snippets.`
      );
      const url = `https://${req.headers.host}/s/${slug}`;

      // Bots that skip JS (Discord, Slack, X, etc.) only ever see this
      // server-rendered HTML — React updating the title client-side never
      // reaches them. Replace the base template's generic tags IN PLACE
      // (not append) — index.html already ships default og:title/
      // og:description/og:type for the homepage, and appending new ones
      // instead of replacing would leave duplicates. Crawlers use the
      // FIRST occurrence of a given og: property, so a duplicate means
      // the generic one silently wins and this whole fix does nothing.
      html = html
        .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
        .replace(
          /<meta name="description"[^>]*>/,
          `<meta name="description" content="${description}" />`
        )
        .replace(
          /<meta property="og:title"[^>]*>/,
          `<meta property="og:title" content="${title}" />`
        )
        .replace(
          /<meta property="og:description"[^>]*>/,
          `<meta property="og:description" content="${description}" />`
        )
        .replace(
          /<meta property="og:type"[^>]*>/,
          `<meta property="og:type" content="article" />`
        )
        .replace(
          "</head>",
          `<meta property="og:url" content="${url}" />
<meta name="twitter:card" content="summary" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
</head>`
        );
    }
  } catch {
    // Snippet fetch failed (private, deleted, or API temporarily down) —
    // fall back to the default index.html as-is. Not fatal; the SPA
    // itself still handles the "not found" case once it loads.
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(html);
}
