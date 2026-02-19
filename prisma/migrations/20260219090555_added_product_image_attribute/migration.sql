-- CreateTable
CREATE TABLE "productImageAttribute" (
    "id" TEXT NOT NULL,
    "imageBannar" TEXT NOT NULL,
    "imageGallery" TEXT[],
    "productVariantId" TEXT NOT NULL,

    CONSTRAINT "productImageAttribute_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "productImageAttribute" ADD CONSTRAINT "productImageAttribute_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
