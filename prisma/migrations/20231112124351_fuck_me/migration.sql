/*
  Warnings:

  - You are about to drop the `_CompetitionToQuestion` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `competitionId` to the `Attempt` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CompetitionToQuestion" DROP CONSTRAINT "_CompetitionToQuestion_A_fkey";

-- DropForeignKey
ALTER TABLE "_CompetitionToQuestion" DROP CONSTRAINT "_CompetitionToQuestion_B_fkey";

-- AlterTable
ALTER TABLE "Attempt" ADD COLUMN     "competitionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Competition" ADD COLUMN     "questionId" TEXT,
ADD COLUMN     "questions1" TEXT[],
ADD COLUMN     "questions2" TEXT[],
ADD COLUMN     "questions3" TEXT[];

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "competitionId" TEXT;

-- DropTable
DROP TABLE "_CompetitionToQuestion";

-- CreateTable
CREATE TABLE "_CompetitionToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CompetitionToUser_AB_unique" ON "_CompetitionToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_CompetitionToUser_B_index" ON "_CompetitionToUser"("B");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competition" ADD CONSTRAINT "Competition_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetitionToUser" ADD CONSTRAINT "_CompetitionToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetitionToUser" ADD CONSTRAINT "_CompetitionToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
