/*
  Warnings:

  - You are about to drop the column `questions1` on the `Competition` table. All the data in the column will be lost.
  - You are about to drop the column `questions2` on the `Competition` table. All the data in the column will be lost.
  - You are about to drop the column `questions3` on the `Competition` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Competition" DROP COLUMN "questions1",
DROP COLUMN "questions2",
DROP COLUMN "questions3";

-- CreateTable
CREATE TABLE "_questions1Questions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_questions2Questions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_questions3Questions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_questions1Questions_AB_unique" ON "_questions1Questions"("A", "B");

-- CreateIndex
CREATE INDEX "_questions1Questions_B_index" ON "_questions1Questions"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_questions2Questions_AB_unique" ON "_questions2Questions"("A", "B");

-- CreateIndex
CREATE INDEX "_questions2Questions_B_index" ON "_questions2Questions"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_questions3Questions_AB_unique" ON "_questions3Questions"("A", "B");

-- CreateIndex
CREATE INDEX "_questions3Questions_B_index" ON "_questions3Questions"("B");

-- AddForeignKey
ALTER TABLE "_questions1Questions" ADD CONSTRAINT "_questions1Questions_A_fkey" FOREIGN KEY ("A") REFERENCES "Competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_questions1Questions" ADD CONSTRAINT "_questions1Questions_B_fkey" FOREIGN KEY ("B") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_questions2Questions" ADD CONSTRAINT "_questions2Questions_A_fkey" FOREIGN KEY ("A") REFERENCES "Competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_questions2Questions" ADD CONSTRAINT "_questions2Questions_B_fkey" FOREIGN KEY ("B") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_questions3Questions" ADD CONSTRAINT "_questions3Questions_A_fkey" FOREIGN KEY ("A") REFERENCES "Competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_questions3Questions" ADD CONSTRAINT "_questions3Questions_B_fkey" FOREIGN KEY ("B") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
