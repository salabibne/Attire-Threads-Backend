/*
  Warnings:

  - You are about to drop the column `createdAt` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `subCategoryId` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `SKU` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `SKU` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `SKU` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `SKU` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[skuCode]` on the table `SKU` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productId` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skuCode` to the `SKU` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductVariant" DROP CONSTRAINT "ProductVariant_subCategoryId_fkey";

-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "createdAt",
DROP COLUMN "description",
DROP COLUMN "subCategoryId",
DROP COLUMN "updatedAt",
ADD COLUMN     "productId" TEXT NOT NULL,
ALTER COLUMN "size" DROP NOT NULL,
ALTER COLUMN "color" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SKU" DROP COLUMN "createdAt",
DROP COLUMN "description",
DROP COLUMN "name",
DROP COLUMN "updatedAt",
ADD COLUMN     "skuCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SKU_skuCode_key" ON "SKU"("skuCode");

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
