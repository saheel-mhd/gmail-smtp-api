const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:4000";

export async function getAdminData<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      cache: "no-store",
      credentials: "include"
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
