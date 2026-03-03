import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

for (const file of [".env", "../../.env"]) {
  const resolved = path.resolve(process.cwd(), file);
  if (fs.existsSync(resolved)) {
    dotenv.config({ path: resolved });
    break;
  }
}

const boolFromEnv = z.preprocess((value) => {
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes", "y"].includes(normalized)) return true;
    if (["false", "0", "no", "n", ""].includes(normalized)) return false;
  }
  return value;
}, z.boolean());

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  ENCRYPTION_MASTER_KEY: z.string().length(64),
  ENCRYPTION_KEY_VERSION: z.string().default("v1"),
  GMAIL_SMTP_HOST: z.string().default("smtp.gmail.com"),
  GMAIL_SMTP_PORT: z.coerce.number().default(587),
  GMAIL_SMTP_SECURE: boolFromEnv.default(false),
  GMAIL_SMTP_REQUIRE_TLS: boolFromEnv.default(true),
  APP_BASE_URL: z.string().default("http://localhost:3000"),
  APP_TRACKING_BASE_URL: z.string().optional(),
  WORKER_CONCURRENCY: z.coerce.number().default(10)
});

export const env = envSchema.parse(process.env);
