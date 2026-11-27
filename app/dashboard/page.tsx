import { db, tutorByToken } from "@/lib/db";
import { saveReply, setStatus, markPaid, saveMaterial } from "@/app/actions";
export const dynamic = "force-dynamic";
export default async function D({ searchParams }: any) {
  const key = searchParams.key, t = key && await tutorByToken(key);
  if (!t) return <p>Open the dashboard link you got when you signed up.</p>;
  const host = process.env.APP_URL;
  const { data: enq } = await db.from("enquiries").select("*, replies(*)").eq("tutor_id", t.id).order("created_at", { ascending: false });
  const { data: mats } = await db.from("materials").select("*").eq("tutor_id", t.id).order("created_at", { ascending: false });
  const { data: pays } = await db.from("payments").select("*").eq("tutor_id", t.id);
  return (<main><h1>{t.name}'s dashboard</h1>
    <div className="box"><b>Public profile:</b> <a href={`/t/${t.slug}`}>{host}/t/{t.slug}</a><br />
      <b>Connect to Claude:</b> add a custom connector with this URL<br /><code>{host}/api/mcp/{t.token}</code></div>
    <h2>Enquiries</h2>{!enq?.length && <p>No enquiries yet. Share your profile link.</p>}
    {enq?.map((e: any) => (<div className="box" key={e.id}>
      <b>{e.parent_name}</b> · class {e.student_class} · {e.parent_email} {e.parent_phone}<br />{e.message}<br /><i>Status: {e.status}</i>
      <form action={setStatus}><input type="hidden" name="key" value={key} /><input type="hidden" name="id" value={e.id} />
        <select name="status" defaultValue={e.status}>{["new", "replied", "trial", "active", "closed"].map(s => <option key={s}>{s}</option>)}</select><button className="alt">Update status</button></form>
      {e.replies?.map((r: any) => (<form action={saveReply} key={r.id}><input type="hidden" name="key" value={key} /><input type="hidden" name="id" value={r.id} />
        <label>Reply ({r.status})</label><textarea name="body" rows={6} defaultValue={r.body} />
        <button name="act" value="send">Send reply</button><button name="act" value="save" className="alt">Save draft</button></form>))}
    </div>))}
    <h2>Materials</h2>{mats?.map((m: any) => (<form action={saveMaterial} className="box" key={m.id}>
      <input type="hidden" name="key" value={key} /><input type="hidden" name="id" value={m.id} />
      <input name="title" defaultValue={m.title} /><textarea name="content" rows={8} defaultValue={m.content} />
      <button>Save</button><a href={`/m/${m.id}`}>Parent share link</a></form>))}
    <h2>Payments</h2>{pays?.map((p: any) => (<form action={markPaid} key={p.id}><input type="hidden" name="key" value={key} /><input type="hidden" name="id" value={p.id} />
      {p.kind}: ₹{p.amount} ({p.status}) {p.status === "pending" && <button className="alt">Mark paid</button>}</form>))}
  </main>);
}
