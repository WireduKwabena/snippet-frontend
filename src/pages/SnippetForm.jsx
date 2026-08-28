import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { collections, snippets } from "../api";

const LANGUAGES = [
  "python", "javascript", "typescript", "dart", "java",
  "go", "rust", "sql", "bash", "html", "css", "other",
];

export default function SnippetForm() {
  const { slug } = useParams();
  const editing = Boolean(slug);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    code: "",
    language: "javascript",
    tags: "",
    collection: "",
    is_public: true,
  });
  const [myCollections, setMyCollections] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    collections
      .list()
      .then((data) => setMyCollections(data.results ?? data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (editing) {
      snippets.get(slug).then((data) =>
        setForm({
          title: data.title,
          description: data.description,
          code: data.code,
          language: data.language,
          tags: data.tag_names.join(", "),
          collection: data.collection_info?.slug || "",
          is_public: data.is_public,
        })
      );
    }
  }, [slug, editing]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const payload = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    try {
      const result = editing
        ? await snippets.update(slug, payload)
        : await snippets.create(payload);
      navigate(`/s/${result.slug}`);
    } catch {
      setError("Couldn't save the snippet. Check the fields and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">{editing ? "Edit snippet" : "New snippet"}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border border-line rounded-md px-3 py-2 text-sm"
          placeholder="Title"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          required
        />
        <input
          className="w-full border border-line rounded-md px-3 py-2 text-sm"
          placeholder="Short description (optional)"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
        />
        <div className="flex gap-3">
          <select
            className="border border-line rounded-md px-3 py-2 text-sm"
            value={form.language}
            onChange={(e) => update("language", e.target.value)}
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <input
            className="flex-1 border border-line rounded-md px-3 py-2 text-sm"
            placeholder="tags, comma, separated"
            value={form.tags}
            onChange={(e) => update("tags", e.target.value)}
          />
        </div>
        {myCollections.length > 0 && (
          <select
            className="w-full border border-line rounded-md px-3 py-2 text-sm"
            value={form.collection}
            onChange={(e) => update("collection", e.target.value)}
          >
            <option value="">No collection</option>
            {myCollections.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        )}
        <textarea
          className="w-full border border-line rounded-md px-3 py-2 text-sm font-mono-brand h-64"
          placeholder="Paste your code…"
          value={form.code}
          onChange={(e) => update("code", e.target.value)}
          required
        />
        <label className="flex items-center gap-2 text-sm text-inksoft">
          <input
            type="checkbox"
            checked={form.is_public}
            onChange={(e) => update("is_public", e.target.checked)}
          />
          Public (anyone with the link can view it)
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={loading}
          className="bg-ink text-white rounded-md px-5 py-2 text-sm font-medium disabled:opacity-60"
        >
          {loading ? "Saving…" : editing ? "Save changes" : "Create snippet"}
        </button>
      </form>
    </div>
  );
}
