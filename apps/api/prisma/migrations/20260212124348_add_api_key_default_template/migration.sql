-- AlterTable
ALTER TABLE "ApiKey" ADD COLUMN     "defaultTemplateId" TEXT;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_defaultTemplateId_fkey" FOREIGN KEY ("defaultTemplateId") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;
