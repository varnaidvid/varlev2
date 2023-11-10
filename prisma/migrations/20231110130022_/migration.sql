/*
  Warnings:

  - You are about to drop the column `competitionId` on the `Question` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_competitionId_fkey";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "competitionId";

-- CreateTable
CREATE TABLE "_CompetitionToQuestion" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CompetitionToQuestion_AB_unique" ON "_CompetitionToQuestion"("A", "B");

-- CreateIndex
CREATE INDEX "_CompetitionToQuestion_B_index" ON "_CompetitionToQuestion"("B");

-- AddForeignKey
ALTER TABLE "_CompetitionToQuestion" ADD CONSTRAINT "_CompetitionToQuestion_A_fkey" FOREIGN KEY ("A") REFERENCES "Competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetitionToQuestion" ADD CONSTRAINT "_CompetitionToQuestion_B_fkey" FOREIGN KEY ("B") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
