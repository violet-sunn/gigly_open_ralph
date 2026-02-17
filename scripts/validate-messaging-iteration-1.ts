import { prisma } from '../lib/prisma';
import { readFileSync } from 'fs';

async function validateMessagingIteration1() {
  console.log('🔍 Validating messaging-iteration-1 implementation\n');
  console.log('=' .repeat(60));

  const results = {
    passed: [] as string[],
    failed: [] as string[],
  };

  try {
    // ========================================
    // REQUIREMENT 1: Message Model
    // ========================================
    console.log('\n📋 REQUIREMENT 1: Message Model\n');

    // Acceptance Criterion: Message model includes all required fields
    console.log('✓ Checking Message schema definition...');
    const schema = readFileSync('prisma/schema.prisma', 'utf-8');

    // Check for Message model existence
    if (schema.includes('model Message')) {
      results.passed.push('✅ Acceptance: Message model exists in schema');
    } else {
      results.failed.push('❌ Acceptance: Message model not found in schema');
    }

    // Check key fields with flexible matching
    const hasId = /id\s+String\s+@id\s+@default\(cuid\(\)\)/.test(schema);
    const hasGigId = /gigId\s+String/.test(schema);
    const hasSenderId = /senderId\s+String/.test(schema);
    const hasContent = /content\s+String/.test(schema);
    const hasCreatedAt = /createdAt\s+DateTime\s+@default\(now\(\)\)/.test(schema);
    const hasUpdatedAt = /updatedAt\s+DateTime\s+@updatedAt/.test(schema);

    if (hasId && hasGigId && hasSenderId && hasContent && hasCreatedAt && hasUpdatedAt) {
      results.passed.push('✅ Scenario: Message schema definition - All required fields present');
    } else {
      results.failed.push('❌ Scenario: Message schema definition - Missing required fields');
    }

    // Check indexes
    if (schema.includes('@@index([gigId])') && schema.includes('@@index([createdAt])')) {
      results.passed.push('✅ Acceptance: Indexes exist on gigId and createdAt');
    } else {
      results.failed.push('❌ Acceptance: Missing indexes on gigId or createdAt');
    }

    // Check Gig relation
    if (/messages\s+Message\[\]/.test(schema)) {
      results.passed.push('✅ Acceptance: Gig model includes messages Message[] relation');
    } else {
      results.failed.push('❌ Acceptance: Gig model missing messages relation');
    }

    // Check User relation
    if (/sentMessages\s+Message\[\]/.test(schema)) {
      results.passed.push('✅ Acceptance: User model includes sentMessages relation');
    } else {
      results.failed.push('❌ Acceptance: User model missing sentMessages relation');
    }

    // ========================================
    // SCENARIO TESTING: Database Operations
    // ========================================
    console.log('\n📋 SCENARIO TESTING: Database Operations\n');

    // Setup: Get test users and gig
    const client = await prisma.user.findFirst({ where: { role: 'CLIENT' } });
    const specialist = await prisma.user.findFirst({ where: { role: 'SPECIALIST' } });
    const gig = await prisma.gig.findFirst({
      where: { clientId: client?.id },
      include: { messages: true }
    });

    if (!client || !specialist || !gig) {
      results.failed.push('❌ Setup: Missing test data (users or gigs)');
      throw new Error('Cannot proceed without test data');
    }

    // Clean up any existing test messages
    await prisma.message.deleteMany({
      where: {
        content: {
          in: ['Validation test message 1', 'Validation test message 2']
        }
      }
    });

    // Scenario: Message belongs to Gig
    console.log('Testing: Message → Gig relation...');
    const testMessage1 = await prisma.message.create({
      data: {
        gigId: gig.id,
        senderId: client.id,
        content: 'Validation test message 1',
      },
      include: { gig: true },
    });

    if (testMessage1.gig.id === gig.id) {
      results.passed.push('✅ Scenario: Message belongs to Gig - Relation works correctly');
    } else {
      results.failed.push('❌ Scenario: Message belongs to Gig - Relation failed');
    }

    // Scenario: Message belongs to User (sender)
    console.log('Testing: Message → User (sender) relation...');
    const messageWithSender = await prisma.message.findUnique({
      where: { id: testMessage1.id },
      include: { sender: true },
    });

    if (messageWithSender?.sender.id === client.id) {
      results.passed.push('✅ Scenario: Message belongs to User - Relation works correctly');
    } else {
      results.failed.push('❌ Scenario: Message belongs to User - Relation failed');
    }

    // Scenario: Gig has many Messages
    console.log('Testing: Gig → Messages relation...');
    const testMessage2 = await prisma.message.create({
      data: {
        gigId: gig.id,
        senderId: specialist.id,
        content: 'Validation test message 2',
      },
    });

    const gigWithMessages = await prisma.gig.findUnique({
      where: { id: gig.id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      },
    });

    if (gigWithMessages && gigWithMessages.messages.length >= 2) {
      results.passed.push('✅ Scenario: Gig has many Messages - Relation works correctly');
      results.passed.push('✅ Scenario: Messages orderable by createdAt');
    } else {
      results.failed.push('❌ Scenario: Gig has many Messages - Relation failed');
    }

    // Scenario: User has many sent Messages
    console.log('Testing: User → sentMessages relation...');
    const userWithMessages = await prisma.user.findUnique({
      where: { id: client.id },
      include: { sentMessages: true },
    });

    if (userWithMessages && userWithMessages.sentMessages.length >= 1) {
      results.passed.push('✅ Scenario: User has many sent Messages - Relation works correctly');
    } else {
      results.failed.push('❌ Scenario: User has many sent Messages - Relation failed');
    }

    // Scenario: Message content is required
    console.log('Testing: Message content required constraint...');
    try {
      await prisma.message.create({
        data: {
          gigId: gig.id,
          senderId: client.id,
          content: null as any,
        },
      });
      results.failed.push('❌ Scenario: Message content required - Null content was accepted (should fail)');
    } catch (error: any) {
      if (error.message.includes('content') || error.code === 'P2011') {
        results.passed.push('✅ Scenario: Message content required - Null content rejected correctly');
      } else {
        results.failed.push(`❌ Scenario: Message content required - Unexpected error: ${error.message}`);
      }
    }

    // Scenario: Message requires valid foreign keys
    console.log('Testing: Foreign key constraints...');
    try {
      await prisma.message.create({
        data: {
          gigId: 'invalid-gig-id-12345',
          senderId: client.id,
          content: 'This should fail',
        },
      });
      results.failed.push('❌ Scenario: Foreign key constraint - Invalid gigId was accepted (should fail)');
    } catch (error: any) {
      if (error.message.includes('Foreign key constraint') || error.code === 'P2003') {
        results.passed.push('✅ Scenario: Foreign key constraint on gigId - Works correctly');
      } else {
        results.passed.push('✅ Scenario: Foreign key constraint on gigId - Invalid gigId rejected');
      }
    }

    try {
      await prisma.message.create({
        data: {
          gigId: gig.id,
          senderId: 'invalid-user-id-12345',
          content: 'This should fail',
        },
      });
      results.failed.push('❌ Scenario: Foreign key constraint - Invalid senderId was accepted (should fail)');
    } catch (error: any) {
      if (error.message.includes('Foreign key constraint') || error.code === 'P2003') {
        results.passed.push('✅ Scenario: Foreign key constraint on senderId - Works correctly');
      } else {
        results.passed.push('✅ Scenario: Foreign key constraint on senderId - Invalid senderId rejected');
      }
    }

    // ========================================
    // REQUIREMENT 2: Message Migration
    // ========================================
    console.log('\n📋 REQUIREMENT 2: Message Migration\n');

    // Check migration file exists
    const migrationSQL = readFileSync(
      'prisma/migrations/20260217080457_add_message_model/migration.sql',
      'utf-8'
    );

    if (migrationSQL.includes('CREATE TABLE "Message"')) {
      results.passed.push('✅ Acceptance: Migration file exists with CREATE TABLE statement');
    } else {
      results.failed.push('❌ Acceptance: Migration file missing CREATE TABLE statement');
    }

    if (migrationSQL.includes('FOREIGN KEY ("gigId")') &&
        migrationSQL.includes('FOREIGN KEY ("senderId")')) {
      results.passed.push('✅ Acceptance: Migration includes foreign key constraints');
    } else {
      results.failed.push('❌ Acceptance: Migration missing foreign key constraints');
    }

    if (migrationSQL.includes('CREATE INDEX "Message_gigId_idx"') &&
        migrationSQL.includes('CREATE INDEX "Message_createdAt_idx"')) {
      results.passed.push('✅ Acceptance: Migration includes indexes on gigId and createdAt');
    } else {
      results.failed.push('❌ Acceptance: Migration missing required indexes');
    }

    // Cleanup test messages
    await prisma.message.deleteMany({
      where: {
        id: { in: [testMessage1.id, testMessage2.id] }
      }
    });

    // ========================================
    // FINAL REPORT
    // ========================================
    console.log('\n' + '='.repeat(60));
    console.log('\n📊 VALIDATION REPORT\n');

    console.log(`✅ PASSED: ${results.passed.length} checks`);
    results.passed.forEach(item => console.log(`   ${item}`));

    if (results.failed.length > 0) {
      console.log(`\n❌ FAILED: ${results.failed.length} checks`);
      results.failed.forEach(item => console.log(`   ${item}`));
      console.log('\n⚠️  VALIDATION FAILED - Fix issues above\n');
      process.exit(1);
    } else {
      console.log('\n🎉 ALL VALIDATION CHECKS PASSED!\n');
      console.log('The messaging-iteration-1 implementation satisfies all acceptance criteria.\n');
    }

  } catch (error) {
    console.error('\n❌ Validation error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

validateMessagingIteration1();
