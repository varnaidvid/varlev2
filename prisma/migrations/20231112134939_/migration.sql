/*
  Warnings:

  - You are about to drop the column `year5` on the `Competition` table. All the data in the column will be lost.
  - You are about to drop the column `year6` on the `Competition` table. All the data in the column will be lost.
  - You are about to drop the column `year7` on the `Competition` table. All the data in the column will be lost.
  - You are about to drop the column `year8` on the `Competition` table. All the data in the column will be lost.
  - Added the required column `year` to the `Competition` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Competition" DROP COLUMN "year5",
DROP COLUMN "year6",
DROP COLUMN "year7",
DROP COLUMN "year8",
ADD COLUMN     "year" TEXT NOT NULL;
