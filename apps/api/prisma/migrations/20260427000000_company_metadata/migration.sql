-- Add metadata fields to Company. All optional (nullable) — additive only.
ALTER TABLE "Company"
  ADD COLUMN "industry"    TEXT,
  ADD COLUMN "companySize" TEXT,
  ADD COLUMN "country"     TEXT,
  ADD COLUMN "timezone"    TEXT,
  ADD COLUMN "logoUrl"     TEXT,
  ADD COLUMN "about"       TEXT;
