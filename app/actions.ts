"use server";
import { db, tutorByToken, slugify } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function signup(f: FormData) {
  const name = String(f.get("name"));
  const regPaid = f.get("reg_paid_confirm") === "on";
  const { data } = await db
    .from("tutors")
    .insert({ name, slug: slugify(name), reg_paid: regPaid })
    .select()
    .single();
  if (data) {
    await db.from("payments").insert({
      tutor_id: data.id,
      kind: "reg_fee",
      amount: 200,
      status: regPaid ? "paid" : "pending",
    });
  }
  redirect(`/dashboard?key=${data.token}`);
}
export async function confirmRegPayment(f: FormData) {
  const t = await tutorByToken(String(f.get("key")));
  if (!t) return;
  await db.from("tutors").update({ reg_paid: true }).eq("id", t.id);
  const { data: existing } = await db
    .from("payments")
    .select("id")
    .eq("tutor_id", t.id)
    .eq("kind", "reg_fee");
  if (existing?.length) {
    await db
      .from("payments")
      .update({ status: "paid" })
      .eq("tutor_id", t.id)
      .eq("kind", "reg_fee");
  } else {
    await db
      .from("payments")
      .insert({ tutor_id: t.id, kind: "reg_fee", amount: 200, status: "paid" });
  }
  revalidatePath("/dashboard");
}
export async function enquire(f: FormData) {
  await db.from("enquiries").insert({ tutor_id: f.get("tutor_id"), parent_name: f.get("parent_name"), parent_email: f.get("parent_email"),
    parent_phone: f.get("parent_phone"), student_class: f.get("student_class"), message: f.get("message") });
  redirect(`/t/${f.get("slug")}?sent=1`);
}
export async function saveReply(f: FormData) {
  const t = await tutorByToken(String(f.get("key")));
  if (!t) return;
  const { data: r } = await db.from("replies").select("*, enquiries!inner(tutor_id,parent_email,id)").eq("id", f.get("id")).eq("enquiries.tutor_id", t.id).maybeSingle();
  if (!r) return;
  const body = String(f.get("body"));
  if (f.get("act") === "send") {
    if (process.env.RESEND_API_KEY && r.enquiries.parent_email)
      await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: process.env.MAIL_FROM, to: r.enquiries.parent_email, subject: `Reply from ${t.name}`, text: body }) });
    await db.from("replies").update({ body, status: "sent", sent_at: new Date().toISOString() }).eq("id", r.id);
    await db.from("enquiries").update({ status: "replied" }).eq("id", r.enquiries.id);
  } else await db.from("replies").update({ body }).eq("id", r.id);
  revalidatePath("/dashboard");
}
export async function setStatus(f: FormData) {
  const t = await tutorByToken(String(f.get("key")));
  if (!t) return;
  const id = String(f.get("id")), status = String(f.get("status"));
  await db.from("enquiries").update({ status }).eq("id", id).eq("tutor_id", t.id);
  if (status === "active") {
    const { data } = await db.from("payments").select("id").eq("enquiry_id", id).eq("kind", "client_fee");
    if (!data?.length) await db.from("payments").insert({ tutor_id: t.id, enquiry_id: id, kind: "client_fee", amount: 1000 });
  }
  revalidatePath("/dashboard");
}
export async function markPaid(f: FormData) {
  const t = await tutorByToken(String(f.get("key")));
  if (t) await db.from("payments").update({ status: "paid" }).eq("id", f.get("id")).eq("tutor_id", t.id);
  revalidatePath("/dashboard");
}
export async function saveMaterial(f: FormData) {
  const t = await tutorByToken(String(f.get("key")));
  if (t) await db.from("materials").update({ title: f.get("title"), content: f.get("content") }).eq("id", f.get("id")).eq("tutor_id", t.id);
  revalidatePath("/dashboard");
}

function extractToken(raw: string): string {
  const s = raw.trim();
  if (!s) return "";
  const keyMatch = s.match(/[?&]key=([^&#\s]+)/i);
  if (keyMatch?.[1]) return decodeURIComponent(keyMatch[1]);
  const mcpMatch = s.match(/\/api\/mcp\/([^/?#\s]+)/i);
  if (mcpMatch?.[1]) return decodeURIComponent(mcpMatch[1]);
  return s;
}

export async function loginWithKey(f: FormData) {
  const token = extractToken(String(f.get("key_or_url") || ""));
  const t = token ? await tutorByToken(token) : null;
  if (!t) redirect("/dashboard?error=invalid");
  redirect(`/dashboard?key=${encodeURIComponent(t.token)}`);
}
