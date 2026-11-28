import { handleMcpGet, handleMcpPost } from "@/lib/mcp";

export async function POST(
  req: Request,
  { params }: { params: { token: string } }
) {
  return handleMcpPost(req, params.token);
}

export async function GET() {
  return handleMcpGet();
}
