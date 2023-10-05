/*
  Warnings:

  - You are about to drop the column `role_id` on the `permissions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "permissions" DROP CONSTRAINT "permissions_role_id_fkey";

-- AlterTable
ALTER TABLE "permissions" DROP COLUMN "role_id";

-- CreateTable
CREATE TABLE "role_to_permission" (
    "role_id" TEXT NOT NULL,
    "permission_id" TEXT NOT NULL,

    CONSTRAINT "role_to_permission_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateTable
CREATE TABLE "_RoleToPermission" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RoleToPermission_AB_unique" ON "_RoleToPermission"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleToPermission_B_index" ON "_RoleToPermission"("B");

-- AddForeignKey
ALTER TABLE "role_to_permission" ADD CONSTRAINT "role_to_permission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_to_permission" ADD CONSTRAINT "role_to_permission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToPermission" ADD CONSTRAINT "_RoleToPermission_A_fkey" FOREIGN KEY ("A") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToPermission" ADD CONSTRAINT "_RoleToPermission_B_fkey" FOREIGN KEY ("B") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
