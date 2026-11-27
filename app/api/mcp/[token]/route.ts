import { db, tutorByToken, slugify } from "@/lib/db";
const S = (props: any, req: string[] = []) => ({ type: "object", properties: props, required: req });
const str = { type: "string" };
const TOOLS = [
  { name: "create_or_update_profile", description: "Create or update the tutor's public profile page. Returns the live URL.",
    inputSchema: S({ name: str, subjects: { type: "array", items: str }, classes: str, mode: { type: "string", enum: ["online", "offline", "both"] }, location: str, rate_per_hour: { type: "number" }, bio: str }) },
  { name: "list_enquiries", description: "List parent enquiries, optionally filtered by status (new, replied, trial, active, closed).", inputSchema: S({ status: str }) },
  { name: "save_reply_draft", description: "Save a reply to a parent as a draft. The tutor reviews, edits and sends it in the dashboard.", inputSchema: S({ enquiry_id: str, body: str }, ["enquiry_id", "body"]) },
  { name: "save_material", description: "Save a lesson plan, question paper or study tips (markdown). Returns a shareable link for the parent.",
    inputSchema: S({ type: { type: "string", enum: ["lesson_plan", "question_paper", "study_tips"] }, title: str, content: str, enquiry_id: str }, ["type", "title", "content"]) },
  { name: "update_enquiry_status", description: "Set enquiry status. Setting 'active' creates a pending client fee.", inputSchema: S({ enquiry_id: str, status: { type: "string", enum: ["new", "replied", "trial", "active", "closed"] } }, ["enquiry_id", "status"]) },
];
const base = () => process.env.APP_URL;
async function call(t: any, name: string, a: any) {
  if (name === "create_or_update_profile") {
    const row: any = { ...a }; if (typeof row.subjects === "string") row.subjects = [row.subjects];
    const { data } = t.name ? await db.from("tutors").update(row).eq("id", t.id).select().single() : { data: t };
    return `Profile live at ${base()}/t/${data.slug}`;
  }
  if (name === "list_enquiries") {
    let q = db.from("enquiries").select("id,parent_name,parent_email,student_class,message,status,created_at").eq("tutor_id", t.id).order("created_at", { ascending: false });
    if (a.status) q = q.eq("status", a.status);
    return JSON.stringify((await q).data);
  }
  if (name === "save_reply_draft") {
    const { data: e } = await db.from("enquiries").select("id").eq("id", a.enquiry_id).eq("tutor_id", t.id).maybeSingle();
    if (!e) return "Enquiry not found.";
    await db.from("replies").insert({ enquiry_id: e.id, body: a.body });
    return `Draft saved. Review and send at ${base()}/dashboard?key=${t.token}`;
  }
  if (name === "save_material") {
    const { data } = await db.from("materials").insert({ tutor_id: t.id, enquiry_id: a.enquiry_id || null, type: a.type, title: a.title, content: a.content }).select().single();
    return `Saved. Parent share link: ${base()}/m/${data.id}`;
  }
  if (name === "update_enquiry_status") {
    await db.from("enquiries").update({ status: a.status }).eq("id", a.enquiry_id).eq("tutor_id", t.id);
    if (a.status === "active") await db.from("payments").insert({ tutor_id: t.id, enquiry_id: a.enquiry_id, kind: "client_fee", amount: 1000 });
    return "Status updated.";
  }
  return "Unknown tool.";
}
export async function POST(req: Request, { params }: { params: { token: string } }) {
  const m = await req.json(); const t = await tutorByToken(params.token);
  const ok = (result: any) => Response.json({ jsonrpc: "2.0", id: m.id, result });
  if (!t) return Response.json({ jsonrpc: "2.0", id: m.id, error: { code: -32001, message: "Invalid connector URL" } }, { status: 401 });
  if (m.method === "initialize") return ok({ protocolVersion: m.params?.protocolVersion || "2025-03-26", capabilities: { tools: {} }, serverInfo: { name: "tutordesk", version: "0.1.0" } });
  if (m.method === "tools/list") return ok({ tools: TOOLS });
  if (m.method === "tools/call") {
    try { return ok({ content: [{ type: "text", text: await call(t, m.params.name, m.params.arguments || {}) }] }); }
    catch (e: any) { return ok({ isError: true, content: [{ type: "text", text: String(e.message) }] }); }
  }
  if (m.method === "ping") return ok({});
  return new Response(null, { status: 202 });
}
export async function GET() { return new Response("TutorDesk MCP endpoint. Use POST.", { status: 405 }); }
