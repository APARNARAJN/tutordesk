import { signup } from "./actions";
export default function Home() {
  return (<main><h1>TutorDesk</h1>
    <p>Get your tuition enquiries answered in minutes. Connect your Claude account, and it writes your replies, lesson plans and question papers. TutorDesk keeps your profile live, collects enquiries and tracks payments.</p>
    <form action={signup} className="box"><label>Your name</label><input name="name" required /><button>Create tutor profile</button></form></main>);
}
