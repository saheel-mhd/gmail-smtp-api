import crypto from "node:crypto";
import { env } from "../env";

const key = Buffer.from(env.ENCRYPTION_MASTER_KEY, "hex");

export type CipherBlob = {
  encrypted: string;
  iv: string;
  authTag: string;
  keyVersion: string;
};

export function encryptSecret(raw: string): CipherBlob {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(raw, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    encrypted: encrypted.toString("base64"),
    iv: iv.toString("base64"),
    authTag: tag.toString("base64"),
    keyVersion: env.ENCRYPTION_KEY_VERSION
  };
}

export function decryptSecret(blob: CipherBlob): string {
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(blob.iv, "base64")
  );
  decipher.setAuthTag(Buffer.from(blob.authTag, "base64"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(blob.encrypted, "base64")),
    decipher.final()
  ]);
  return decrypted.toString("utf8");
}

export function randomToken(length = 48): string {
  return crypto.randomBytes(length).toString("base64url");
}
