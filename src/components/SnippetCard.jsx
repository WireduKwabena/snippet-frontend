import { Link, useNavigate } from "react-router-dom";
import { auth, snippets } from "../api";

export default function SnippetCard({ snippet, onDeleted }) {
  const navigate = useNavigate();
  const isOwner = auth.isLoggedIn() && auth.username() === snippet.owner;

  function handleEdit(e) {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/s/${snippet.slug}/edit`);
  }

  async function handleDelete(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Delete "${snippet.title}"? This can't be undone.`)) return;
    try {
      await snippets.remove(snippet.slug);
      onDeleted?.(snippet.slug);
    } catch {
      alert("Couldn't delete that snippet. Try again.");
    }
  }

  return (
    <div className="relative bg-white border border-line rounded-lg p-5 hover:border-accent transition-colors">
      {/* Full-card link sits behind everything; content above it uses
          pointer-events-none so clicks pass through to it, except the
          Edit/Delete buttons which stay independently clickable. */}
      <Link to={`/s/${snippet.slug}`} className="absolute inset-0" aria-label={snippet.title} />

      <div className="relative flex items-start justify-between gap-3 pointer-events-none">
        <h3 className="font-semibold text-[15px]">{snippet.title}</h3>
        <span className="font-mono-brand text-[11px] text-accent bg-accentsoft px-2 py-0.5 rounded">
          {snippet.language}
        </span>
      </div>

      {snippet.description && (
        <p className="relative text-sm text-inksoft mt-1.5 pointer-events-none">
          {snippet.description}
        </p>
      )}

      <div className="relative flex flex-wrap gap-1.5 mt-3 pointer-events-none">
        {snippet.tag_names?.map((t) => (
          <span
            key={t}
            className="font-mono-brand text-[11px] text-inksoft bg-[#EFEFF2] px-2 py-0.5 rounded"
          >
            #{t}
          </span>
        ))}
      </div>

      <div className="relative flex items-center justify-between mt-3">
        <span className="text-xs text-inksoft pointer-events-none">
          by{" "}
          <Link
            to={`/u/${snippet.owner}`}
            className="pointer-events-auto hover:text-accent hover:underline"
          >
            {snippet.owner}
          </Link>{" "}
          · {snippet.view_count} views
        </span>
        {isOwner && (
          <div className="flex gap-3">
            <button onClick={handleEdit} className="text-xs text-accent hover:underline">
              Edit
            </button>
            <button onClick={handleDelete} className="text-xs text-red-600 hover:underline">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
