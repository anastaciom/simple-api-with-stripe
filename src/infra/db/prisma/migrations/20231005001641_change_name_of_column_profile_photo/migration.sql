/*
  Warnings:

  - You are about to drop the column `profilePhotoName` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "profilePhotoName",
ADD COLUMN     "avatar_url" TEXT;
