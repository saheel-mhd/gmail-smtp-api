-- CreateEnum
CREATE TYPE "DomainStatus" AS ENUM ('pending', 'verified', 'failed');

-- CreateTable
CREATE TABLE "Domain" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "status" "DomainStatus" NOT NULL DEFAULT 'pending',
    "verificationToken" TEXT NOT NULL,
    "txtHost" TEXT NOT NULL,
    "txtValue" TEXT NOT NULL,
    "spfHost" TEXT NOT NULL,
    "spfValue" TEXT NOT NULL,
    "cnameHost" TEXT NOT NULL,
    "cnameValue" TEXT NOT NULL,
    "mxHost" TEXT NOT NULL,
    "mxPriority" INTEGER NOT NULL DEFAULT 10,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Domain_tenantId_idx" ON "Domain"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Domain_userId_domain_key" ON "Domain"("userId", "domain");

-- AddForeignKey
ALTER TABLE "Domain" ADD CONSTRAINT "Domain_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Domain" ADD CONSTRAINT "Domain_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
