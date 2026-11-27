import { db } from "@/lib/db";
import { enquire } from "@/app/actions";
export const dynamic = "force-dynamic";
export default async function P({ params, searchParams }: any) {
  const { data: t } = await db.from("tutors").select("*").eq("slug", params.slug).maybeSingle();
  if (!t) return <p>Tutor not found.</p>;
  return (<main><h1>{t.name}</h1>
    <p>{t.subjects?.join(", ")} · Classes {t.classes} · {t.mode} · {t.location} {t.rate_per_hour ? `· ₹${t.rate_per_hour}/hour` : ""}</p>
    <p>{t.bio}</p>
    {searchParams.sent ? <p className="box">Enquiry sent. {t.name} will reply soon.</p> :
    <form action={enquire} className="box"><h3>Send an enquiry</h3>
      <input type="hidden" name="tutor_id" value={t.id} /><input type="hidden" name="slug" value={t.slug} />
      <label>Your name</label><input name="parent_name" required />
      <label>Email</label><input name="parent_email" type="email" required />
      <label>Phone</label><input name="parent_phone" />
      <label>Student's class</label><input name="student_class" />
      <label>What do you need help with?</label><textarea name="message" rows={4} />
      <button>Send enquiry</button></form>}</main>);
}
