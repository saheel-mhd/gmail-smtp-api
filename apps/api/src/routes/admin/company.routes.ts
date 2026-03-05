import { FastifyInstance } from "fastify";
import { authenticateUserSession } from "../../plugins/security";
import {
  getCompanyController,
  upsertCompanyController
} from "../../controllers/admin/company.controller";
import { mutatingPreHandlers } from "./route-helpers";

export async function registerCompanyRoutes(app: FastifyInstance): Promise<void> {
  app.get("/admin/v1/company", { preHandler: [authenticateUserSession] }, getCompanyController);
  app.post(
    "/admin/v1/company",
    { preHandler: [...mutatingPreHandlers] },
    upsertCompanyController
  );
}
