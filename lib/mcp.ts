import { db, tutorByToken } from "@/lib/db";

const S = (props: any, req: string[] = []) => ({
  type: "object",
  properties: props,
  required: req,
});
const str = { type: "string" };

function extractToken(raw?: string | null): string {
  const s = (raw || "").trim();
  if (!s) return "";
  const keyMatch = s.match(/[?&]key=([^&#\s]+)/i);
  if (keyMatch?.[1]) return decodeURIComponent(keyMatch[1]);
  const mcpMatch = s.match(/\/api\/mcp\/([^/?#\s]+)/i);
  if (mcpMatch?.[1]) return decodeURIComponent(mcpMatch[1]);
  return s;
}

function getTools(includeTutorKey: boolean) {
  const keyProp = includeTutorKey
    ? {
        tutor_key: {
          type: "string",
          description:
            "The tutor's secret login key (or dashboard link) from their TutorDesk dashboard.",
        },
      }
    : {};
  const reqKey = includeTutorKey ? ["tutor_key"] : [];

  return [
    {
      name: "create_or_update_profile",
      description:
        "Create or update the tutor's public profile page. Returns the live URL.",
      inputSchema: S(
        {
          ...keyProp,
          name: str,
          subjects: { type: "array", items: str },
          classes: str,
          mode: { type: "string", enum: ["online", "offline", "both"] },
          location: str,
          rate_per_hour: { type: "number" },
          bio: str,
        },
        reqKey
      ),
    },
    {
      name: "list_enquiries",
      description:
        "List parent enquiries, optionally filtered by status (new, replied, trial, active, closed).",
      inputSchema: S({ ...keyProp, status: str }, reqKey),
    },
    {
      name: "save_reply_draft",
      description:
        "Save a reply to a parent as a draft. The tutor reviews, edits and sends it in the dashboard.",
      inputSchema: S(
        { ...keyProp, enquiry_id: str, body: str },
        [...reqKey, "enquiry_id", "body"]
      ),
    },
    {
      name: "save_material",
      description:
        "Save a lesson plan, question paper or study tips (markdown). Returns a shareable link for the parent.",
      inputSchema: S(
        {
          ...keyProp,
          type: {
            type: "string",
            enum: ["lesson_plan", "question_paper", "study_tips"],
          },
          title: str,
          content: str,
          enquiry_id: str,
        },
        [...reqKey, "type", "title", "content"]
      ),
    },
    {
      name: "update_enquiry_status",
      description:
        "Set enquiry status. Setting 'active' creates a pending client fee.",
      inputSchema: S(
        {
          ...keyProp,
          enquiry_id: str,
          status: {
            type: "string",
            enum: ["new", "replied", "trial", "active", "closed"],
          },
        },
        [...reqKey, "enquiry_id", "status"]
      ),
    },
  ];
}

async function callTool(t: any, name: string, a: any, baseUrl: string) {
  if (name === "create_or_update_profile") {
    const row: any = { ...a };
    delete row.tutor_key;
    if (typeof row.subjects === "string") row.subjects = [row.subjects];
    const { data } = t.name
      ? await db.from("tutors").update(row).eq("id", t.id).select().single()
      : { data: t };
    return `Profile live at ${baseUrl}/t/${data.slug}`;
  }
  if (name === "list_enquiries") {
    let q = db
      .from("enquiries")
      .select(
        "id,parent_name,parent_email,student_class,message,status,created_at"
      )
      .eq("tutor_id", t.id)
      .order("created_at", { ascending: false });
    if (a.status) q = q.eq("status", a.status);
    return JSON.stringify((await q).data);
  }
  if (name === "save_reply_draft") {
    const { data: e } = await db
      .from("enquiries")
      .select("id")
      .eq("id", a.enquiry_id)
      .eq("tutor_id", t.id)
      .maybeSingle();
    if (!e) return "Enquiry not found.";
    await db.from("replies").insert({ enquiry_id: e.id, body: a.body });
    return `Draft saved. Review and send at ${baseUrl}/dashboard?key=${t.token}`;
  }
  if (name === "save_material") {
    const { data } = await db
      .from("materials")
      .insert({
        tutor_id: t.id,
        enquiry_id: a.enquiry_id || null,
        type: a.type,
        title: a.title,
        content: a.content,
      })
      .select()
      .single();
    return `Saved. Parent share link: ${baseUrl}/m/${data.id}`;
  }
  if (name === "update_enquiry_status") {
    await db
      .from("enquiries")
      .update({ status: a.status })
      .eq("id", a.enquiry_id)
      .eq("tutor_id", t.id);
    if (a.status === "active") {
      await db.from("payments").insert({
        tutor_id: t.id,
        enquiry_id: a.enquiry_id,
        kind: "client_fee",
        amount: 1000,
      });
    }
    return "Status updated.";
  }
  return "Unknown tool.";
}

export async function handleMcpPost(req: Request, pathToken?: string) {
  const m = await req.json();
  const ok = (result: any) => Response.json({ jsonrpc: "2.0", id: m.id, result });
  const baseUrl = (process.env.APP_URL || new URL(req.url).origin).replace(
    /\/$/,
    ""
  );

  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7).trim()
    : "";
  const urlToken = pathToken || bearerToken;

  // If a path token was explicitly provided (legacy /api/mcp/[token]), verify it upfront.
  let boundTutor: any = null;
  if (urlToken) {
    boundTutor = await tutorByToken(urlToken);
    if (!boundTutor) {
      return Response.json(
        {
          jsonrpc: "2.0",
          id: m.id,
          error: { code: -32001, message: "Invalid tutor token" },
        },
        { status: 401 }
      );
    }
  }

  if (m.method === "initialize") {
    return ok({
      protocolVersion: m.params?.protocolVersion || "2025-03-26",
      capabilities: { tools: {} },
      serverInfo: { name: "tutordesk", version: "0.2.0" },
    });
  }

  if (m.method === "tools/list") {
    return ok({ tools: getTools(!boundTutor) });
  }

  if (m.method === "tools/call") {
    try {
      const args = m.params?.arguments || {};
      let tutor = boundTutor;
      if (!tutor) {
        const key = extractToken(args.tutor_key);
        if (!key) {
          return ok({
            isError: true,
            content: [
              {
                type: "text",
                text: "Please provide your TutorDesk Login Key (from your dashboard) as tutor_key.",
              },
            ],
          });
        }
        tutor = await tutorByToken(key);
        if (!tutor) {
          return ok({
            isError: true,
            content: [
              {
                type: "text",
                text: "Invalid tutor_key. Please check your Login Key in your TutorDesk dashboard.",
              },
            ],
          });
        }
      }

      const text = await callTool(tutor, m.params.name, args, baseUrl);
      return ok({ content: [{ type: "text", text }] });
    } catch (e: any) {
      return ok({
        isError: true,
        content: [{ type: "text", text: String(e.message) }],
      });
    }
  }

  if (m.method === "ping") return ok({});
  return new Response(null, { status: 202 });
}

export function handleMcpGet() {
  return new Response("TutorDesk MCP endpoint. Use POST.", { status: 405 });
}
