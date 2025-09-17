-- CreateEnum
CREATE TYPE "public"."DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- AlterTable
ALTER TABLE "public"."Schedule" ADD COLUMN     "dayOfWeek" "public"."DayOfWeek"[] DEFAULT ARRAY[]::"public"."DayOfWeek"[],
ADD COLUMN     "timezone" TEXT DEFAULT 'Asia/Dhaka';
