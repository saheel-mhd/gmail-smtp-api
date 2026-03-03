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
  API_PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  SESSION_COOKIE_NAME: z.string().default("gmail_smtp_session"),
  CSRF_COOKIE_NAME: z.string().default("gmail_smtp_csrf"),
  ENCRYPTION_MASTER_KEY: z.string().length(64),
  ENCRYPTION_KEY_VERSION: z.string().default("v1"),
  GMAIL_SMTP_HOST: z.string().default("smtp.gmail.com"),
  GMAIL_SMTP_PORT: z.coerce.number().default(587),
  GMAIL_SMTP_SECURE: boolFromEnv.default(false),
  GMAIL_SMTP_REQUIRE_TLS: boolFromEnv.default(true),
  DEFAULT_PER_DAY_LIMIT: z.coerce.number().default(2000),
  DEFAULT_API_KEY_RATE_LIMIT: z.coerce.number().default(120),
  APP_BASE_URL: z.string().default("http://localhost:3000"),
  APP_DOMAIN: z.string().default("mailer.example.com"),
  APP_COOKIE_DOMAIN: z.string().optional().default(""),
  REPLY_TRACKING_SECRET: z.string().optional(),
  SKIP_SMTP_VERIFY: boolFromEnv.default(false)
});

export const env = envSchema.parse(process.env);
