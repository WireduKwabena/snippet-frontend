import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collections } from "../api";

export default function Collections() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    collections
      .list()
      .then((data) => setItems(data.results ?? data))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    setError("");
    try {
      const created = await collections.create({
        name: name.trim(),
        description: description.trim(),
      });
      setItems((prev) => [...prev, created]);
      setName("");
      setDescription("");
    } catch {
      setError("Couldn't create that collection. Try again.");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(slug) {
    if (!confirm("Delete this collection? Snippets inside it are kept, just unfiled.")) return;
    const previous = items;
    setItems((prev) => prev.filter((c) => c.slug !== slug));
    try {
      await collections.remove(slug);
    } catch {
      setItems(previous);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Collections</h1>

      {loading ? (
        <p className="text-sm text-inksoft">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-inksoft mb-8">
          No collections yet — group your snippets into folders below.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {items.map((c) => (
            <div
              key={c.slug}
              className="bg-white border border-line rounded-lg p-5 hover:border-accent transition-colors"
            >
              <Link to={`/c/${c.slug}`} className="block">
                <h3 className="font-semibold text-[15px]">{c.name}</h3>
                {c.description && (
                  <p className="text-sm text-inksoft mt-1.5">{c.description}</p>
                )}
                <div className="text-xs text-inksoft mt-3">
                  {c.snippet_count} snippet{c.snippet_count === 1 ? "" : "s"}
                </div>
              </Link>
              <button
                onClick={() => handleDelete(c.slug)}
                className="text-xs text-red-600 hover:underline mt-3"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white border border-line rounded-lg p-5 max-w-md">
        <h2 className="text-sm font-semibold text-inksoft mb-3">New collection</h2>
        <form onSubmit={handleCreate} className="space-y-3">
          <input
            className="w-full border border-line rounded-md px-3 py-2 text-sm"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="w-full border border-line rounded-md px-3 py-2 text-sm"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={creating || !name.trim()}
            className="bg-ink text-white rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {creating ? "Creating…" : "Create collection"}
          </button>
        </form>
      </div>
    </div>
  );
}
