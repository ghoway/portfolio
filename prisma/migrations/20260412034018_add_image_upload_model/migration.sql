-- CreateTable
CREATE TABLE "ImageUpload" (
    "id" TEXT NOT NULL,
    "cloudinaryId" TEXT NOT NULL,
    "secureUrl" TEXT NOT NULL,
    "folder" TEXT NOT NULL DEFAULT 'general',
    "width" INTEGER,
    "height" INTEGER,
    "format" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImageUpload_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ImageUpload_cloudinaryId_key" ON "ImageUpload"("cloudinaryId");
