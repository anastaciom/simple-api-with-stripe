/*
  Warnings:

  - A unique constraint covering the columns `[price_id_stripe]` on the table `subscriptions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `price_id_stripe` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "price_id_stripe" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_price_id_stripe_key" ON "subscriptions"("price_id_stripe");
