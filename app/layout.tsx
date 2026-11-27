import "./globals.css";
import type { Metadata, Viewport } from "next";
import NavBar from "./components/NavBar";

export const metadata: Metadata = {
  title: { default: "TutorDesk", template: "%s · TutorDesk" },
  description: "A live tutor profile, enquiry inbox and payment tracker, with replies and lesson plans written by Claude.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0f766e" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <div className="page">{children}</div>
        <footer className="footer">
          <div className="container">
            <span><b>TutorDesk</b> · Claude writes. TutorDesk keeps it live.</span>
            <span className="muted">Made in Kerala</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
