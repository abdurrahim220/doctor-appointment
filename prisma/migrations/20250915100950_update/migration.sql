/*
  Warnings:

  - A unique constraint covering the columns `[licenseNumber]` on the table `DoctorProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[licenseNumber]` on the table `NurseProfile` will be added. If there are existing duplicate values, this will fail.
  - Made the column `licenseNumber` on table `NurseProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."NurseProfile" ALTER COLUMN "licenseNumber" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DoctorProfile_licenseNumber_key" ON "public"."DoctorProfile"("licenseNumber");

-- CreateIndex
CREATE UNIQUE INDEX "NurseProfile_licenseNumber_key" ON "public"."NurseProfile"("licenseNumber");
