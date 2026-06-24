-- CreateTable
CREATE TABLE "AiAnalysisLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "module" TEXT NOT NULL DEFAULT 'ADMISSION',
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "durationSeconds" INTEGER NOT NULL,
    "durationString" TEXT NOT NULL,
    "inputText" TEXT NOT NULL,
    "outputText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiAnalysisLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManualEntryLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "module" TEXT NOT NULL DEFAULT 'ADMISSION',
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "durationSeconds" INTEGER NOT NULL,
    "durationString" TEXT NOT NULL,
    "inputText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ManualEntryLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AiAnalysisLog" ADD CONSTRAINT "AiAnalysisLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManualEntryLog" ADD CONSTRAINT "ManualEntryLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
