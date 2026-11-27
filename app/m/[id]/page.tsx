import Link from "next/link";
import { db } from "@/lib/db";
import { PrintButton } from "@/app/components/PrintButton";

export const dynamic = "force-dynamic";

function formatType(type?: string) {
  if (!type) return "Study Material";
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function MaterialPage({ params }: any) {
  const { data: m } = await db
    .from("materials")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (!m) {
    return (
      <main className="page-main page-main-narrow">
        <div className="card" style={{ textAlign: "center", padding: "2.5rem 1.5rem", marginTop: "2rem" }}>
          <h1 style={{ fontSize: "1.6rem", marginBottom: "0.5rem" }}>Material not found</h1>
          <p style={{ margin: "0 auto 1.5rem", maxWidth: "420px" }}>
            This shared study link may have expired or does not exist.
          </p>
          <Link href="/" className="btn">
            Go to TutorDesk
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-main page-main-narrow">
      <article className="material-sheet">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
            marginBottom: "0.85rem",
          }}
        >
          <span className="pill pill-teal">{formatType(m.type)}</span>
          <PrintButton />
        </div>
        <h1 style={{ marginBottom: 0 }}>{m.title}</h1>
        <div className="material-body">{m.content}</div>
      </article>
    </main>
  );
}
