/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Competition` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Competition_name_key" ON "Competition"("name");
