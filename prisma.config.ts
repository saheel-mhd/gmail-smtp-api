import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { config as dotenvConfig } from "dotenv";
import { defineConfig, env } from "prisma/config";

for (const file of [".env"]) {
  const fullPath = resolve(process.cwd(), file);
  if (existsSync(fullPath)) {
    dotenvConfig({ path: fullPath });
    break;
  }
}

export default defineConfig({
  schema: "apps/api/prisma/schema.prisma",
  migrations: {
    path: "apps/api/prisma/migrations"
  },
  datasource: {
    url: env("DATABASE_URL")
  }
});
