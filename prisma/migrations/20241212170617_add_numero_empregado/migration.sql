/*
  Warnings:

  - You are about to drop the column `numero_ordem` on the `medicos` table. All the data in the column will be lost.
  - Added the required column `numero_empregado` to the `medicos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `medicos` DROP COLUMN `numero_ordem`,
    ADD COLUMN `numero_empregado` INTEGER NOT NULL;
