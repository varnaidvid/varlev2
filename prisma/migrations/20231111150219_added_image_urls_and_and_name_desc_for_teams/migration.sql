/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "image_url" TEXT DEFAULT '',
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");
