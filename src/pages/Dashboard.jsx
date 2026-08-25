import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SnippetCard from "../components/SnippetCard";
import { snippets } from "../api";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    snippets
      .list({ mine: "true" })
      .then((data) => setItems(data.results ?? data))
      .finally(() => setLoading(false));
  }, []);

  function handleDeleted(slug) {
    setItems((prev) => prev.filter((s) => s.slug !== slug));
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My snippets</h1>
        <Link
          to="/new"
          className="px-4 py-2 rounded-md bg-ink text-white text-sm font-medium"
        >
          + New snippet
        </Link>
      </div>
      {loading ? (
        <p className="text-sm text-inksoft">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-inksoft">
          You haven't saved any snippets yet.{" "}
          <Link to="/new" className="text-accent underline">
            Create your first one
          </Link>
          .
        </p>
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
