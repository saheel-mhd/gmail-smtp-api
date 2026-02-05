const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  "http://localhost:4000";

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
  init?: RequestInit & { csrf?: boolean }
): Promise<T> {
  const headers = new Headers(init?.headers ?? {});
  if (init?.csrf) {
    const csrf = readCookie("gmail_smtp_csrf");
    if (csrf) headers.set("x-csrf-token", csrf);
  }
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: "include"
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `HTTP ${response.status}`);
  }
  return (await response.json()) as T;
}
