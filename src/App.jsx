import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import CollectionView from "./pages/CollectionView";
import Collections from "./pages/Collections";
import Dashboard from "./pages/Dashboard";
import EmbedView from "./pages/EmbedView";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import PublicFeed from "./pages/PublicFeed";
import Register from "./pages/Register";
import SnippetForm from "./pages/SnippetForm";
import SnippetView from "./pages/SnippetView";

export default function App() {
  const location = useLocation();
  // /embed/* is meant to sit inside someone else's <iframe> — no app chrome.
  const isEmbed = location.pathname.startsWith("/embed/");

  return (
    <div className="min-h-screen">
      {!isEmbed && <Navbar />}
      <Routes>
        <Route path="/" element={<PublicFeed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/s/:slug" element={<SnippetView />} />
        <Route path="/c/:slug" element={<CollectionView />} />
        <Route path="/u/:username" element={<Profile />} />
        <Route path="/embed/:slug" element={<EmbedView />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/collections"
          element={
            <ProtectedRoute>
              <Collections />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new"
          element={
            <ProtectedRoute>
              <SnippetForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/s/:slug/edit"
          element={
            <ProtectedRoute>
              <SnippetForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
