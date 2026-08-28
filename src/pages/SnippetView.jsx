import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import CommentSection from "../components/CommentSection";
import { auth, snippets } from "../api";

export default function SnippetView() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [snippet, setSnippet] = useState(null);
  const [copied, setCopied] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

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

  function handleCopyField(field, text) {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
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

      {snippet.collection_info && (
        <Link
          to={`/c/${snippet.collection_info.slug}`}
          className="inline-block text-xs text-accent hover:underline mt-3"
        >
          in {snippet.collection_info.name}
        </Link>
      )}

      <div className="mt-6 relative">
        <div className="absolute right-3 top-3 flex gap-2 z-10">
          <button
            onClick={() => setShowEmbed((v) => !v)}
            className="text-xs bg-white border border-line rounded px-2.5 py-1 hover:border-accent"
          >
            {showEmbed ? "Hide embed" : "Embed"}
          </button>
          <button
            onClick={handleCopy}
            className="text-xs bg-white border border-line rounded px-2.5 py-1 hover:border-accent"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <SyntaxHighlighter
          language={snippet.language}
          style={oneLight}
          customStyle={{ borderRadius: 10, border: "1px solid #E3E6EC", padding: 20, fontSize: 13.5 }}
        >
          {snippet.code}
        </SyntaxHighlighter>
      </div>

      {showEmbed && (
        <div className="mt-4 bg-white border border-line rounded-lg p-5 space-y-5">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-sm font-semibold">Embed on a blog or site</h3>
              <button
                onClick={() =>
                  handleCopyField(
                    "iframe",
                    `<iframe src="${window.location.origin}/embed/${snippet.slug}" width="100%" height="320" style="border:1px solid #e3e6ec;border-radius:8px;" title="${snippet.title}"></iframe>`
                  )
                }
                className="text-xs text-accent hover:underline"
              >
                {copiedField === "iframe" ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="text-xs bg-[#F7F8FA] border border-line rounded-md p-3 overflow-x-auto font-mono-brand">
              {`<iframe src="${window.location.origin}/embed/${snippet.slug}" width="100%" height="320" style="border:1px solid #e3e6ec;border-radius:8px;" title="${snippet.title}"></iframe>`}
            </pre>
            <p className="text-xs text-inksoft mt-1.5">
              Works on platforms that allow raw HTML (self-hosted blogs, Notion, Ghost,
              WordPress). Live and stays in sync if you edit the snippet later.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-sm font-semibold">Paste into a README</h3>
              <button
                onClick={() =>
                  handleCopyField(
                    "markdown",
                    `\`\`\`${snippet.language}\n${snippet.code}\n\`\`\`\n\n[View "${snippet.title}" on Snippets](${window.location.origin}/s/${snippet.slug})`
                  )
                }
                className="text-xs text-accent hover:underline"
              >
                {copiedField === "markdown" ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="text-xs bg-[#F7F8FA] border border-line rounded-md p-3 overflow-x-auto font-mono-brand whitespace-pre-wrap">
              {`\`\`\`${snippet.language}\n${snippet.code}\n\`\`\`\n\n[View "${snippet.title}" on Snippets](${window.location.origin}/s/${snippet.slug})`}
            </pre>
            <p className="text-xs text-inksoft mt-1.5">
              GitHub strips &lt;iframe&gt; and &lt;script&gt; tags from README rendering, so
              a live embed can't work there — this is a static, syntax-highlighted code
              block with a link back instead.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-4 text-xs text-inksoft">
        <span>
          by{" "}
          <Link to={`/u/${snippet.owner}`} className="hover:text-accent hover:underline">
            {snippet.owner}
          </Link>{" "}
          · {snippet.view_count} views
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

      <CommentSection slug={snippet.slug} />
    </div>
  );
}
