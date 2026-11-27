import "./globals.css";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

export const metadata = {
  title: "TutorDesk — AI-Powered Desk for Independent Tutors",
  description:
    "Get your tuition enquiries answered in minutes. Connect Claude via MCP to draft replies, lesson plans, and question papers while TutorDesk keeps your profile live.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div className="app-shell">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
