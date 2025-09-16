/*
  Warnings:

  - Added the required column `updatedAt` to the `MedicalRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clinicId` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."MedicalRecord" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Schedule" ADD COLUMN     "clinicId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Schedule" ADD CONSTRAINT "Schedule_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "public"."Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
