import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  "http://localhost:4000";

type CacheEntry = {
  expiresAt: number;
  data: unknown;
};

const cache = new Map<string, CacheEntry>();

function getCacheKey(method: string, url: string, cookieHeader: string) {
  return `${method.toUpperCase()} ${url} ${cookieHeader}`;
}

export async function serverApi<T>(
  path: string,
  init?: RequestInit & { cacheTtlMs?: number }
): Promise<T> {
  const method = (init?.method ?? "GET").toUpperCase();
  const url = `${API_BASE_URL}${path}`;

  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const headers = new Headers(init?.headers ?? {});
  if (cookieHeader) headers.set("cookie", cookieHeader);

  const ttl = init?.cacheTtlMs ?? 0;
  if (method === "GET" && ttl > 0) {
    const cacheKey = getCacheKey(method, url, cookieHeader);
    const hit = cache.get(cacheKey);
    if (hit && hit.expiresAt > Date.now()) {
      return hit.data as T;
    }
  }

  const response = await fetch(url, {
    ...init,
    headers,
    cache: "no-store"
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `HTTP ${response.status}`);
  }

  const data = (await response.json()) as T;

  if (method === "GET" && ttl > 0) {
    const cacheKey = getCacheKey(method, url, cookieHeader);
    cache.set(cacheKey, { data, expiresAt: Date.now() + ttl });
  }

  return data;
}
