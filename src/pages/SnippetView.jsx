import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { auth, snippets } from "../api";

export default function SnippetView() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [snippet, setSnippet] = useState(null);
  const [copied, setCopied] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    snippets
      .get(slug)
      .then(setSnippet)
      .catch(() => setNotFound(true));
  }, [slug]);

  function handleCopy() {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function handleDelete() {
    if (!confirm("Delete this snippet? This can't be undone.")) return;
    await snippets.remove(slug);
    navigate("/dashboard");
  }

  if (notFound) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <p className="text-inksoft">
          This snippet doesn't exist, or it's private and you don't have access.
        </p>
      </div>
    );
  }

  if (!snippet) {
    return <div className="max-w-2xl mx-auto px-6 py-16 text-sm text-inksoft">Loading…</div>;
  }

  const isOwner = auth.isLoggedIn() && auth.username() === snippet.owner;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">{snippet.title}</h1>
          {snippet.description && (
            <p className="text-inksoft mt-1">{snippet.description}</p>
          )}
        </div>
        <span className="font-mono-brand text-xs text-accent bg-accentsoft px-2.5 py-1 rounded self-start">
          {snippet.language}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-4">
        {snippet.tag_names?.map((t) => (
          <span key={t} className="font-mono-brand text-[11px] text-inksoft bg-[#EFEFF2] px-2 py-0.5 rounded">
            #{t}
          </span>
        ))}
      </div>

      <div className="mt-6 relative">
        <button
          onClick={handleCopy}
          className="absolute right-3 top-3 text-xs bg-white border border-line rounded px-2.5 py-1 hover:border-accent z-10"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <SyntaxHighlighter
          language={snippet.language}
          style={oneLight}
          customStyle={{ borderRadius: 10, border: "1px solid #E3E6EC", padding: 20, fontSize: 13.5 }}
        >
          {snippet.code}
        </SyntaxHighlighter>
      </div>

      <div className="flex items-center justify-between mt-4 text-xs text-inksoft">
        <span>
          by {snippet.owner} · {snippet.view_count} views
        </span>
        {isOwner && (
          <div className="flex gap-4">
            <Link to={`/s/${snippet.slug}/edit`} className="text-accent hover:underline">
              Edit
            </Link>
            <button onClick={handleDelete} className="text-red-600 hover:underline">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
