import { createClient } from "@supabase/supabase-js";
export const db = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
export const tutorByToken = async (t: string) => (await db.from("tutors").select("*").eq("token", t).maybeSingle()).data;
export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Math.random().toString(36).slice(2, 6);
