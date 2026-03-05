import { FastifyInstance } from "fastify";
import { authenticateUserSession } from "../../plugins/security";
import { createSenderController, listSendersController } from "../../controllers/admin/senders.controller";
import {
  disableSenderController,
  testSenderController,
  updateSenderController
} from "../../controllers/admin/sender-actions.controller";
import { mutatingPreHandlers } from "./route-helpers";

export async function registerSenderRoutes(app: FastifyInstance): Promise<void> {
  app.get("/admin/v1/senders", { preHandler: [authenticateUserSession] }, listSendersController);
  app.post(
    "/admin/v1/senders",
    { preHandler: [...mutatingPreHandlers] },
    createSenderController
  );
  app.patch(
    "/admin/v1/senders/:id",
    { preHandler: [...mutatingPreHandlers] },
    updateSenderController
  );
  app.delete(
    "/admin/v1/senders/:id",
    { preHandler: [...mutatingPreHandlers] },
    disableSenderController
  );
  app.post(
    "/admin/v1/senders/:id/test",
    { preHandler: [...mutatingPreHandlers] },
    testSenderController
  );
}
