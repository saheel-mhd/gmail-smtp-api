-- Tag messages that came from a test-send (template preview / test-api) so admins
-- can filter them out of email logs and analytics later. Defaults to false so
-- existing rows are treated as production sends.
ALTER TABLE "Message"
  ADD COLUMN "isTest" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "Message_tenantId_isTest_createdAt_idx"
  ON "Message"("tenantId", "isTest", "createdAt");
