/*
  Warnings:

  - You are about to drop the column `defaultTemplateId` on the `ApiKey` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ApiKey" DROP CONSTRAINT "ApiKey_defaultTemplateId_fkey";

-- AlterTable
ALTER TABLE "ApiKey" DROP COLUMN "defaultTemplateId";
