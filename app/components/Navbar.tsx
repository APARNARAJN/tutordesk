"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const KEY_STORAGE = "tutordesk_key";

function NavbarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [savedKey, setSavedKey] = useState<string | null>(null);

  const urlKey = searchParams.get("key");

  useEffect(() => {
    try {
      if (pathname.startsWith("/dashboard") && urlKey) {
        localStorage.setItem(KEY_STORAGE, urlKey);
        setSavedKey(urlKey);
      } else {
        setSavedKey(localStorage.getItem(KEY_STORAGE));
      }
    } catch {
      setSavedKey(urlKey);
    }
  }, [pathname, urlKey]);

  const activeKey = (pathname.startsWith("/dashboard") ? urlKey : null) || savedKey;
  const isDashboard = pathname === "/dashboard";
  const dashboardHref = activeKey
    ? `/dashboard?key=${encodeURIComponent(activeKey)}`
    : "/dashboard";

  const close = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="brand" onClick={close}>
          <span className="brand-mark" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              <path d="M8 7h8" />
              <path d="M8 11h5" />
            </svg>
          </span>
          <span>TutorDesk</span>
          <span className="brand-badge">MCP</span>
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          <Link
            href="/"
            className={`nav-link ${pathname === "/" ? "nav-link-active" : ""}`}
          >
            Home
          </Link>
          {isDashboard && activeKey ? (
            <>
              <a href="#enquiries" className="nav-link">Enquiries</a>
              <a href="#materials" className="nav-link">Materials</a>
              <a href="#payments" className="nav-link">Payments</a>
              <Link href={dashboardHref} className="nav-link nav-link-active">
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link href="/#how-it-works" className="nav-link">
                How it works
              </Link>
              <Link
                href={dashboardHref}
                className={`nav-link ${isDashboard ? "nav-link-active" : ""}`}
              >
                {activeKey ? "Dashboard" : "Log in"}
              </Link>
              <Link href="/#get-started" className="nav-cta">
                Create profile
              </Link>
            </>
          )}
        </nav>

        <button
          type="button"
          className="nav-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      <div className={`nav-mobile ${open ? "open" : ""}`}>
        <div className="nav-mobile-list">
          <Link
            href="/"
            className={`nav-link ${pathname === "/" ? "nav-link-active" : ""}`}
            onClick={close}
          >
            Home
          </Link>
          {isDashboard && activeKey ? (
            <>
              <a href="#enquiries" className="nav-link" onClick={close}>Enquiries</a>
              <a href="#materials" className="nav-link" onClick={close}>Materials</a>
              <a href="#payments" className="nav-link" onClick={close}>Payments</a>
            </>
          ) : (
            <>
              <Link href="/#how-it-works" className="nav-link" onClick={close}>
                How it works
              </Link>
              <Link
                href={dashboardHref}
                className={`nav-link ${isDashboard ? "nav-link-active" : ""}`}
                onClick={close}
              >
                {activeKey ? "Dashboard" : "Log in"}
              </Link>
              <Link href="/#get-started" className="nav-cta" onClick={close} style={{ marginLeft: 0, textAlign: "center", marginTop: "0.25rem" }}>
                Create profile
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function Navbar() {
  return (
    <Suspense
      fallback={
        <header className="navbar">
          <div className="navbar-inner">
            <Link href="/" className="brand">
              <span className="brand-mark" aria-hidden="true">TD</span>
              <span>TutorDesk</span>
            </Link>
          </div>
        </header>
      }
    >
      <NavbarInner />
    </Suspense>
  );
}
