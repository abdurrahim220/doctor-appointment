/*
  Warnings:

  - Made the column `dateOfBirth` on table `PatientProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."PatientProfile" ALTER COLUMN "dateOfBirth" SET NOT NULL,
ALTER COLUMN "dateOfBirth" SET DATA TYPE TEXT;
