/*
  Warnings:

  - Added the required column `imageUrl` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `Market` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "imageUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Market" ADD COLUMN     "imageUrl" TEXT NOT NULL;
