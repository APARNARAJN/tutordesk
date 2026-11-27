import Link from "next/link";
import { db } from "@/lib/db";
import { enquire } from "@/app/actions";
export const dynamic = "force-dynamic";

export default async function P({ params, searchParams }: any) {
  const { data: t } = await db.from("tutors").select("*").eq("slug", params.slug).maybeSingle();
  if (!t) return (
    <main className="box notice">
      <h2>Tutor not found</h2>
      <p className="muted">This link may be mistyped or the profile may have been removed.</p>
      <Link href="/" className="btn">Back to home</Link>
    </main>
  );
  const chips = [
    ...(t.subjects ?? []),
    t.classes && `Classes ${t.classes}`,
    t.mode, t.location,
    t.rate_per_hour && `₹${t.rate_per_hour}/hour`,
  ].filter(Boolean);

  return (
    <main>
      <Link href="/" className="back">← TutorDesk</Link>
      <div className="box">
        <div className="profile-head">
          <div className="avatar" aria-hidden>{t.name?.[0]?.toUpperCase()}</div>
          <div><h1 style={{ fontSize: "1.8rem" }}>{t.name}</h1><span className="muted">Private tutor</span></div>
        </div>
        {chips.length > 0 && <div className="chips">{chips.map((c: string) => <span className="chip" key={c}>{c}</span>)}</div>}
        {t.bio && <p>{t.bio}</p>}
      </div>

      {searchParams.sent ? (
        <div className="box success">
          <h3>Enquiry sent</h3>
          <p>{t.name} will reply soon.</p>
          <Link href="/" className="btn alt">Back to home</Link>
        </div>
      ) : (
        <form action={enquire} className="box">
          <h2>Send an enquiry</h2>
          <input type="hidden" name="tutor_id" value={t.id} /><input type="hidden" name="slug" value={t.slug} />
          <label htmlFor="parent_name">Your name</label><input id="parent_name" name="parent_name" required />
          <label htmlFor="parent_email">Email</label><input id="parent_email" name="parent_email" type="email" required />
          <label htmlFor="parent_phone">Phone</label><input id="parent_phone" name="parent_phone" />
          <label htmlFor="student_class">Student&apos;s class</label><input id="student_class" name="student_class" />
          <label htmlFor="message">What do you need help with?</label><textarea id="message" name="message" rows={4} />
          <button>Send enquiry</button>
        </form>
      )}
    </main>
  );
}
