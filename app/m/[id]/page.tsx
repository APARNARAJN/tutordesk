import Link from "next/link";
import { db } from "@/lib/db";
export const dynamic = "force-dynamic";

export default async function M({ params }: any) {
  const { data: m } = await db.from("materials").select("*").eq("id", params.id).maybeSingle();
  if (!m) return (
    <main className="box notice">
      <h2>Not found</h2>
      <p className="muted">This material link is invalid or has been removed.</p>
      <Link href="/" className="btn">Back to home</Link>
    </main>
  );
  return (
    <main>
      <Link href="/" className="back">← TutorDesk</Link>
      <article className="box"><h1 style={{ fontSize: "1.8rem" }}>{m.title}</h1><div className="material">{m.content}</div></article>
    </main>
  );
}
