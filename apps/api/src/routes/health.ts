import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { redis } from "../lib/redis";

export async function healthRoutes(app: FastifyInstance): Promise<void> {
  app.get("/health/live", async () => ({ ok: true }));

  app.get("/health/ready", async (_, reply) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      await redis.ping();
      return { ok: true };
    } catch {
      return reply.code(503).send({ ok: false });
    }
  });
}
