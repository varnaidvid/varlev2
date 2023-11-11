/*
  Warnings:

  - You are about to drop the column `image_url` on the `Team` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Competition" ADD COLUMN     "image_url" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "image_url";
