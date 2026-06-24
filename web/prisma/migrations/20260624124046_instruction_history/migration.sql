-- DropIndex
DROP INDEX "Instruction_type_key";

-- AlterTable
ALTER TABLE "Instruction" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
