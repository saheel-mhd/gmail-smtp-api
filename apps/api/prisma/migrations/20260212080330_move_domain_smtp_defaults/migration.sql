/*
  Warnings:

  - You are about to drop the column `smtpHost` on the `DomainSender` table. All the data in the column will be lost.
  - You are about to drop the column `smtpPort` on the `DomainSender` table. All the data in the column will be lost.
  - You are about to drop the column `smtpSecure` on the `DomainSender` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Domain" ADD COLUMN     "smtpHost" TEXT,
ADD COLUMN     "smtpPort" INTEGER NOT NULL DEFAULT 587,
ADD COLUMN     "smtpSecure" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "DomainSender" DROP COLUMN "smtpHost",
DROP COLUMN "smtpPort",
DROP COLUMN "smtpSecure";
