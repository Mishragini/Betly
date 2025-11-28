/*
  Warnings:

  - A unique constraint covering the columns `[userId,side,marketId]` on the table `StockBalance` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "StockBalance_marketId_key";

-- CreateIndex
CREATE UNIQUE INDEX "StockBalance_userId_side_marketId_key" ON "StockBalance"("userId", "side", "marketId");
