/*
  Warnings:

  - You are about to drop the column `year` on the `Competition` table. All the data in the column will be lost.
  - Added the required column `year5` to the `Competition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year6` to the `Competition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year7` to the `Competition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year8` to the `Competition` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Competition" DROP COLUMN "year",
ADD COLUMN     "year5" BOOLEAN NOT NULL,
ADD COLUMN     "year6" BOOLEAN NOT NULL,
ADD COLUMN     "year7" BOOLEAN NOT NULL,
ADD COLUMN     "year8" BOOLEAN NOT NULL;
