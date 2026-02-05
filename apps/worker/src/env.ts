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
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  ENCRYPTION_MASTER_KEY: z.string().length(64),
  ENCRYPTION_KEY_VERSION: z.string().default("v1"),
  WORKER_CONCURRENCY: z.coerce.number().default(10)
});

export const env = envSchema.parse(process.env);
