import { FastifyInstance } from "fastify";
import { authenticateUserSession } from "../../plugins/security";
import {
  createApiKeyController,
  listApiKeysController,
  revokeApiKeyController,
  rotateApiKeyController
} from "../../controllers/admin/api-keys.controller";
import { mutatingPreHandlers } from "./route-helpers";

export async function registerApiKeyRoutes(app: FastifyInstance): Promise<void> {
  app.get("/admin/v1/api-keys", { preHandler: [authenticateUserSession] }, listApiKeysController);
  app.post(
    "/admin/v1/api-keys",
    { preHandler: [...mutatingPreHandlers] },
    createApiKeyController
  );
  app.post(
    "/admin/v1/api-keys/:id/rotate",
    { preHandler: [...mutatingPreHandlers] },
    rotateApiKeyController
  );
  app.delete(
    "/admin/v1/api-keys/:id",
    { preHandler: [...mutatingPreHandlers] },
    revokeApiKeyController
  );
}
