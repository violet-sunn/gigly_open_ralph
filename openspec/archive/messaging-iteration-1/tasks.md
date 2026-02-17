# Implementation Tasks: messaging-iteration-1

## Task 1: Add Message model to Prisma schema

**Implementation Notes:**
- Open `prisma/schema.prisma`
- Add new `Message` model after the existing models
- Include fields: id (String, @id, @default(cuid())), gigId (String), senderId (String), content (String), createdAt (DateTime, @default(now())), updatedAt (DateTime, @updatedAt)
- Add relation fields: `gig Gig @relation(fields: [gigId], references: [id])` and `sender User @relation("SentMessages", fields: [senderId], references: [id])`
- Add indexes: `@@index([gigId])` and `@@index([createdAt])`
- Use named relation "SentMessages" to avoid ambiguity with existing User relations

**Test Plan:**
```bash
# Validate schema syntax
npx prisma format
npx prisma validate

# Expected: No errors, schema is valid
```

---

## Task 2: Add Message relation to Gig model

**Implementation Notes:**
- Open `prisma/schema.prisma`
- Locate the `Gig` model
- Add relation field: `messages Message[]` (after the `moderations` field)
- This creates a one-to-many relation: one Gig has many Messages

**Test Plan:**
```bash
# Validate schema with new relation
npx prisma format
npx prisma validate

# Expected: No errors, relation is valid
```

---

## Task 3: Add sentMessages relation to User model

**Implementation Notes:**
- Open `prisma/schema.prisma`
- Locate the `User` model
- Add relation field: `sentMessages Message[] @relation("SentMessages")` (after the `moderations` field)
- This creates a one-to-many relation: one User has many sent Messages
- Must use the same relation name "SentMessages" as defined in Message model

**Test Plan:**
```bash
# Validate complete schema with all relations
npx prisma format
npx prisma validate

# Expected: No errors, all relations are valid
```

---

## Task 4: Create and apply database migration

**Implementation Notes:**
- Run Prisma migrate command to generate migration file
- Migration name: "add-message-model"
- Review generated SQL to ensure it includes:
  - CREATE TABLE Message with all columns
  - Foreign key constraints on gigId and senderId
  - Indexes on gigId and createdAt
- Apply migration to update SQLite database

**Test Plan:**
```bash
# Create and apply migration
npx prisma migrate dev --name add-message-model

# Expected output:
# - Migration file created in prisma/migrations/
# - Migration applied successfully
# - Prisma Client regenerated

# Verify migration file exists
ls prisma/migrations/ | grep add-message-model

# Expected: Directory with timestamp prefix exists
```

---

## Task 5: Verify Message table in database

**Implementation Notes:**
- Use Prisma Studio to inspect the database
- Verify Message model appears in the UI
- Check that all fields are present and have correct types
- Verify foreign key constraints are enforced

**Test Plan:**
```bash
# Open Prisma Studio
npx prisma studio

# Manual verification steps:
# 1. Navigate to Message model in left sidebar
# 2. Verify columns: id, gigId, senderId, content, createdAt, updatedAt
# 3. Click "Add record" button to verify UI is functional
# 4. Close Prisma Studio without creating records yet
```

---

## Task 6: Test message creation and persistence via Prisma Studio

**Implementation Notes:**
- Open Prisma Studio
- Create test message records manually
- Link messages to existing Gig and User records
- Verify messages persist after closing and reopening Prisma Studio
- Verify foreign key constraints (cannot create message with invalid gigId or senderId)
- Verify relations work (can navigate from Message to Gig, from Gig to Messages)

**Test Plan:**
```bash
# Open Prisma Studio
npx prisma studio

# Manual test steps:
# 1. Navigate to Gig model, note an existing gig ID
# 2. Navigate to User model, note two user IDs (client and specialist)
# 3. Navigate to Message model, click "Add record"
# 4. Fill in:
#    - gigId: [existing gig ID]
#    - senderId: [existing user ID]
#    - content: "Test message from client"
# 5. Save record
# 6. Create second message with different senderId
# 7. Navigate to Gig model, open the gig, verify "messages" relation shows 2 records
# 8. Navigate to User model, open the user, verify "sentMessages" relation shows their message
# 9. Close Prisma Studio
# 10. Reopen Prisma Studio
# 11. Navigate to Message model, verify both messages still exist
# 12. Attempt to create message with invalid gigId (e.g., "invalid-id")
# 13. Expected: Error due to foreign key constraint

# Success criteria:
# - Messages persist across Prisma Studio restarts
# - Relations work bidirectionally (Message→Gig, Gig→Messages, Message→User, User→sentMessages)
# - Foreign key constraints prevent orphaned messages
# - Messages are ordered by createdAt (newest first or oldest first depending on UI)
```

---

## Task 7: Document schema changes

**Implementation Notes:**
- Update `openspec/project.md` "Current State" section to mention messaging data layer
- Add "messaging-iteration-1" to "Completed Changes" list
- Note that this is data layer only, UI implementation is future work

**Test Plan:**
```bash
# Verify documentation is updated
cat openspec/project.md | grep -i "messaging"

# Expected: References to messaging data layer in Current State and Completed Changes
```

---

## Summary

After completing all tasks:
1. Message model exists in Prisma schema
2. Relations to Gig and User are defined
3. Migration has been applied
4. Message table exists in SQLite database
5. Messages can be created and persisted via Prisma Studio
6. Foreign key constraints are enforced
7. Documentation is updated

**Next Steps (future iterations):**
- Implement server actions for creating messages
- Build UI components for message display and input
- Add real-time updates or polling
- Implement access control (only gig owner and assigned specialist can message)
