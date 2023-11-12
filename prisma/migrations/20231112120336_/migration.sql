-- CreateTable
CREATE TABLE "SiteInfo" (
    "id" TEXT NOT NULL,
    "htmlText" TEXT NOT NULL DEFAULT '',
    "websiteName" TEXT NOT NULL DEFAULT '',
    "websiteDescription" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteInfo_pkey" PRIMARY KEY ("id")
);
