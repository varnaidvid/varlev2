-- DropForeignKey
ALTER TABLE "Competitor" DROP CONSTRAINT "Competitor_teamId_fkey";

-- AlterTable
ALTER TABLE "Competitor" ALTER COLUMN "teamId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Competitor" ADD CONSTRAINT "Competitor_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
