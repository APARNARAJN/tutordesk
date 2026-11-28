import Link from "next/link";
import { db, tutorByToken } from "@/lib/db";
import {
  saveReply,
  setStatus,
  markPaid,
  saveMaterial,
  confirmRegPayment,
  loginWithKey,
} from "@/app/actions";
import { CopyButton } from "@/app/components/CopyButton";
import { GPayQr } from "@/app/components/GPayQr";
import { LogoutButton } from "@/app/components/LogoutButton";

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

function formatPaymentKind(kind?: string) {
  if (kind === "reg_fee") return "Lifetime Registration Fee";
  if (kind === "client_fee") return "Client Fee (due after 1 month of teaching)";
  return formatMaterialType(kind);
}

export default async function DashboardPage({ searchParams }: any) {
  const key = searchParams.key;
  const t = key && (await tutorByToken(key));

  if (!t) {
    const invalid = searchParams?.error === "invalid";
    return (
      <main className="page-main page-main-narrow">
        <div
          className="card card-elevated"
          style={{ padding: "2rem 1.5rem", marginTop: "2rem" }}
        >
          <span className="pill pill-teal" style={{ marginBottom: "0.85rem" }}>
            Returning Tutor Login
          </span>
          <h1 style={{ fontSize: "1.65rem", marginBottom: "0.45rem" }}>
            Log in to your existing profile
          </h1>
          <p style={{ margin: "0 0 1.25rem", fontSize: "0.94rem" }}>
            Paste your <strong>Secret Key</strong>, your{" "}
            <strong>Private Dashboard Link</strong>, or your{" "}
            <strong>Claude MCP Connector URL</strong> (you can always find it in{" "}
            <strong>Claude → Settings → Connectors</strong>).
          </p>

          {invalid && (
            <div
              className="notice-banner"
              style={{
                marginBottom: "1rem",
                background: "#fef2f2",
                borderColor: "#fecaca",
                borderLeftColor: "#dc2626",
                color: "#7f1d1d",
              }}
            >
              No tutor account matched that key or URL. Please check the link
              from Claude Connectors or your signup bookmark and try again.
            </div>
          )}

          <form action={loginWithKey}>
            <label htmlFor="key_or_url">
              Dashboard link, Claude MCP URL, or secret key
            </label>
            <input
              id="key_or_url"
              name="key_or_url"
              placeholder="e.g. https://.../api/mcp/a1b2c3... or a1b2c3..."
              required
            />
            <div className="btn-row">
              <button type="submit">Open my dashboard</button>
              <Link href="/#get-started" className="btn btn-alt">
                Create new profile
              </Link>
            </div>
          </form>
        </div>
      </main>
    );
  }

  const host = (process.env.APP_URL || "").replace(/\/$/, "");
  const profilePath = `/t/${t.slug}`;
  const profileUrl = host ? `${host}${profilePath}` : profilePath;
  const dashboardPath = `/dashboard?key=${t.token}`;
  const dashboardUrl = host ? `${host}${dashboardPath}` : dashboardPath;
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
          <div className="btn-row" style={{ marginBottom: "0.55rem" }}>
            <span className="pill pill-teal">Tutor Dashboard</span>
            {t.reg_paid ? (
              <span className="pill pill-active">Lifetime Reg Paid (₹200) ✓</span>
            ) : (
              <span className="pill pill-pending">Reg Fee Pending (₹200)</span>
            )}
          </div>
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
              .join(" · ") ||
              "Connect Claude to populate your subjects, classes, and bio."}
          </p>
        </div>

        <div className="btn-row">
          <Link href={profilePath} className="btn btn-alt">
            View public profile ↗
          </Link>
          <LogoutButton />
        </div>
      </div>

      {/* Lifetime Registration Fee Banner if unpaid */}
      {!t.reg_paid && (
        <section
          className="card card-elevated"
          style={{
            marginBottom: "1.35rem",
            borderColor: "#fcd34d",
            background: "#fffdf5",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <div>
              <h2 style={{ marginBottom: "0.25rem", fontSize: "1.2rem" }}>
                Complete your ₹200 lifetime registration
              </h2>
              <p style={{ margin: 0, fontSize: "0.9rem" }}>
                Pay the one-time ₹200 registration fee using the GPay QR code
                below, then click confirm.
              </p>
            </div>
            <form action={confirmRegPayment}>
              <input type="hidden" name="key" value={key} />
              <button type="submit">I&apos;ve paid ₹200 — Confirm</button>
            </form>
          </div>
          <GPayQr
            amount={200}
            note={`TutorDesk Lifetime Reg - ${t.name}`}
            title="₹200 Lifetime Registration Fee"
          />
        </section>
      )}

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
          <div className="stat-sub">₹{paidTotal} paid</div>
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
          <div
            style={{
              marginTop: "0.75rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.5rem",
              flexWrap: "wrap",
              fontSize: "0.82rem",
              color: "var(--ink-muted)",
            }}
          >
            <span>
              Login key: <code>{t.token}</code>
            </span>
            <CopyButton text={dashboardUrl} label="Copy login link" />
          </div>
        </div>
      </section>

      {/* Enquiries */}
      <section className="dash-section" id="enquiries">
        <div className="section-header">
          <div>
            <h2>Enquiries ({totalEnq})</h2>
            <p>
              Track parent requests, update student statuses, and review Claude&apos;s
              reply drafts.
            </p>
          </div>
        </div>

        {!enq?.length ? (
          <div className="card" style={{ textAlign: "center", padding: "2rem 1.25rem" }}>
            <h3 style={{ marginBottom: "0.35rem" }}>No enquiries yet</h3>
            <p
              style={{
                margin: "0 auto 1rem",
                maxWidth: "440px",
                fontSize: "0.92rem",
              }}
            >
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.55rem",
                      flexWrap: "wrap",
                    }}
                  >
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
                  <select
                    name="status"
                    defaultValue={e.status}
                    aria-label="Enquiry status"
                  >
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
            <p>
              Edit lesson plans, question papers, or study tips and share direct
              links with parents.
            </p>
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
                  <input
                    id={`mat-title-${m.id}`}
                    name="title"
                    defaultValue={m.title}
                  />
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
            <p>
              Lifetime registration fee (₹200) and per-client fees (₹1,000) when
              an enquiry becomes active.
            </p>
          </div>
        </div>

        <div className="notice-banner" style={{ marginBottom: "1rem" }}>
          <strong>Client fee policy:</strong> Tutors pay{" "}
          <strong>₹1,000 for every confirmed client</strong> — due{" "}
          <strong>only after 1 month of teaching</strong> from what the parent
          pays you, <strong>never out of your own pocket</strong> upfront.
        </div>

        {!pays?.length ? (
          <div className="card" style={{ textAlign: "center", padding: "1.75rem 1.25rem" }}>
            <p style={{ margin: 0, fontSize: "0.92rem" }}>
              No payment records yet. Moving an enquiry to <code>active</code>{" "}
              creates a pending ₹1,000 client fee entry here (payable after 1
              month of teaching).
            </p>
          </div>
        ) : (
          pays.map((p: any) => (
            <div key={p.id} className="card" style={{ padding: "0.95rem 1.15rem", marginBottom: "0.65rem" }}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    flexWrap: "wrap",
                  }}
                >
                  <strong style={{ fontSize: "1.02rem" }}>₹{p.amount}</strong>
                  <span style={{ color: "var(--ink-soft)", fontSize: "0.9rem" }}>
                    {formatPaymentKind(p.kind)}
                  </span>
                  <span className={statusPillClass(p.status)}>{p.status}</span>
                </div>

                {p.status === "pending" && (
                  <form action={markPaid}>
                    <input type="hidden" name="key" value={key} />
                    <input type="hidden" name="id" value={p.id} />
                    <button className="alt btn-sm">Mark paid</button>
                  </form>
                )}
              </div>

              {p.status === "pending" && (
                <details className="qr-details" style={{ marginTop: "0.65rem" }}>
                  <summary>Show GPay QR to pay ₹{p.amount} ▾</summary>
                  <GPayQr
                    amount={Number(p.amount) || 1000}
                    note={
                      p.kind === "reg_fee"
                        ? `TutorDesk Lifetime Reg - ${t.name}`
                        : `TutorDesk Client Fee - ${t.name}`
                    }
                    title={formatPaymentKind(p.kind)}
                    compact
                  />
                </details>
              )}
            </div>
          ))
        )}
      </section>
    </main>
  );
}
