import bcrypt from "bcryptjs";
import { randomToken } from "./crypto";

export async function hashApiKey(apiKey: string): Promise<string> {
  return bcrypt.hash(apiKey, 12);
}

export async function verifyApiKey(apiKey: string, hash: string): Promise<boolean> {
  return bcrypt.compare(apiKey, hash);
}

export function generateApiKey(): { token: string; prefix: string } {
  const token = `gsk_${randomToken(32)}`;
  const prefix = token.slice(0, 6);
  return { token, prefix };
}
