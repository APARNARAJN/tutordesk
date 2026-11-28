import { signup } from "./actions";
import { GPayQr } from "./components/GPayQr";

export const dynamic = "force-dynamic";

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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.5rem",
                flexWrap: "wrap",
                marginBottom: "0.85rem",
              }}
            >
              <strong style={{ fontSize: "1rem", color: "var(--ink)" }}>
                Create your tutor profile
              </strong>
              <span className="pill pill-trial">₹200 Lifetime Registration</span>
            </div>

            <label htmlFor="tutor-name">Your name</label>
            <input
              id="tutor-name"
              name="name"
              placeholder="e.g. Ananya Menon"
              required
              style={{ marginBottom: "0.5rem" }}
            />

            <GPayQr
              amount={200}
              note="TutorDesk Lifetime Registration"
              title="One-time lifetime registration fee (₹200)"
              compact
            />

            <label className="checkbox-row">
              <input type="checkbox" name="reg_paid_confirm" required />
              <span>
                I have paid the <strong>₹200 lifetime registration fee</strong>{" "}
                via GPay / UPI to activate my profile.
              </span>
            </label>

            <button type="submit" style={{ width: "100%" }}>
              Create tutor profile
            </button>

            <div className="notice-banner" style={{ marginTop: "0.9rem" }}>
              <strong>Zero-risk client fee:</strong> You only pay{" "}
              <strong>₹1,000 for every confirmed client</strong> — payable{" "}
              <strong>after 1 month of teaching</strong> from what the parent pays
              you, <strong>never out of your own pocket</strong> upfront.
            </div>
          </form>
        </div>

        {/* Visual Preview & Pricing Card */}
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

          <div
            className="preview-item"
            style={{
              background: "#fffbeb",
              borderColor: "#fde68a",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <strong style={{ fontSize: "0.92rem", color: "#451a03" }}>
                Pay Only When You Earn
              </strong>
              <span className="pill pill-trial">₹1,000 / client</span>
            </div>
            <p style={{ fontSize: "0.83rem", margin: "0.35rem 0 0", color: "#78350f" }}>
              ₹200 once to register for life. Then ₹1,000 per student only after
              1 full month of teaching — never out of your pocket.
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
            <h3>Pay ₹200 once &amp; register</h3>
            <p style={{ margin: 0, fontSize: "0.92rem" }}>
              Scan the GPay QR code, enter your name, and get your live public
              profile plus your private dashboard immediately.
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
            <h3>Teach first, pay ₹1,000 later</h3>
            <p style={{ margin: 0, fontSize: "0.92rem" }}>
              When a parent converts, you only pay ₹1,000 per client after 1
              month of teaching — straight from your tuition earnings.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing & Capabilities */}
      <section className="section-block">
        <div className="section-header">
          <div>
            <h2>Simple pricing &amp; everything a tutor needs</h2>
            <p>No monthly subscription traps. You pay for confirmed students after you earn.</p>
          </div>
        </div>
        <div className="grid-2">
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <h3 style={{ margin: 0 }}>₹200 Lifetime Registration</h3>
              <span className="pill pill-active">One-time</span>
            </div>
            <p style={{ margin: 0, fontSize: "0.92rem" }}>
              A single ₹200 GPay payment unlocks your permanent public profile
              link, Claude MCP connector, enquiry inbox, and study material
              hosting for life.
            </p>
          </div>
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <h3 style={{ margin: 0 }}>₹1,000 Per Client (After 1 Month)</h3>
              <span className="pill pill-trial">Success-based</span>
            </div>
            <p style={{ margin: 0, fontSize: "0.92rem" }}>
              For every student you start teaching through TutorDesk, you pay
              ₹1,000 only after completing 1 month of classes — out of what the
              parent pays you, never out of your own pocket.
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
        </div>
      </section>
    </main>
  );
}
