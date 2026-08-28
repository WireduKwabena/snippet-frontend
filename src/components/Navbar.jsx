import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../api";

export default function Navbar() {
  const navigate = useNavigate();
  const loggedIn = auth.isLoggedIn();
  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
  }

  function handleLogout() {
    auth.logout();
    close();
    navigate("/login");
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#F7F8FA]/90 backdrop-blur border-b border-line">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-semibold tracking-tight" onClick={close}>
            snippets<span className="text-accent">.</span>
          </Link>

          {/* Full nav — tablets and up */}
          <div className="hidden md:flex items-center gap-5 text-sm text-inksoft">
            <Link to="/" className="hover:text-accent">
              Explore
            </Link>
            {loggedIn ? (
              <>
                <Link to="/dashboard" className="hover:text-accent">
                  My snippets
                </Link>
                <Link to="/collections" className="hover:text-accent">
                  Collections
                </Link>
                <Link to={`/u/${auth.username()}`} className="hover:text-accent">
                  My profile
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

          {/* Hamburger — mobile and small tablets only */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden p-2 -mr-2 text-ink"
            aria-label="Open menu"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path
                d="M2 5.5H20M2 11H20M2 16.5H20"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/*
        Backdrop + drawer are siblings of <nav>, not children of it.
        <nav> has backdrop-blur, and per spec backdrop-filter creates a new
        containing block for `fixed` descendants — nesting these inside it
        made `h-full` resolve against nav's own ~65px height instead of the
        viewport, cutting the drawer off right after the header row.
      */}
      <div
        onClick={close}
        aria-hidden="true"
        className={`md:hidden fixed inset-0 z-40 bg-black/30 transition-opacity duration-200 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        role="dialog"
        aria-label="Menu"
        aria-modal="true"
        className={`md:hidden fixed top-0 right-0 z-50 h-full w-72 max-w-[80%] bg-white border-l border-line shadow-xl transform transition-transform duration-200 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-end px-5 py-4 border-b border-line">
          <button onClick={close} aria-label="Close menu" className="p-1 text-ink">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M2 2L16 16M16 2L2 16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-1 p-4 text-sm text-inksoft">
          <Link
            to="/"
            onClick={close}
            className="px-3 py-2.5 rounded-md hover:bg-accentsoft hover:text-accent"
          >
            Explore
          </Link>
          {loggedIn ? (
            <>
              <Link
                to="/dashboard"
                onClick={close}
                className="px-3 py-2.5 rounded-md hover:bg-accentsoft hover:text-accent"
              >
                My snippets
              </Link>
              <Link
                to="/collections"
                onClick={close}
                className="px-3 py-2.5 rounded-md hover:bg-accentsoft hover:text-accent"
              >
                Collections
              </Link>
              <Link
                to={`/u/${auth.username()}`}
                onClick={close}
                className="px-3 py-2.5 rounded-md hover:bg-accentsoft hover:text-accent"
              >
                My profile
              </Link>
              <Link
                to="/new"
                onClick={close}
                className="px-3 py-2.5 rounded-md hover:bg-accentsoft hover:text-accent"
              >
                New
              </Link>
              <button
                onClick={handleLogout}
                className="text-left px-3 py-2.5 rounded-md hover:bg-accentsoft hover:text-accent"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={close}
                className="px-3 py-2.5 rounded-md hover:bg-accentsoft hover:text-accent"
              >
                Log in
              </Link>
              <Link
                to="/register"
                onClick={close}
                className="mt-2 px-3 py-2.5 rounded-md bg-ink text-white text-center hover:opacity-90"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
