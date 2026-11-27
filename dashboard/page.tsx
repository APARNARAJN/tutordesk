import Link from "next/link";
import { db, tutorByToken } from "@/lib/db";
import { saveReply, setStatus, markPaid, saveMaterial } from "@/app/actions";
import SaveKey from "@/app/components/SaveKey";
export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

export default async function D({ searchParams }: any) {
  const key = searchParams.key, t = key && await tutorByToken(key);
  if (!t) return (
    <main className="box notice">
      <h2>Open your dashboard link</h2>
      <p className="muted">Use the link you got when you signed up. It looks like <code>/dashboard?key=…</code></p>
      <Link href="/" className="btn">Back to home</Link>
    </main>
  );
  const host = process.env.APP_URL;
  const { data: enq } = await db.from("enquiries").select("*, replies(*)").eq("tutor_id", t.id).order("created_at", { ascending: false });
  const { data: mats } = await db.from("materials").select("*").eq("tutor_id", t.id).order("created_at", { ascending: false });
  const { data: pays } = await db.from("payments").select("*").eq("tutor_id", t.id);
  const count = (s: string) => enq?.filter((e: any) => e.status === s).length ?? 0;
  const pending = pays?.filter((p: any) => p.status === "pending").length ?? 0;

  return (
    <main>
      <SaveKey k={key} />
      <h1 style={{ fontSize: "2rem" }}>{t.name}&apos;s dashboard</h1>
      <div className="subnav">
        <a href="#enquiries">Enquiries</a><a href="#materials">Materials</a><a href="#payments">Payments</a>
        <Link href={`/t/${t.slug}`}>View public profile ↗</Link>
      </div>

      <div className="stats">
        <div className="stat"><b>{enq?.length ?? 0}</b><span>Total enquiries</span></div>
        <div className="stat"><b>{count("new")}</b><span>New</span></div>
        <div className="stat"><b>{count("active")}</b><span>Active students</span></div>
        <div className="stat"><b>{pending}</b><span>Payments pending</span></div>
      </div>

      <div className="box">
        <h3>Your links</h3>
        <b>Public profile</b> <Link href={`/t/${t.slug}`}>{host}/t/{t.slug}</Link>
        <p style={{ marginTop: ".8rem", marginBottom: 0 }}><b>Connect to Claude</b> <span className="muted">add a custom connector with this private URL. Don&apos;t share it.</span></p>
        <code>{host}/api/mcp/{t.token}</code>
      </div>

      <h2 id="enquiries" style={{ marginTop: "1.8rem" }}>Enquiries</h2>
      {!enq?.length && <div className="box empty">No enquiries yet. Share your profile link.</div>}
      {enq?.map((e: any) => (
        <div className="box" key={e.id}>
          <div className="row">
            <div><b>{e.parent_name}</b> <span className="muted">· class {e.student_class || "n/a"}</span><br />
              <span className="muted">{e.parent_email} {e.parent_phone}</span></div>
            <span className={`badge ${e.status}`}>{e.status}</span>
          </div>
          <p>{e.message}</p>
          <form action={setStatus} className="inline-form">
            <input type="hidden" name="key" value={key} /><input type="hidden" name="id" value={e.id} />
            <select name="status" defaultValue={e.status} aria-label="Status">{["new", "replied", "trial", "active", "closed"].map(s => <option key={s}>{s}</option>)}</select>
            <button className="alt">Update status</button>
          </form>
          {e.replies?.map((r: any) => (
            <form action={saveReply} key={r.id} style={{ marginTop: "1rem" }}>
              <input type="hidden" name="key" value={key} /><input type="hidden" name="id" value={r.id} />
              <label>Reply <span className={`badge ${r.status}`}>{r.status}</span></label>
              <textarea name="body" rows={6} defaultValue={r.body} />
              <button name="act" value="send">Send reply</button><button name="act" value="save" className="alt">Save draft</button>
            </form>
          ))}
        </div>
      ))}

      <h2 id="materials" style={{ marginTop: "1.8rem" }}>Materials</h2>
      {!mats?.length && <div className="box empty">No materials yet. Ask Claude for a lesson plan or question paper.</div>}
      {mats?.map((m: any) => (
        <form action={saveMaterial} className="box" key={m.id}>
          <input type="hidden" name="key" value={key} /><input type="hidden" name="id" value={m.id} />
          <input name="title" defaultValue={m.title} aria-label="Title" /><textarea name="content" rows={8} defaultValue={m.content} aria-label="Content" />
          <button>Save</button><Link href={`/m/${m.id}`} className="btn alt">Parent share link</Link>
        </form>
      ))}

      <h2 id="payments" style={{ marginTop: "1.8rem" }}>Payments</h2>
      <div className="box">
        {!pays?.length && <div className="empty">No payments yet. One is created when an enquiry becomes active.</div>}
        {pays?.map((p: any) => (
          <form action={markPaid} key={p.id} className="pay">
            <input type="hidden" name="key" value={key} /><input type="hidden" name="id" value={p.id} />
            <span>{p.kind.replace("_", " ")}: <b>₹{p.amount}</b> <span className={`badge ${p.status}`}>{p.status}</span></span>
            {p.status === "pending" && <button className="alt" style={{ margin: 0 }}>Mark paid</button>}
          </form>
        ))}
      </div>
    </main>
  );
}
