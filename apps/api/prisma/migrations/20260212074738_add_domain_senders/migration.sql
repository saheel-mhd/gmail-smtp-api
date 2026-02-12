-- CreateTable
CREATE TABLE "DomainSender" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "smtpHost" TEXT NOT NULL,
    "smtpPort" INTEGER NOT NULL DEFAULT 587,
    "smtpSecure" BOOLEAN NOT NULL DEFAULT false,
    "username" TEXT NOT NULL,
    "encryptedPassword" TEXT NOT NULL,
    "iv" TEXT NOT NULL,
    "authTag" TEXT NOT NULL,
    "keyVersion" TEXT NOT NULL,
    "status" "SenderStatus" NOT NULL DEFAULT 'active',
    "perDayLimit" INTEGER NOT NULL DEFAULT 2000,
    "sentTodayCount" INTEGER NOT NULL DEFAULT 0,
    "sentTodayResetAt" TIMESTAMP(3),
    "lastSuccessAt" TIMESTAMP(3),
    "lastErrorAt" TIMESTAMP(3),
    "errorStreak" INTEGER NOT NULL DEFAULT 0,
    "healthScore" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DomainSender_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DomainSender_tenantId_idx" ON "DomainSender"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "DomainSender_tenantId_emailAddress_key" ON "DomainSender"("tenantId", "emailAddress");

-- AddForeignKey
ALTER TABLE "DomainSender" ADD CONSTRAINT "DomainSender_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DomainSender" ADD CONSTRAINT "DomainSender_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE CASCADE ON UPDATE CASCADE;
