/*
  Warnings:

  - You are about to drop the column `questionId` on the `Competition` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Competition" DROP CONSTRAINT "Competition_questionId_fkey";

-- AlterTable
ALTER TABLE "Competition" DROP COLUMN "questionId";
