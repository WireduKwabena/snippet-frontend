import { Link, useNavigate } from "react-router-dom";
import { auth } from "../api";

export default function Navbar() {
  const navigate = useNavigate();
  const loggedIn = auth.isLoggedIn();

  function handleLogout() {
    auth.logout();
    navigate("/login");
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#F7F8FA]/90 backdrop-blur border-b border-line">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-semibold tracking-tight">
          snippets<span className="text-accent">.</span>
        </Link>
        <div className="flex items-center gap-5 text-sm text-inksoft">
          <Link to="/" className="hover:text-accent">
            Explore
          </Link>
          {loggedIn ? (
            <>
              <Link to="/dashboard" className="hover:text-accent">
                My snippets
              </Link>
              <Link to="/new" className="hover:text-accent">
                New
              </Link>
              <button onClick={handleLogout} className="hover:text-accent">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-accent">
                Log in
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 rounded-md bg-ink text-white hover:opacity-90"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
