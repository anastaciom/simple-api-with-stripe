/*
  Warnings:

  - Added the required column `theme_color` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "theme_color" VARCHAR(50) NOT NULL;
