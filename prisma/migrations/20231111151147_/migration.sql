/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Competitor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Competitor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Competitor" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Competitor_userId_key" ON "Competitor"("userId");

-- AddForeignKey
ALTER TABLE "Competitor" ADD CONSTRAINT "Competitor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
