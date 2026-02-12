-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "domainSenderId" TEXT,
ALTER COLUMN "smtpAccountId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ApiKeyDomainPermission" (
    "apiKeyId" TEXT NOT NULL,
    "domainSenderId" TEXT NOT NULL,

    CONSTRAINT "ApiKeyDomainPermission_pkey" PRIMARY KEY ("apiKeyId","domainSenderId")
);

-- AddForeignKey
ALTER TABLE "ApiKeyDomainPermission" ADD CONSTRAINT "ApiKeyDomainPermission_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "ApiKey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKeyDomainPermission" ADD CONSTRAINT "ApiKeyDomainPermission_domainSenderId_fkey" FOREIGN KEY ("domainSenderId") REFERENCES "DomainSender"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_domainSenderId_fkey" FOREIGN KEY ("domainSenderId") REFERENCES "DomainSender"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
