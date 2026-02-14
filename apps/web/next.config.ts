import type { NextConfig } from "next";

function normalizeProxyTarget(raw: string): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("/") || trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

const rawProxyTarget = normalizeProxyTarget(
  process.env.API_PROXY_TARGET ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.API_BASE_URL ||
    ""
);
const apiProxyTarget = rawProxyTarget.replace(/\/$/, "");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    if (!apiProxyTarget) return [];
    return [
      { source: "/admin/:path*", destination: `${apiProxyTarget}/admin/:path*` },
      { source: "/v1/:path*", destination: `${apiProxyTarget}/v1/:path*` }
    ];
  }
};

export default nextConfig;
