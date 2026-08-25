import { useEffect, useState } from "react";
import { auth, comments } from "../api";

function timeAgo(isoString) {
  const seconds = Math.floor((Date.now() - new Date(isoString)) / 1000);
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [label, secondsInUnit] of units) {
    const value = Math.floor(seconds / secondsInUnit);
    if (value >= 1) return `${value} ${label}${value > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

export default function CommentSection({ slug }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  const loggedIn = auth.isLoggedIn();

  useEffect(() => {
    comments
      .list(slug)
      .then(setItems)
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!body.trim()) return;
    setPosting(true);
    setError("");
    try {
      const created = await comments.create(slug, body.trim());
      setItems((prev) => [...prev, created]);
      setBody("");
    } catch {
      setError("Couldn't post that comment. Try again.");
    } finally {
      setPosting(false);
    }
  }

  async function handleDelete(id) {
    const previous = items;
    setItems((prev) => prev.filter((c) => c.id !== id));
    try {
      await comments.remove(id);
    } catch {
      setItems(previous);
    }
  }

  return (
    <div className="mt-10">
      <h2 className="text-sm font-semibold text-inksoft mb-4">
        {items.length === 0 ? "Comments" : `Comments (${items.length})`}
      </h2>

      {loading ? (
        <p className="text-sm text-inksoft">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-inksoft">No comments yet.</p>
      ) : (
        <ul className="space-y-4 mb-6">
          {items.map((c) => (
            <li key={c.id} className="bg-white border border-line rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{c.author}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-inksoft">{timeAgo(c.created_at)}</span>
                  {auth.username() === c.author && (
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-inksoft mt-2 whitespace-pre-wrap">{c.body}</p>
            </li>
          ))}
        </ul>
      )}

      {loggedIn ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <textarea
            className="w-full border border-line rounded-md px-3 py-2 text-sm h-20"
            placeholder="Add a comment…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={posting || !body.trim()}
            className="self-start bg-ink text-white rounded-md px-4 py-1.5 text-sm font-medium disabled:opacity-50"
          >
            {posting ? "Posting…" : "Post comment"}
          </button>
        </form>
      ) : (
        <p className="text-sm text-inksoft">
          <a href="/login" className="text-accent underline">
            Log in
          </a>{" "}
          to leave a comment.
        </p>
      )}
    </div>
  );
}
