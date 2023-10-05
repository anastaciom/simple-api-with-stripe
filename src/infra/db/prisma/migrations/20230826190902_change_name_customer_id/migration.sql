/*
  Warnings:

  - You are about to drop the column `user_customer_id` on the `user_subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `customer_id` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripe_customer_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripe_customer_id,id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_stripe_customer_id` to the `user_subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user_subscriptions" DROP CONSTRAINT "user_subscriptions_user_id_user_customer_id_fkey";

-- DropIndex
DROP INDEX "users_customer_id_id_key";

-- DropIndex
DROP INDEX "users_customer_id_key";

-- AlterTable
ALTER TABLE "user_subscriptions" DROP COLUMN "user_customer_id",
ADD COLUMN     "user_stripe_customer_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "customer_id",
ADD COLUMN     "stripe_customer_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_stripe_customer_id_key" ON "users"("stripe_customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripe_customer_id_id_key" ON "users"("stripe_customer_id", "id");

-- AddForeignKey
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_user_id_user_stripe_customer_id_fkey" FOREIGN KEY ("user_id", "user_stripe_customer_id") REFERENCES "users"("id", "stripe_customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;
