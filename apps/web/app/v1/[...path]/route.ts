import type { NextRequest } from "next/server";
import { proxyRequest } from "../../../lib/api-proxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getPathParams(request: NextRequest, prefix: string) {
  const trimmed = request.nextUrl.pathname.replace(new RegExp(`^${prefix}/?`), "");
  const path = trimmed ? trimmed.split("/") : [];
  return { path };
}

async function handler(request: NextRequest) {
  return proxyRequest(request, "/v1", getPathParams(request, "/v1"));
}

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE, handler as OPTIONS, handler as HEAD };
