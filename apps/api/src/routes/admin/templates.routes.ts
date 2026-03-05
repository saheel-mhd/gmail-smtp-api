import { FastifyInstance } from "fastify";
import { authenticateUserSession } from "../../plugins/security";
import {
  createTemplateController,
  disableTemplateController,
  listTemplatesController,
  updateTemplateController
} from "../../controllers/admin/templates.controller";
import { mutatingPreHandlers } from "./route-helpers";

export async function registerTemplateRoutes(app: FastifyInstance): Promise<void> {
  app.get("/admin/v1/templates", { preHandler: [authenticateUserSession] }, listTemplatesController);
  app.post(
    "/admin/v1/templates",
    { preHandler: [...mutatingPreHandlers] },
    createTemplateController
  );
  app.patch(
    "/admin/v1/templates/:id",
    { preHandler: [...mutatingPreHandlers] },
    updateTemplateController
  );
  app.delete(
    "/admin/v1/templates/:id",
    { preHandler: [...mutatingPreHandlers] },
    disableTemplateController
  );
}
