import { useEffect, useState } from "react";
import SnippetCard from "../components/SnippetCard";
import { snippets } from "../api";

export default function PublicFeed() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      snippets
        .list(search ? { search } : {})
        .then((data) => setItems(data.results ?? data))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  function handleDeleted(slug) {
    setItems((prev) => prev.filter((s) => s.slug !== slug));
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Explore snippets</h1>
        <input
          className="border border-line rounded-md px-3 py-2 text-sm w-64"
          placeholder="Search title, code, description…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {loading ? (
        <p className="text-sm text-inksoft">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-inksoft">No public snippets yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((s) => (
            <SnippetCard key={s.slug} snippet={s} onDeleted={handleDeleted} />
          ))}
        </div>
      )}
    </div>
  );
}
