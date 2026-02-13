import type { NextRequest } from "next/server";
import { proxyRequest } from "../../../lib/api-proxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function handler(request: NextRequest, context: { params: { path?: string[] } }) {
  return proxyRequest(request, "/admin", context.params);
}

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE, handler as OPTIONS, handler as HEAD };
