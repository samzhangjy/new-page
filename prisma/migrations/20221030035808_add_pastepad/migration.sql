-- CreateEnum
CREATE TYPE "PasteType" AS ENUM ('TEXT', 'IMAGE', 'VIDEO', 'FILE');

-- CreateTable
CREATE TABLE "Paste" (
    "id" SERIAL NOT NULL,
    "authorId" INTEGER NOT NULL,
    "contents" TEXT NOT NULL,
    "type" "PasteType" NOT NULL DEFAULT 'TEXT',

    CONSTRAINT "Paste_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Paste" ADD CONSTRAINT "Paste_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
