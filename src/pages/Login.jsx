import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await auth.login(username, password);
      navigate("/dashboard");
    } catch {
      setError("Couldn't log in. Check your username and password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-6">Log in</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border border-line rounded-md px-3 py-2 text-sm"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="w-full border border-line rounded-md px-3 py-2 text-sm"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={loading}
          className="w-full bg-ink text-white rounded-md py-2 text-sm font-medium disabled:opacity-60"
        >
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>
    </div>
  );
}
