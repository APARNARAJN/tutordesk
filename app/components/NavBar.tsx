"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const KEY_STORAGE = "tutordesk_key";

export default function NavBar() {
  const path = usePathname();
  const [key, setKey] = useState<string | null>(null);

  useEffect(() => {
    try {
      const fromUrl = new URLSearchParams(window.location.search).get("key");
      if (path.startsWith("/dashboard") && fromUrl) localStorage.setItem(KEY_STORAGE, fromUrl);
      setKey(fromUrl && path.startsWith("/dashboard") ? fromUrl : localStorage.getItem(KEY_STORAGE));
    } catch { setKey(null); }
  }, [path]);

  const onDash = path.startsWith("/dashboard");
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link href="/" className="brand" aria-label="TutorDesk home">
          <span className="logo">T</span>TutorDesk
        </Link>
        <nav className="nav-links">
          <Link href="/" className={path === "/" ? "active" : ""}>Home</Link>
          {key ? (
            <Link href={`/dashboard?key=${key}`} className={onDash ? "active" : ""}>Dashboard</Link>
          ) : (
            <Link href="/#start" className="nav-cta">Get started</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
