/*
  Warnings:

  - The primary key for the `Authentication` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[jwt]` on the table `Authentication` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Authentication" DROP CONSTRAINT "Authentication_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "Authentication_jwt_key" ON "public"."Authentication"("jwt");
