import { db } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function M({ params }: any) {
  const { data: m } = await db.from("materials").select("*").eq("id", params.id).maybeSingle();
  if (!m) return <p>Not found.</p>;
  return <main><h1>{m.title}</h1><div style={{ whiteSpace: "pre-wrap" }}>{m.content}</div></main>;
}
