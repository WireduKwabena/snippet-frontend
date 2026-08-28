import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SnippetCard from "../components/SnippetCard";
import { collections, snippets, users } from "../api";

export default function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [userSnippets, setUserSnippets] = useState([]);
  const [userCollections, setUserCollections] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);

    Promise.all([
      users.profile(username),
      snippets.list({ owner: username }),
      collections.list({ owner: username }),
    ])
      .then(([profileData, snippetsData, collectionsData]) => {
        setProfile(profileData);
        setUserSnippets(snippetsData.results ?? snippetsData);
        setUserCollections(collectionsData.results ?? collectionsData);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [username]);

  function handleSnippetDeleted(slug) {
    setUserSnippets((prev) => prev.filter((s) => s.slug !== slug));
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto px-6 py-16 text-sm text-inksoft">Loading…</div>;
  }

  if (notFound || !profile) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <p className="text-inksoft">No user found at this profile.</p>
      </div>
    );
  }

  const joined = new Date(profile.date_joined).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold">{profile.username}</h1>
      <p className="text-sm text-inksoft mt-1">
        Joined {joined} · {profile.public_snippet_count} public snippet
        {profile.public_snippet_count === 1 ? "" : "s"}
      </p>

      {userCollections.length > 0 && (
        <>
          <h2 className="text-sm font-semibold text-inksoft mt-8 mb-3">Collections</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {userCollections.map((c) => (
              <Link
                key={c.slug}
                to={`/c/${c.slug}`}
                className="block bg-white border border-line rounded-lg p-5 hover:border-accent transition-colors"
              >
                <h3 className="font-semibold text-[15px]">{c.name}</h3>
                {c.description && (
                  <p className="text-sm text-inksoft mt-1.5">{c.description}</p>
                )}
                <div className="text-xs text-inksoft mt-3">
                  {c.snippet_count} snippet{c.snippet_count === 1 ? "" : "s"}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      <h2 className="text-sm font-semibold text-inksoft mt-8 mb-3">Snippets</h2>
      {userSnippets.length === 0 ? (
        <p className="text-sm text-inksoft">No public snippets yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {userSnippets.map((s) => (
            <SnippetCard key={s.slug} snippet={s} onDeleted={handleSnippetDeleted} />
          ))}
        </div>
      )}
    </div>
  );
}
