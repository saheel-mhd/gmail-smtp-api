const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  "http://localhost:4000";

type CacheEntry = {
  expiresAt: number;
  data: unknown;
};

const cache = new Map<string, CacheEntry>();
const DEFAULT_TTL_MS = 30_000;

function getCacheKey(method: string, url: string) {
  return `${method.toUpperCase()} ${url}`;
}

export function invalidateBrowserCache(prefix: string) {
  for (const key of cache.keys()) {
    if (key.includes(prefix)) {
      cache.delete(key);
    }
  }
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const pairs = document.cookie.split(";").map((part) => part.trim());
  for (const part of pairs) {
    if (part.startsWith(`${name}=`)) {
      return decodeURIComponent(part.slice(name.length + 1));
    }
  }
  return null;
}

export async function browserApi<T>(
  path: string,
  init?: RequestInit & { csrf?: boolean; cacheTtlMs?: number }
): Promise<T> {
  const headers = new Headers(init?.headers ?? {});
  if (init?.csrf) {
    const csrf = readCookie("gmail_smtp_csrf");
    if (csrf) headers.set("x-csrf-token", csrf);
  }
  const method = (init?.method ?? "GET").toUpperCase();
  const url = `${API_BASE_URL}${path}`;
  const cacheKey = getCacheKey(method, url);
  const ttl = init?.cacheTtlMs ?? DEFAULT_TTL_MS;

  if (method === "GET" && init?.cache !== "no-store") {
    const hit = cache.get(cacheKey);
    if (hit && hit.expiresAt > Date.now()) {
      return hit.data as T;
    }
  }

  const response = await fetch(url, {
    ...init,
    headers,
    credentials: "include"
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `HTTP ${response.status}`);
  }
  const data = (await response.json()) as T;
  if (method === "GET" && init?.cache !== "no-store") {
    cache.set(cacheKey, { data, expiresAt: Date.now() + ttl });
  }
  return data;
}
