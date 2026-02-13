import { Buffer } from "node:buffer";
import type { NextRequest } from "next/server";

const rawTarget =
  process.env.API_PROXY_TARGET ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  "";
const proxyTarget = rawTarget.replace(/\/$/, "");

type ProxyParams = {
  path?: string[];
};

export async function proxyRequest(
  request: NextRequest,
  prefix: string,
  params: ProxyParams
): Promise<Response> {
  if (!proxyTarget) {
    return new Response("API proxy target not configured", { status: 500 });
  }

  const suffix = params.path?.join("/") ?? "";
  const search = request.nextUrl.search ?? "";
  const url = `${proxyTarget}${prefix}${suffix ? `/${suffix}` : ""}${search}`;
  const method = request.method.toUpperCase();

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("connection");
  headers.delete("content-length");

  const body =
    method === "GET" || method === "HEAD" ? undefined : Buffer.from(await request.arrayBuffer());

  const upstream = await fetch(url, {
    method,
    headers,
    body,
    redirect: "manual"
  });

  const responseHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") return;
    responseHeaders.set(key, value);
  });

  const response = new Response(upstream.body, {
    status: upstream.status,
    headers: responseHeaders
  });

  const upstreamHeaders = upstream.headers as Headers & {
    getSetCookie?: () => string[];
  };
  const setCookies = upstreamHeaders.getSetCookie?.();
  if (Array.isArray(setCookies) && setCookies.length > 0) {
    setCookies.forEach((cookie) => response.headers.append("set-cookie", cookie));
  } else {
    const singleCookie = upstream.headers.get("set-cookie");
    if (singleCookie) response.headers.append("set-cookie", singleCookie);
  }

  return response;
}
