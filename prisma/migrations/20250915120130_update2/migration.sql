/*
  Warnings:

  - A unique constraint covering the columns `[name,address]` on the table `Clinic` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Clinic_name_address_key" ON "public"."Clinic"("name", "address");
