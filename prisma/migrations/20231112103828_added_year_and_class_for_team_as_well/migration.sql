/*
  Warnings:

  - Added the required column `class` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "class" TEXT NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;
