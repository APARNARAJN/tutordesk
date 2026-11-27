import { signup } from "./actions";

export default function Home() {
  return (
    <main className="page-main">
      {/* Hero */}
      <section className="hero-grid" id="get-started">
        <div>
          <span className="pill pill-teal">
            Built for independent tutors · Claude MCP ready
          </span>
          <h1 className="hero-title">
            Tuition enquiries answered in{" "}
            <span className="hero-title-serif">minutes</span>, not evenings.
          </h1>
          <p className="hero-lead">
            Connect your Claude account, and let it draft parent replies, lesson
            plans, and question papers. TutorDesk keeps your public profile live,
            collects parent enquiries, and tracks your fees in one clean workspace.
          </p>

          <form action={signup} className="signup-card">
            <label htmlFor="tutor-name">Start with your name</label>
            <div className="signup-row">
              <input
                id="tutor-name"
                name="name"
                placeholder="e.g. Ananya Menon"
                required
              />
              <button type="submit">Create tutor profile</button>
            </div>
            <p
              style={{
                fontSize: "0.82rem",
                margin: "0.65rem 0 0",
                color: "var(--ink-muted)",
              }}
            >
              Instant setup — no password required. You&apos;ll get a private
              dashboard link and a Claude MCP connector URL right away.
            </p>
          </form>
        </div>

        {/* Visual Preview Card */}
        <aside className="hero-preview" aria-label="TutorDesk workflow preview">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
            }}
          >
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--ink)" }}>
              Live Workspace Preview
            </span>
            <span className="pill pill-active">Connected to Claude</span>
          </div>

          <div className="preview-item">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <strong style={{ fontSize: "0.92rem" }}>New Parent Enquiry</strong>
              <span className="pill pill-new">new</span>
            </div>
            <p style={{ fontSize: "0.84rem", margin: "0.35rem 0 0" }}>
              &ldquo;Looking for Class 9 CBSE Maths help, 3 evenings a week online.&rdquo;
            </p>
          </div>

          <div className="preview-item">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <strong style={{ fontSize: "0.92rem" }}>Claude Drafted Reply</strong>
              <span className="pill pill-draft">ready to review</span>
            </div>
            <p style={{ fontSize: "0.84rem", margin: "0.35rem 0 0" }}>
              Warm introduction, trial class slots for Thu/Fri at 6 PM, and fee details.
            </p>
          </div>

          <div className="preview-item">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <strong style={{ fontSize: "0.92rem" }}>Trial Lesson Plan</strong>
              <span className="pill pill-teal">shareable link</span>
            </div>
            <p style={{ fontSize: "0.84rem", margin: "0.35rem 0 0" }}>
              Linear Equations diagnostic + 10 practice problems ready at{" "}
              <code>/m/trial-plan</code>
            </p>
          </div>
        </aside>
      </section>

      {/* How It Works */}
      <section className="section-block" id="how-it-works">
        <div className="section-header">
          <div>
            <h2>How TutorDesk works</h2>
            <p>Go from sign-up to your first AI-assisted parent reply in under two minutes.</p>
          </div>
        </div>
        <div className="grid-3">
          <div className="card">
            <span className="step-num">1</span>
            <h3>Create your tutor profile</h3>
            <p style={{ margin: 0, fontSize: "0.92rem" }}>
              Enter your name above to get your live public profile link and your
              private dashboard — bookmark it anytime.
            </p>
          </div>
          <div className="card">
            <span className="step-num">2</span>
            <h3>Connect to Claude</h3>
            <p style={{ margin: 0, fontSize: "0.92rem" }}>
              Copy your unique MCP connector URL from the dashboard into Claude
              Settings → Connectors. No API keys needed.
            </p>
          </div>
          <div className="card">
            <span className="step-num">3</span>
            <h3>Review, send &amp; teach</h3>
            <p style={{ margin: 0, fontSize: "0.92rem" }}>
              Ask Claude to update your bio, draft replies to new enquiries, or
              generate shareable study sheets — you approve everything.
            </p>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="section-block">
        <div className="section-header">
          <div>
            <h2>Everything an independent tutor needs</h2>
            <p>Simple tools that stay out of your way while keeping parents impressed.</p>
          </div>
        </div>
        <div className="grid-2">
          <div className="card">
            <h3>Public Profile &amp; Enquiry Intake</h3>
            <p style={{ margin: 0, fontSize: "0.92rem" }}>
              Share one clean link with your subjects, classes taught, online/offline
              mode, location, hourly rate, and an enquiry form that feeds straight into
              your desk.
            </p>
          </div>
          <div className="card">
            <h3>Draft-First Reply Workflow</h3>
            <p style={{ margin: 0, fontSize: "0.92rem" }}>
              Claude saves tailored replies as drafts. You review, tweak the wording if
              needed, and click send from your dashboard.
            </p>
          </div>
          <div className="card">
            <h3>Lesson Plans &amp; Question Papers</h3>
            <p style={{ margin: 0, fontSize: "0.92rem" }}>
              Edit generated study materials in your dashboard and send parents a clean,
              printable reading link with zero clutter.
            </p>
          </div>
          <div className="card">
            <h3>Simple Student Status &amp; Payments</h3>
            <p style={{ margin: 0, fontSize: "0.92rem" }}>
              Move enquiries from <code>new</code> → <code>trial</code> →{" "}
              <code>active</code> and mark pending fees as paid with a single click.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
