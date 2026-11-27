# TutorDesk
Claude writes. TutorDesk keeps it live. No AI keys in this repo.

## Deploy (about 15 min)
1. Create a Supabase project, run `schema.sql` in the SQL editor.
2. Push this folder to GitHub, import it in Vercel.
3. Set env vars from `.env.example` (SUPABASE_URL, SUPABASE_SERVICE_KEY = service_role key, APP_URL = your Vercel URL).
4. Open your site, sign up as a tutor. The dashboard shows your private connector URL.

## Connect to Claude
Claude settings > Connectors > Add custom connector > paste `APP_URL/api/mcp/<your-token>`.

## Try it
"Create my profile: maths, classes 8-10, online and Nilambur, Rs 400/hour." Then submit an enquiry on /t/<slug>, then: "List my enquiries, draft a reply and a trial algebra lesson plan."

## Known limits (v1)
Token-in-URL auth (no passwords), manual payment marking, no tutor verification, emails only if Resend is set.
