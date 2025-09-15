-- AlterTable
ALTER TABLE "public"."DoctorProfile" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "public"."NurseProfile" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "public"."ClinicNurse" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "nurseId" TEXT NOT NULL,

    CONSTRAINT "ClinicNurse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClinicNurse_clinicId_nurseId_key" ON "public"."ClinicNurse"("clinicId", "nurseId");

-- AddForeignKey
ALTER TABLE "public"."ClinicNurse" ADD CONSTRAINT "ClinicNurse_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "public"."Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClinicNurse" ADD CONSTRAINT "ClinicNurse_nurseId_fkey" FOREIGN KEY ("nurseId") REFERENCES "public"."NurseProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
