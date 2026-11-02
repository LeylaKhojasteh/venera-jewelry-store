-- Product images can live in PostgreSQL so admin uploads survive serverless deployments.
ALTER TABLE "ProductImage" ADD COLUMN "data" BYTEA;
ALTER TABLE "ProductImage" ADD COLUMN "mimeType" TEXT;
