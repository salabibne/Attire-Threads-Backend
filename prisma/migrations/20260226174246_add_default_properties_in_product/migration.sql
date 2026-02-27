-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "defaultImageBanner" TEXT,
ADD COLUMN     "defaultImagesGallery" TEXT[],
ADD COLUMN     "defaultPrice" DOUBLE PRECISION,
ADD COLUMN     "maxPrice" DOUBLE PRECISION,
ADD COLUMN     "minPrice" DOUBLE PRECISION;
