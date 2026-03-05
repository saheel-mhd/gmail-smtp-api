import { FastifyInstance } from "fastify";
import { registerAdminRoutes } from "./admin/index";

export async function adminRoutes(app: FastifyInstance): Promise<void> {
  await registerAdminRoutes(app);
}
