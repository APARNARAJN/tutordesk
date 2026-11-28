import { handleMcpGet, handleMcpPost } from "@/lib/mcp";

export async function POST(req: Request) {
  return handleMcpPost(req);
}

export async function GET() {
  return handleMcpGet();
}
