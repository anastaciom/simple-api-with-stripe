/*
  Warnings:

  - Changed the type of `type_of_charge` on the `subscriptions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TypeOfCharge" AS ENUM ('MONTHLY', 'ANNUAL');

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "type_of_charge",
ADD COLUMN     "type_of_charge" "TypeOfCharge" NOT NULL;
