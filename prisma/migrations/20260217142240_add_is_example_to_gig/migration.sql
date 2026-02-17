-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "clientId" TEXT NOT NULL,
    "assignedSpecialistId" TEXT,
    "paidAt" DATETIME,
    "closedByAdmin" BOOLEAN NOT NULL DEFAULT false,
    "closedAt" DATETIME,
    "isExample" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Gig_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Gig_assignedSpecialistId_fkey" FOREIGN KEY ("assignedSpecialistId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Gig" ("acceptanceCriteria", "assignedSpecialistId", "budget", "clientId", "closedAt", "closedByAdmin", "constraints", "createdAt", "deliverables", "description", "goal", "id", "paidAt", "serviceFee", "status", "tags", "title", "totalAmount", "updatedAt") SELECT "acceptanceCriteria", "assignedSpecialistId", "budget", "clientId", "closedAt", "closedByAdmin", "constraints", "createdAt", "deliverables", "description", "goal", "id", "paidAt", "serviceFee", "status", "tags", "title", "totalAmount", "updatedAt" FROM "Gig";
DROP TABLE "Gig";
ALTER TABLE "new_Gig" RENAME TO "Gig";
CREATE INDEX "Gig_closedByAdmin_idx" ON "Gig"("closedByAdmin");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
