-- CreateEnum
CREATE TYPE "RoleEnum" AS ENUM ('ADMIN', 'CLIENT', 'INSTRUCTOR');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "handler" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "country" TEXT,
    "phone" TEXT,
    "photo" TEXT,
    "coverImage" TEXT,
    "NID_Verified" BOOLEAN DEFAULT false,
    "isInstructor" BOOLEAN DEFAULT false,
    "jobTitle" TEXT,
    "bio" TEXT,
    "experience" TEXT,
    "hourlyRate" DOUBLE PRECISION,
    "paidBalance" DOUBLE PRECISION DEFAULT 0.0,
    "unPaidBalance" DOUBLE PRECISION DEFAULT 0.0,
    "availability" BOOLEAN DEFAULT false,
    "freeSession" BOOLEAN DEFAULT false,
    "discount" DOUBLE PRECISION,
    "rating" DOUBLE PRECISION DEFAULT 0.0,
    "resetToken" TEXT,
    "resetTokenExpires" TIMESTAMP(3),
    "changedPasswordAt" TIMESTAMP(3),
    "loggedOutAt" TIMESTAMP(3),
    "role" "RoleEnum" NOT NULL DEFAULT 'CLIENT',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTopics" (
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,

    CONSTRAINT "UserTopics_pkey" PRIMARY KEY ("userId","topicId")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "delivered" BOOLEAN NOT NULL,
    "capacity" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "instructorId" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientSession" (
    "clientId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,

    CONSTRAINT "clientSession_pkey" PRIMARY KEY ("clientId","sessionId")
);

-- CreateTable
CREATE TABLE "BookedSlot" (
    "id" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "order" INTEGER NOT NULL,
    "instructorId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,

    CONSTRAINT "BookedSlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_handler_key" ON "User"("handler");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_name_key" ON "Topic"("name");

-- AddForeignKey
ALTER TABLE "UserTopics" ADD CONSTRAINT "UserTopics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTopics" ADD CONSTRAINT "UserTopics_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientSession" ADD CONSTRAINT "clientSession_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientSession" ADD CONSTRAINT "clientSession_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookedSlot" ADD CONSTRAINT "BookedSlot_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookedSlot" ADD CONSTRAINT "BookedSlot_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
