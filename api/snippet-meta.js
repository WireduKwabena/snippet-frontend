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

  console.log("[snippet-meta] cwd:", process.cwd());
  console.log("[snippet-meta] looking for index.html at:", indexPath);
  console.log("[snippet-meta] slug:", slug);

  let html;
  try {
    html = fs.readFileSync(indexPath, "utf-8");
    console.log("[snippet-meta] read index.html, length:", html.length);
  } catch (err) {
    console.log("[snippet-meta] FAILED to read index.html:", err.message);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(500).send(`snippet-meta: could not read index.html at ${indexPath}: ${err.message}`);
    return;
  }

  try {
    const apiUrl = `${API_BASE}/snippets/${slug}/`;
    console.log("[snippet-meta] fetching:", apiUrl);
    const response = await fetch(apiUrl);
    console.log("[snippet-meta] backend response status:", response.status);

    if (response.ok) {
      const snippet = await response.json();
      console.log("[snippet-meta] snippet title:", snippet.title);

      const title = `${escapeHtml(snippet.title)} — Snippets`;
      const description = escapeHtml(
        snippet.description ||
          `A ${snippet.language} snippet by ${snippet.owner} on Snippets.`
      );
      const url = `https://${req.headers.host}/s/${slug}`;

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
      console.log("[snippet-meta] final html length:", html.length);
    } else {
      console.log("[snippet-meta] backend returned non-OK status, serving default html unmodified");
    }
  } catch (err) {
    console.log("[snippet-meta] fetch/processing error:", err.message);
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(html);
}
