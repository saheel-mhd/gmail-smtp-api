import { promises as dns } from "node:dns";

const normalizeTxt = (rows: string[][]) =>
  rows.map((parts) => parts.join("")).map((value) => value.trim());

export async function resolveTxt(host: string) {
  try {
    return normalizeTxt(await dns.resolveTxt(host));
  } catch {
    return [];
  }
}

export async function resolveCname(host: string) {
  try {
    return (await dns.resolveCname(host)).map((value) => value.toLowerCase());
  } catch {
    return [];
  }
}

export async function resolveMx(host: string) {
  try {
    return (await dns.resolveMx(host)).map((row) => ({
      exchange: row.exchange.toLowerCase(),
      priority: row.priority
    }));
  } catch {
    return [];
  }
}
