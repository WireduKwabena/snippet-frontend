import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { snippets } from "../api";

// Deliberately no <Navbar/> here — App.jsx skips it for /embed/* routes.
// This page is meant to be dropped into an <iframe> on someone else's site,
// so it only renders exactly what should show up there: title, code, and a
// small attribution link back. No app chrome, no auth-aware UI.
export default function EmbedView() {
  const { slug } = useParams();
  const [snippet, setSnippet] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    snippets
      .get(slug)
      .then(setSnippet)
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="p-4 text-sm text-inksoft">
        This snippet isn't available (private, or it was deleted).
      </div>
    );
  }

  if (!snippet) {
    return <div className="p-4 text-sm text-inksoft">Loading…</div>;
  }

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-line">
        <span className="text-sm font-medium truncate">{snippet.title}</span>
        <span className="font-mono-brand text-[11px] text-accent bg-accentsoft px-2 py-0.5 rounded flex-none ml-2">
          {snippet.language}
        </span>
      </div>
      <SyntaxHighlighter
        language={snippet.language}
        style={oneLight}
        customStyle={{ margin: 0, padding: "16px", fontSize: 13, border: "none" }}
      >
        {snippet.code}
      </SyntaxHighlighter>
      <div className="px-4 py-2 border-t border-line">
        <a
          href={`/s/${snippet.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-inksoft hover:text-accent"
        >
          View on Snippets ↗
        </a>
      </div>
    </div>
  );
}
