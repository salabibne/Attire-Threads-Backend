/*
  Warnings:

  - You are about to drop the `NewArrival` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "NewArrival";

-- CreateTable
CREATE TABLE "PromoProducts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "limit" INTEGER NOT NULL DEFAULT 8,
    "products_id" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromoProducts_pkey" PRIMARY KEY ("id")
);
