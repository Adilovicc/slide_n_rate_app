/*
  Warnings:

  - The `grade` column on the `Recension` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "Recension" DROP COLUMN "grade",
ADD COLUMN     "grade" INTEGER[];
