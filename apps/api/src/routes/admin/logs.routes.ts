import { FastifyInstance } from "fastify";
import { authenticateUserSession } from "../../plugins/security";
import {
  auditLogsController,
  emailLogsController,
  systemLogsController
} from "../../controllers/admin/logs.controller";

export async function registerLogRoutes(app: FastifyInstance): Promise<void> {
  app.get("/admin/v1/logs", { preHandler: [authenticateUserSession] }, auditLogsController);
  app.get(
    "/admin/v1/system-logs",
    { preHandler: [authenticateUserSession] },
    systemLogsController
  );
  app.get(
    "/admin/v1/email-logs",
    { preHandler: [authenticateUserSession] },
    emailLogsController
  );
}
