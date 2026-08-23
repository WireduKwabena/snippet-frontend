import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await auth.register(username, email, password);
      navigate("/dashboard");
    } catch (err) {
      const data = err.response?.data;
      const message = data ? Object.values(data).flat().join(" ") : "Something went wrong.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-6">Create an account</h1>
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
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          {loading ? "Creating…" : "Sign up"}
        </button>
      </form>
    </div>
  );
}
