import { FastifyInstance } from "fastify";
import { testApiSendController } from "../../controllers/admin/test-api.controller";
import { mutatingPreHandlers } from "./route-helpers";

export async function registerTestApiRoutes(app: FastifyInstance): Promise<void> {
  app.post(
    "/admin/v1/test-api/send",
    { preHandler: [...mutatingPreHandlers] },
    testApiSendController
  );
}
