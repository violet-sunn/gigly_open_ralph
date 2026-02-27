-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "gigId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'MESSAGE',
    "eventType" TEXT,
    "eventData" TEXT,
    "lastReadAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Notification_gigId_fkey" FOREIGN KEY ("gigId") REFERENCES "Gig" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Notification" ("createdAt", "gigId", "id", "lastReadAt", "updatedAt", "userId") SELECT "createdAt", "gigId", "id", "lastReadAt", "updatedAt", "userId" FROM "Notification";
DROP TABLE "Notification";
ALTER TABLE "new_Notification" RENAME TO "Notification";
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");
CREATE INDEX "Notification_gigId_idx" ON "Notification"("gigId");
CREATE UNIQUE INDEX "Notification_userId_gigId_key" ON "Notification"("userId", "gigId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
