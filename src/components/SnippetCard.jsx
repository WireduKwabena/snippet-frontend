import { Link } from "react-router-dom";

export default function SnippetCard({ snippet }) {
  return (
    <Link
      to={`/s/${snippet.slug}`}
      className="block bg-white border border-line rounded-lg p-5 hover:border-accent transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-[15px]">{snippet.title}</h3>
        <span className="font-mono-brand text-[11px] text-accent bg-accentsoft px-2 py-0.5 rounded">
          {snippet.language}
        </span>
      </div>
      {snippet.description && (
        <p className="text-sm text-inksoft mt-1.5">{snippet.description}</p>
      )}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {snippet.tag_names?.map((t) => (
          <span key={t} className="font-mono-brand text-[11px] text-inksoft bg-[#EFEFF2] px-2 py-0.5 rounded">
            #{t}
          </span>
        ))}
      </div>
      <div className="text-xs text-inksoft mt-3">
        by {snippet.owner} · {snippet.view_count} views
      </div>
    </Link>
  );
}
