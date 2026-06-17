-- AlterTable
ALTER TABLE "Application" ADD COLUMN "proposedBudget" INTEGER;
ALTER TABLE "Application" ADD COLUMN "proposedDeadlineDays" INTEGER;

-- CreateTable
CREATE TABLE "WorkExperience" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "startYear" INTEGER,
    "endYear" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WorkExperience_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "SpecialistProfile" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Dispute" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gigId" TEXT NOT NULL,
    "openerId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "resolution" TEXT NOT NULL DEFAULT '',
    "resolvedById" TEXT,
    "resolutionLogId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Dispute_gigId_fkey" FOREIGN KEY ("gigId") REFERENCES "Gig" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Dispute_openerId_fkey" FOREIGN KEY ("openerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Dispute_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Dispute_resolutionLogId_fkey" FOREIGN KEY ("resolutionLogId") REFERENCES "ModerationLog" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL DEFAULT '',
    "gigId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_gigId_fkey" FOREIGN KEY ("gigId") REFERENCES "Gig" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Review_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Category" (
    "slug" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "_FavoriteCategories" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_FavoriteCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Category" ("slug") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_FavoriteCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ClientProfile" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "companyName" TEXT NOT NULL,
    "inn" TEXT NOT NULL,
    "kpp" TEXT NOT NULL DEFAULT '',
    "contactPerson" TEXT NOT NULL DEFAULT '',
    "phoneNumber" TEXT NOT NULL DEFAULT '',
    "avatarUrl" TEXT NOT NULL DEFAULT '',
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ClientProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ClientProfile" ("companyName", "contactPerson", "createdAt", "inn", "kpp", "phoneNumber", "updatedAt", "userId") SELECT "companyName", "contactPerson", "createdAt", "inn", "kpp", "phoneNumber", "updatedAt", "userId" FROM "ClientProfile";
DROP TABLE "ClientProfile";
ALTER TABLE "new_ClientProfile" RENAME TO "ClientProfile";
CREATE TABLE "new_Gig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "acceptanceCriteria" TEXT,
    "goal" TEXT NOT NULL DEFAULT '',
    "deliverables" TEXT NOT NULL DEFAULT '',
    "constraints" TEXT NOT NULL DEFAULT '',
    "budget" INTEGER NOT NULL,
    "serviceFee" INTEGER NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "tags" TEXT NOT NULL DEFAULT '',
    "deadlineDays" INTEGER NOT NULL DEFAULT 0,
    "stageCount" INTEGER NOT NULL DEFAULT 1,
    "clientId" TEXT NOT NULL,
    "assignedSpecialistId" TEXT,
    "paidAt" DATETIME,
    "closedByAdmin" BOOLEAN NOT NULL DEFAULT false,
    "closedAt" DATETIME,
    "isExample" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "categorySlug" TEXT,
    CONSTRAINT "Gig_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Gig_assignedSpecialistId_fkey" FOREIGN KEY ("assignedSpecialistId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Gig_categorySlug_fkey" FOREIGN KEY ("categorySlug") REFERENCES "Category" ("slug") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Gig" ("acceptanceCriteria", "assignedSpecialistId", "budget", "clientId", "closedAt", "closedByAdmin", "constraints", "createdAt", "deliverables", "description", "goal", "id", "isExample", "paidAt", "serviceFee", "status", "tags", "title", "totalAmount", "updatedAt") SELECT "acceptanceCriteria", "assignedSpecialistId", "budget", "clientId", "closedAt", "closedByAdmin", "constraints", "createdAt", "deliverables", "description", "goal", "id", "isExample", "paidAt", "serviceFee", "status", "tags", "title", "totalAmount", "updatedAt" FROM "Gig";
DROP TABLE "Gig";
ALTER TABLE "new_Gig" RENAME TO "Gig";
CREATE INDEX "Gig_closedByAdmin_idx" ON "Gig"("closedByAdmin");
CREATE TABLE "new_SpecialistProfile" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "displayName" TEXT NOT NULL DEFAULT '',
    "techStack" TEXT NOT NULL DEFAULT '',
    "experienceLevel" TEXT NOT NULL DEFAULT '',
    "bio" TEXT NOT NULL DEFAULT '',
    "avatarUrl" TEXT NOT NULL DEFAULT '',
    "phoneNumber" TEXT NOT NULL DEFAULT '',
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "position" TEXT NOT NULL DEFAULT '',
    "specialization" TEXT NOT NULL DEFAULT '',
    "location" TEXT NOT NULL DEFAULT '',
    "timezone" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SpecialistProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SpecialistProfile" ("bio", "createdAt", "displayName", "experienceLevel", "techStack", "updatedAt", "userId") SELECT "bio", "createdAt", "displayName", "experienceLevel", "techStack", "updatedAt", "userId" FROM "SpecialistProfile";
DROP TABLE "SpecialistProfile";
ALTER TABLE "new_SpecialistProfile" RENAME TO "SpecialistProfile";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "suspended" BOOLEAN NOT NULL DEFAULT false,
    "hasCreatedFirstGig" BOOLEAN NOT NULL DEFAULT false,
    "hasSubmittedFirstApplication" BOOLEAN NOT NULL DEFAULT false,
    "gigCreationGuidanceDismissed" BOOLEAN NOT NULL DEFAULT false,
    "applicationGuidanceDismissed" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT NOT NULL DEFAULT 'ru',
    "notifyApplications" BOOLEAN NOT NULL DEFAULT true,
    "notifyStatusChanges" BOOLEAN NOT NULL DEFAULT true,
    "notifyMessages" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("applicationGuidanceDismissed", "createdAt", "email", "gigCreationGuidanceDismissed", "hasCreatedFirstGig", "hasSubmittedFirstApplication", "id", "password", "role", "suspended", "updatedAt") SELECT "applicationGuidanceDismissed", "createdAt", "email", "gigCreationGuidanceDismissed", "hasCreatedFirstGig", "hasSubmittedFirstApplication", "id", "password", "role", "suspended", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_suspended_idx" ON "User"("suspended");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "WorkExperience_profileId_idx" ON "WorkExperience"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "Dispute_resolutionLogId_key" ON "Dispute"("resolutionLogId");

-- CreateIndex
CREATE INDEX "Dispute_status_idx" ON "Dispute"("status");

-- CreateIndex
CREATE INDEX "Dispute_gigId_idx" ON "Dispute"("gigId");

-- CreateIndex
CREATE UNIQUE INDEX "Dispute_gigId_openerId_key" ON "Dispute"("gigId", "openerId");

-- CreateIndex
CREATE INDEX "Review_targetId_idx" ON "Review"("targetId");

-- CreateIndex
CREATE INDEX "Review_gigId_idx" ON "Review"("gigId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_gigId_authorId_key" ON "Review"("gigId", "authorId");

-- CreateIndex
CREATE UNIQUE INDEX "_FavoriteCategories_AB_unique" ON "_FavoriteCategories"("A", "B");

-- CreateIndex
CREATE INDEX "_FavoriteCategories_B_index" ON "_FavoriteCategories"("B");
