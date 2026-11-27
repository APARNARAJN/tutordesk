import Link from "next/link";
import { db, tutorByToken } from "@/lib/db";
import { saveReply, setStatus, markPaid, saveMaterial } from "@/app/actions";
import { CopyButton } from "@/app/components/CopyButton";

export const dynamic = "force-dynamic";

const STATUS_LIST = ["new", "replied", "trial", "active", "closed"];

function statusPillClass(status: string) {
  switch (status) {
    case "new":
      return "pill pill-new";
    case "replied":
      return "pill pill-replied";
    case "trial":
      return "pill pill-trial";
    case "active":
    case "paid":
    case "sent":
      return "pill pill-active";
    case "pending":
      return "pill pill-pending";
    default:
      return "pill pill-closed";
  }
}

function formatMaterialType(type?: string) {
  if (!type) return "Material";
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function DashboardPage({ searchParams }: any) {
  const key = searchParams.key;
  const t = key && (await tutorByToken(key));

  if (!t) {
    return (
      <main className="page-main page-main-narrow">
        <div className="card card-elevated" style={{ textAlign: "center", padding: "2.5rem 1.5rem", marginTop: "2rem" }}>
          <span className="pill pill-teal" style={{ marginBottom: "1rem" }}>
            Private Tutor Workspace
          </span>
          <h1 style={{ fontSize: "1.6rem", marginBottom: "0.6rem" }}>
            Open your dashboard link
          </h1>
          <p style={{ maxWidth: "460px", margin: "0 auto 1.5rem" }}>
            Your TutorDesk dashboard is secured by your private URL token. Open
            the bookmark you received when you signed up, or create a new tutor
            profile to get started.
          </p>
          <div className="btn-row" style={{ justifyContent: "center" }}>
            <Link href="/" className="btn">
              Create a tutor profile
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const host = (process.env.APP_URL || "").replace(/\/$/, "");
  const profilePath = `/t/${t.slug}`;
  const profileUrl = host ? `${host}${profilePath}` : profilePath;
  const mcpUrl = `${host}/api/mcp/${t.token}`;

  const { data: enq } = await db
    .from("enquiries")
    .select("*, replies(*)")
    .eq("tutor_id", t.id)
    .order("created_at", { ascending: false });
  const { data: mats } = await db
    .from("materials")
    .select("*")
    .eq("tutor_id", t.id)
    .order("created_at", { ascending: false });
  const { data: pays } = await db
    .from("payments")
    .select("*")
    .eq("tutor_id", t.id);

  const totalEnq = enq?.length ?? 0;
  const newEnq = enq?.filter((e: any) => e.status === "new").length ?? 0;
  const activeCount = enq?.filter((e: any) => e.status === "active").length ?? 0;
  const matCount = mats?.length ?? 0;
  const pendingTotal =
    pays
      ?.filter((p: any) => p.status === "pending")
      .reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0) ?? 0;
  const paidTotal =
    pays
      ?.filter((p: any) => p.status === "paid")
      .reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0) ?? 0;

  return (
    <main className="page-main">
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <span className="pill pill-teal" style={{ marginBottom: "0.55rem" }}>
            Tutor Dashboard
          </span>
          <h1 style={{ marginBottom: "0.3rem" }}>{t.name}&apos;s Workspace</h1>
          <p style={{ margin: 0, fontSize: "0.94rem" }}>
            {[
              t.subjects?.length ? t.subjects.join(", ") : null,
              t.classes ? `Classes ${t.classes}` : null,
              t.mode,
              t.location,
              t.rate_per_hour ? `₹${t.rate_per_hour}/hr` : null,
            ]
              .filter(Boolean)
              .join(" · ") || "Connect Claude to populate your subjects, classes, and bio."}
          </p>
        </div>

        <div className="btn-row">
          <Link href={profilePath} className="btn btn-alt">
            View public profile ↗
          </Link>
        </div>
      </div>

      {/* Stats */}
      <section className="grid-4" aria-label="Workspace overview">
        <div className="stat-card">
          <div className="stat-label">Enquiries</div>
          <div className="stat-value">{totalEnq}</div>
          <div className="stat-sub">
            {newEnq > 0 ? `${newEnq} awaiting reply` : "All caught up"}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Students</div>
          <div className="stat-value">{activeCount}</div>
          <div className="stat-sub">Marked active</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Materials</div>
          <div className="stat-value">{matCount}</div>
          <div className="stat-sub">Shared plans &amp; papers</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Fees</div>
          <div className="stat-value">₹{pendingTotal}</div>
          <div className="stat-sub">₹{paidTotal} collected</div>
        </div>
      </section>

      {/* Setup & Share Links */}
      <section className="grid-2" style={{ marginTop: "1.25rem" }}>
        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <h3 style={{ margin: 0 }}>Public Tutor Profile</h3>
            <span className="pill pill-active">Live</span>
          </div>
          <p style={{ fontSize: "0.86rem", margin: "0 0 0.75rem" }}>
            Share this link with parents so they can view your details and send
            tuition enquiries.
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.65rem",
              background: "var(--surface-muted)",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius-sm)",
              padding: "0.55rem 0.75rem",
            }}
          >
            <Link
              href={profilePath}
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                wordBreak: "break-all",
              }}
            >
              {profileUrl}
            </Link>
            <CopyButton text={profileUrl} label="Copy link" />
          </div>
        </div>

        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <h3 style={{ margin: 0 }}>Connect to Claude (MCP)</h3>
            <span className="pill pill-teal">Private URL</span>
          </div>
          <p style={{ fontSize: "0.86rem", margin: "0 0 0.75rem" }}>
            In Claude: <strong>Settings → Connectors → Add custom connector</strong>{" "}
            and paste this private URL:
          </p>
          <div className="code-bar">
            <span>{mcpUrl}</span>
            <CopyButton text={mcpUrl} label="Copy URL" />
          </div>
        </div>
      </section>

      {/* Enquiries */}
      <section className="dash-section" id="enquiries">
        <div className="section-header">
          <div>
            <h2>Enquiries ({totalEnq})</h2>
            <p>Track parent requests, update student statuses, and review Claude&apos;s reply drafts.</p>
          </div>
        </div>

        {!enq?.length ? (
          <div className="card" style={{ textAlign: "center", padding: "2rem 1.25rem" }}>
            <h3 style={{ marginBottom: "0.35rem" }}>No enquiries yet</h3>
            <p style={{ margin: "0 auto 1rem", maxWidth: "440px", fontSize: "0.92rem" }}>
              Share your public profile link with parents or on WhatsApp to start
              receiving tuition enquiries here.
            </p>
            <CopyButton text={profileUrl} label="Copy profile link" variant="primary" />
          </div>
        ) : (
          enq.map((e: any) => (
            <article className="card enquiry-card" key={e.id}>
              <div className="enquiry-head">
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", flexWrap: "wrap" }}>
                    <h3 style={{ margin: 0 }}>{e.parent_name || "Parent"}</h3>
                    {e.student_class && (
                      <span className="tag">Class {e.student_class}</span>
                    )}
                    <span className={statusPillClass(e.status)}>{e.status}</span>
                  </div>
                  <div className="enquiry-meta">
                    {e.parent_email && <span>{e.parent_email}</span>}
                    {e.parent_phone && <span>{e.parent_phone}</span>}
                  </div>
                </div>

                <form action={setStatus} className="inline-status-form">
                  <input type="hidden" name="key" value={key} />
                  <input type="hidden" name="id" value={e.id} />
                  <select name="status" defaultValue={e.status} aria-label="Enquiry status">
                    {STATUS_LIST.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button className="alt btn-sm">Update status</button>
                </form>
              </div>

              {e.message && <div className="enquiry-msg">{e.message}</div>}

              {e.replies?.map((r: any) => (
                <form action={saveReply} key={r.id} className="reply-panel">
                  <input type="hidden" name="key" value={key} />
                  <input type="hidden" name="id" value={r.id} />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "0.45rem",
                    }}
                  >
                    <label htmlFor={`reply-${r.id}`} style={{ margin: 0 }}>
                      Reply message
                    </label>
                    <span className={statusPillClass(r.status)}>{r.status}</span>
                  </div>
                  <textarea
                    id={`reply-${r.id}`}
                    name="body"
                    rows={5}
                    defaultValue={r.body}
                  />
                  <div className="btn-row">
                    <button name="act" value="send">
                      Send reply
                    </button>
                    <button name="act" value="save" className="alt">
                      Save draft
                    </button>
                  </div>
                </form>
              ))}
            </article>
          ))
        )}
      </section>

      {/* Materials */}
      <section className="dash-section" id="materials">
        <div className="section-header">
          <div>
            <h2>Materials ({matCount})</h2>
            <p>Edit lesson plans, question papers, or study tips and share direct links with parents.</p>
          </div>
        </div>

        {!mats?.length ? (
          <div className="card" style={{ textAlign: "center", padding: "1.75rem 1.25rem" }}>
            <p style={{ margin: 0, fontSize: "0.92rem" }}>
              No materials saved yet. Ask Claude to generate a lesson plan,
              question paper, or study tips for an enquiry.
            </p>
          </div>
        ) : (
          <div className="grid-2">
            {mats.map((m: any) => {
              const sharePath = `/m/${m.id}`;
              const shareUrl = host ? `${host}${sharePath}` : sharePath;
              return (
                <form action={saveMaterial} className="card" key={m.id}>
                  <input type="hidden" name="key" value={key} />
                  <input type="hidden" name="id" value={m.id} />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "0.65rem",
                    }}
                  >
                    <span className="pill pill-teal">
                      {formatMaterialType(m.type)}
                    </span>
                    <div className="btn-row">
                      <CopyButton text={shareUrl} label="Copy link" />
                      <Link href={sharePath} className="btn btn-alt btn-sm">
                        Open ↗
                      </Link>
                    </div>
                  </div>
                  <label htmlFor={`mat-title-${m.id}`}>Title</label>
                  <input id={`mat-title-${m.id}`} name="title" defaultValue={m.title} />
                  <label htmlFor={`mat-content-${m.id}`}>Content</label>
                  <textarea
                    id={`mat-content-${m.id}`}
                    name="content"
                    rows={8}
                    defaultValue={m.content}
                  />
                  <button type="submit">Save material</button>
                </form>
              );
            })}
          </div>
        )}
      </section>

      {/* Payments */}
      <section className="dash-section" id="payments">
        <div className="section-header">
          <div>
            <h2>Payments ({pays?.length ?? 0})</h2>
            <p>Fees created automatically when an enquiry is marked active.</p>
          </div>
        </div>

        {!pays?.length ? (
          <div className="card" style={{ textAlign: "center", padding: "1.75rem 1.25rem" }}>
            <p style={{ margin: 0, fontSize: "0.92rem" }}>
              No payment records yet. Moving an enquiry to <code>active</code>{" "}
              creates a pending fee entry here.
            </p>
          </div>
        ) : (
          pays.map((p: any) => (
            <form action={markPaid} key={p.id} className="payment-row">
              <input type="hidden" name="key" value={key} />
              <input type="hidden" name="id" value={p.id} />
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                <strong style={{ fontSize: "1.02rem" }}>₹{p.amount}</strong>
                <span style={{ color: "var(--ink-soft)", fontSize: "0.9rem" }}>
                  {formatMaterialType(p.kind)}
                </span>
                <span className={statusPillClass(p.status)}>{p.status}</span>
              </div>
              {p.status === "pending" && (
                <button className="alt btn-sm">Mark paid</button>
              )}
            </form>
          ))
        )}
      </section>
    </main>
  );
}
