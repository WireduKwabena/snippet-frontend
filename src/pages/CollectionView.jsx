import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SnippetCard from "../components/SnippetCard";
import { collections } from "../api";

export default function CollectionView() {
  const { slug } = useParams();
  const [collection, setCollection] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    collections
      .get(slug)
      .then(setCollection)
      .catch(() => setNotFound(true));
  }, [slug]);

  function handleDeleted(snippetSlug) {
    setCollection((prev) => ({
      ...prev,
      snippets: prev.snippets.filter((s) => s.slug !== snippetSlug),
      snippet_count: prev.snippet_count - 1,
    }));
  }

  if (notFound) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <p className="text-inksoft">This collection doesn't exist.</p>
      </div>
    );
  }

  if (!collection) {
    return <div className="max-w-4xl mx-auto px-6 py-16 text-sm text-inksoft">Loading…</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold">{collection.name}</h1>
      {collection.description && (
        <p className="text-inksoft mt-1.5">{collection.description}</p>
      )}
      <p className="text-xs text-inksoft mt-3">
        by {collection.owner} · {collection.snippets.length} snippet
        {collection.snippets.length === 1 ? "" : "s"}
      </p>

      {collection.snippets.length === 0 ? (
        <p className="text-sm text-inksoft mt-8">Nothing in here yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4 mt-8">
          {collection.snippets.map((s) => (
            <SnippetCard key={s.slug} snippet={s} onDeleted={handleDeleted} />
          ))}
        </div>
      )}
    </div>
  );
}
