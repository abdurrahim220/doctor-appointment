-- AlterTable
ALTER TABLE "public"."Schedule" ADD COLUMN     "maxPatients" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "slotDuration" INTEGER NOT NULL DEFAULT 30;
