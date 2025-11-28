/*
  Warnings:

  - You are about to drop the column `balanceId` on the `InrBalance` table. All the data in the column will be lost.
  - You are about to drop the `Balance` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `InrBalance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `InrBalance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Side" AS ENUM ('yes', 'no');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('buy', 'sell');

-- DropForeignKey
ALTER TABLE "Balance" DROP CONSTRAINT "Balance_userId_fkey";

-- DropForeignKey
ALTER TABLE "InrBalance" DROP CONSTRAINT "InrBalance_balanceId_fkey";

-- DropIndex
DROP INDEX "InrBalance_balanceId_key";

-- AlterTable
ALTER TABLE "InrBalance" DROP COLUMN "balanceId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL;

-- DropTable
DROP TABLE "Balance";

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "side" "Side" NOT NULL,
    "type" "OrderType" NOT NULL,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "filled" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "marketId" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Market" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sourceOfTruth" TEXT NOT NULL,
    "endDateTime" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "Market_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockBalance" (
    "id" TEXT NOT NULL,
    "side" "Side" NOT NULL,
    "available" INTEGER NOT NULL,
    "locked" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "marketId" TEXT NOT NULL,

    CONSTRAINT "StockBalance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "StockBalance_marketId_key" ON "StockBalance"("marketId");

-- CreateIndex
CREATE UNIQUE INDEX "InrBalance_userId_key" ON "InrBalance"("userId");

-- AddForeignKey
ALTER TABLE "InrBalance" ADD CONSTRAINT "InrBalance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "Market"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Market" ADD CONSTRAINT "Market_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Market" ADD CONSTRAINT "Market_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockBalance" ADD CONSTRAINT "StockBalance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockBalance" ADD CONSTRAINT "StockBalance_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "Market"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
