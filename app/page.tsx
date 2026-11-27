import { signup } from "./actions";

const steps = [
  ["Create your profile", "Sign up with your name. You get a public page parents can open and a private dashboard."],
  ["Connect Claude", "Paste your private connector URL into Claude. It writes your replies, lesson plans and question papers."],
  ["Reply and track", "Review drafts, send them, move each enquiry through trial to active, and mark payments."],
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <span className="eyebrow">For independent tutors</span>
        <h1>Answer tuition enquiries in minutes</h1>
        <p className="lead">
          Connect your Claude account and let it draft replies, lesson plans and question papers.
          TutorDesk keeps your profile live, collects enquiries and tracks payments.
        </p>
        <a href="#start" className="btn">Create tutor profile</a>
      </section>

      <section className="steps" aria-label="How it works">
        {steps.map(([title, text], i) => (
          <div className="box step" key={title}>
            <div className="num">{i + 1}</div>
            <h3>{title}</h3>
            <p className="muted">{text}</p>
          </div>
        ))}
      </section>

      <section id="start" className="box signup">
        <h2>Get started</h2>
        <p className="muted">Takes a few seconds. You will land on your private dashboard.</p>
        <form action={signup}>
          <label htmlFor="name">Your name</label>
          <input id="name" name="name" placeholder="e.g. Aparna R" required />
          <button>Create tutor profile</button>
        </form>
      </section>
    </main>
  );
}
