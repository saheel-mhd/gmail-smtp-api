import crypto from "node:crypto";
import { env } from "../env";

const key = Buffer.from(env.ENCRYPTION_MASTER_KEY, "hex");

export function decryptSecret(args: {
  encrypted: string;
  iv: string;
  authTag: string;
}): string {
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(args.iv, "base64")
  );
  decipher.setAuthTag(Buffer.from(args.authTag, "base64"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(args.encrypted, "base64")),
    decipher.final()
  ]);
  return decrypted.toString("utf8");
}
