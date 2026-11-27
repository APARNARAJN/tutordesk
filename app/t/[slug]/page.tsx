import Link from "next/link";
import { db } from "@/lib/db";
import { enquire } from "@/app/actions";

export const dynamic = "force-dynamic";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function TutorProfilePage({ params, searchParams }: any) {
  const { data: t } = await db
    .from("tutors")
    .select("*")
    .eq("slug", params.slug)
    .maybeSingle();

  if (!t) {
    return (
      <main className="page-main page-main-narrow">
        <div className="card" style={{ textAlign: "center", padding: "2.5rem 1.5rem", marginTop: "2rem" }}>
          <h1 style={{ fontSize: "1.6rem", marginBottom: "0.5rem" }}>Tutor not found</h1>
          <p style={{ margin: "0 auto 1.5rem", maxWidth: "420px" }}>
            We couldn&apos;t find a tutor profile at this link. Please check the URL
            or create a new TutorDesk profile.
          </p>
          <Link href="/" className="btn">
            Go to TutorDesk
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-main">
      <div className="profile-layout">
        {/* Tutor Bio & Details */}
        <section className="card card-elevated">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <div className="avatar-circle" aria-hidden="true">
              {initials(t.name || "T")}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                <h1 style={{ fontSize: "1.65rem", margin: 0 }}>{t.name}</h1>
                {t.verified && <span className="pill pill-active">Verified</span>}
              </div>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.9rem", color: "var(--ink-muted)" }}>
                {[
                  t.classes ? `Classes ${t.classes}` : null,
                  t.mode ? `Mode: ${t.mode}` : null,
                  t.location || null,
                ]
                  .filter(Boolean)
                  .join(" · ") || "Independent Tutor"}
              </p>
            </div>
          </div>

          {t.rate_per_hour && (
            <div
              className="card-muted"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <span style={{ fontSize: "0.88rem", color: "var(--ink-soft)", fontWeight: 500 }}>
                Hourly tuition rate
              </span>
              <strong style={{ fontSize: "1.15rem", color: "var(--accent)" }}>
                ₹{t.rate_per_hour} / hour
              </strong>
            </div>
          )}

          {t.subjects?.length > 0 && (
            <div>
              <div style={{ fontSize: "0.8rem", fontWeight: 650, color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Subjects taught
              </div>
              <div className="tag-list">
                {t.subjects.map((subj: string) => (
                  <span className="tag" key={subj}>
                    {subj}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: "1rem" }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 650, color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.4rem" }}>
              About the tutor
            </div>
            <p style={{ margin: 0, whiteSpace: "pre-wrap", color: "var(--ink-soft)" }}>
              {t.bio || `${t.name} hasn't added a bio yet. Send an enquiry to ask about availability, subjects, and trial classes.`}
            </p>
          </div>
        </section>

        {/* Enquiry Form */}
        <section>
          {searchParams.sent ? (
            <div className="card card-elevated" style={{ textAlign: "center", padding: "2.25rem 1.5rem" }}>
              <span className="pill pill-active" style={{ marginBottom: "0.85rem" }}>
                Enquiry received
              </span>
              <h2 style={{ marginBottom: "0.5rem" }}>Thank you!</h2>
              <p style={{ margin: "0 auto 1.25rem", maxWidth: "400px" }}>
                Your enquiry has been sent to <strong>{t.name}</strong>. They will
                review your message and reply shortly.
              </p>
              <Link href={`/t/${t.slug}`} className="btn btn-alt">
                Send another enquiry
              </Link>
            </div>
          ) : (
            <form action={enquire} className="card card-elevated">
              <h2 style={{ marginBottom: "0.25rem" }}>Send an enquiry</h2>
              <p style={{ margin: "0 0 1.25rem", fontSize: "0.9rem" }}>
                Share a few details about the student and what help you&apos;re looking for.
              </p>

              <input type="hidden" name="tutor_id" value={t.id} />
              <input type="hidden" name="slug" value={t.slug} />

              <label htmlFor="parent_name">Your name *</label>
              <input
                id="parent_name"
                name="parent_name"
                placeholder="Parent or student name"
                required
              />

              <div className="grid-2" style={{ gap: "0.75rem" }}>
                <div>
                  <label htmlFor="parent_email">Email *</label>
                  <input
                    id="parent_email"
                    name="parent_email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="parent_phone">Phone</label>
                  <input
                    id="parent_phone"
                    name="parent_phone"
                    placeholder="+91 98..."
                  />
                </div>
              </div>

              <label htmlFor="student_class">Student&apos;s class / grade</label>
              <input
                id="student_class"
                name="student_class"
                placeholder="e.g. Class 9 CBSE"
              />

              <label htmlFor="message">What do you need help with?</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Subjects, preferred schedule, online or home tuition..."
              />

              <button type="submit" style={{ width: "100%" }}>
                Send enquiry to {t.name}
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
