/*
  Warnings:

  - Made the column `role_id` on table `permissions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "permissions" DROP CONSTRAINT "permissions_role_id_fkey";

-- AlterTable
ALTER TABLE "permissions" ALTER COLUMN "role_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
