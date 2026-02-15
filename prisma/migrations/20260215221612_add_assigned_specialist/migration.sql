-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Gig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "budget" INTEGER NOT NULL,
    "serviceFee" INTEGER NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "tags" TEXT NOT NULL DEFAULT '',
    "clientId" TEXT NOT NULL,
    "assignedSpecialistId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Gig_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Gig_assignedSpecialistId_fkey" FOREIGN KEY ("assignedSpecialistId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Gig" ("budget", "clientId", "createdAt", "description", "id", "serviceFee", "status", "tags", "title", "totalAmount", "updatedAt") SELECT "budget", "clientId", "createdAt", "description", "id", "serviceFee", "status", "tags", "title", "totalAmount", "updatedAt" FROM "Gig";
DROP TABLE "Gig";
ALTER TABLE "new_Gig" RENAME TO "Gig";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
