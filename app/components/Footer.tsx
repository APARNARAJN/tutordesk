import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <strong style={{ color: "var(--ink)" }}>TutorDesk</strong> · Claude writes. TutorDesk keeps it live.
        </div>
        <div className="footer-links">
          <Link href="/">Home</Link>
          <Link href="/#how-it-works">How it works</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>
      </div>
    </footer>
  );
}
