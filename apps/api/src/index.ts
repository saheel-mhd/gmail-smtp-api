import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import jwt from "@fastify/jwt";
import sensible from "@fastify/sensible";
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

async function start() {
  const app = buildApp();
  try {
    await app.listen({ port: env.API_PORT, host: "0.0.0.0" });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}
