import { FastifyInstance } from "fastify";
import { authenticateUserSession, enforceCsrf } from "../../plugins/security";
import {
  loginController,
  logoutController,
  meController,
  registerController
} from "../../controllers/admin/auth.controller";

export async function registerAuthRoutes(app: FastifyInstance): Promise<void> {
  app.post("/admin/v1/auth/login", loginController);
  app.post("/admin/v1/auth/register", registerController);
  app.post(
    "/admin/v1/auth/logout",
    { preHandler: [authenticateUserSession, enforceCsrf] },
    logoutController
  );
  app.get("/admin/v1/me", { preHandler: [authenticateUserSession] }, meController);
}
