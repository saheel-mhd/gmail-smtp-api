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
  DEFAULT_PER_MINUTE_LIMIT: z.coerce.number().default(60),
  DEFAULT_PER_DAY_LIMIT: z.coerce.number().default(2000),
  DEFAULT_API_KEY_RATE_LIMIT: z.coerce.number().default(120),
  APP_BASE_URL: z.string().default("http://localhost:3000"),
  SKIP_SMTP_VERIFY: z.coerce.boolean().default(false)
});

export const env = envSchema.parse(process.env);
