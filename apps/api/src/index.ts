import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import jwt from "@fastify/jwt";
import sensible from "@fastify/sensible";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { env } from "./env";
import { healthRoutes } from "./routes/health";
import { publicRoutes } from "./routes/public";
import { adminRoutes } from "./routes/admin";
import { prisma } from "./lib/prisma";
import { redis } from "./lib/redis";
import { closeSendQueue } from "./queue";

export function buildApp() {
  const app = Fastify({
    logger: true,
    bodyLimit: 256 * 1024
  });

  app.register(sensible);
  app.register(cookie);
  app.register(jwt, { secret: env.JWT_SECRET });
  app.register(cors, {
    origin: [env.APP_BASE_URL],
    credentials: true
  });

  app.register(healthRoutes);
  app.register(publicRoutes);
  app.register(adminRoutes);

  app.addHook("onClose", async () => {
    await closeSendQueue();
    try {
      await writeSystemEvent("system.api.stopped");
    } catch (error) {
      app.log.warn({ err: error }, "failed to write api stopped system log");
    }
    await prisma.$disconnect();
    try {
      if (redis.status !== "end") {
        await redis.quit();
      }
    } catch {
      redis.disconnect(false);
    }
  });

  return app;
}

const apiMeta = (() => {
  const hostname = os.hostname();
  let version = "unknown";
  try {
    const pkgPath = path.resolve(process.cwd(), "package.json");
    const raw = fs.readFileSync(pkgPath, "utf-8");
    const pkg = JSON.parse(raw) as { version?: string };
    if (pkg.version) version = pkg.version;
  } catch {
    // best-effort only
  }
  return { hostname, version };
})();

async function writeSystemEvent(action: "system.api.started" | "system.api.stopped") {
  const tenants = await prisma.tenant.findMany({
    select: { id: true }
  });
  if (!tenants.length) return;

  await prisma.auditLog.createMany({
    data: tenants.map((tenant) => ({
      tenantId: tenant.id,
      actorType: "system",
      actorId: "api",
      action,
      metadata: {
        detail: action === "system.api.started" ? "API started" : "API stopped",
        hostname: apiMeta.hostname,
        version: apiMeta.version
      }
    }))
  });
}

async function start() {
  const app = buildApp();
  let shuttingDown = false;
  const shutdown = async (signal: string) => {
    if (shuttingDown) return;
    shuttingDown = true;
    app.log.info({ signal }, "api shutdown initiated");
    try {
      await app.close();
    } catch (error) {
      app.log.warn({ err: error }, "failed to close api");
    } finally {
      process.exit(0);
    }
  };
  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));

  try {
    await app.listen({ port: env.API_PORT, host: "0.0.0.0" });
    try {
      await writeSystemEvent("system.api.started");
    } catch (error) {
      app.log.warn({ err: error }, "failed to write api started system log");
    }
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}
