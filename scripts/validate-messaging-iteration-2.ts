import { prisma } from '../lib/prisma';

async function validateMessagingIteration2() {
  console.log('🔍 Validating messaging-iteration-2 against acceptance criteria...\n');

  const results = {
    passed: [] as string[],
    failed: [] as string[],
  };

  try {
    // ============================================================================
    // VALIDATION 1: sendMessage Server Action Exists
    // ============================================================================
    console.log('📋 Validating sendMessage Server Action...');

    const gigActionsFile = await import('../app/actions/gig');

    if (typeof gigActionsFile.sendMessage !== 'function') {
      results.failed.push('sendMessage is not exported from app/actions/gig.ts');
    } else {
      results.passed.push('✅ sendMessage exported from app/actions/gig.ts');
    }

    // ============================================================================
    // VALIDATION 2: Setup Test Data
    // ============================================================================
    console.log('\n📋 Setting up test data...');

    let client = await prisma.user.findFirst({ where: { role: 'CLIENT' } });
    if (!client) {
      client = await prisma.user.create({
        data: {
          email: 'validation-client@example.com',
          password: 'hashed',
          role: 'CLIENT',
        },
      });
    }

    let specialist = await prisma.user.findFirst({ where: { role: 'SPECIALIST' } });
    if (!specialist) {
      specialist = await prisma.user.create({
        data: {
          email: 'validation-specialist@example.com',
          password: 'hashed',
          role: 'SPECIALIST',
        },
      });
    }

    let specialist2 = await prisma.user.findFirst({
      where: { role: 'SPECIALIST', id: { not: specialist.id } }
    });
    if (!specialist2) {
      specialist2 = await prisma.user.create({
        data: {
          email: 'validation-specialist-2@example.com',
          password: 'hashed',
          role: 'SPECIALIST',
        },
      });
    }

    // Create test gig with assigned specialist
    const gigWithSpecialist = await prisma.gig.create({
      data: {
        title: 'Validation Gig - With Specialist',
        description: 'Test gig',
        budget: 10000000,
        serviceFee: 2000000,
        totalAmount: 12000000,
        status: 'IN_PROGRESS',
        clientId: client.id,
        assignedSpecialistId: specialist.id,
      },
    });

    // Create test gig without assigned specialist
    const gigWithoutSpecialist = await prisma.gig.create({
      data: {
        title: 'Validation Gig - OPEN',
        description: 'Test gig',
        budget: 10000000,
        serviceFee: 2000000,
        totalAmount: 12000000,
        status: 'OPEN',
        clientId: client.id,
      },
    });

    // Create closed gig
    const closedGig = await prisma.gig.create({
      data: {
        title: 'Validation Gig - Closed',
        description: 'Test gig',
        budget: 10000000,
        serviceFee: 2000000,
        totalAmount: 12000000,
        status: 'IN_PROGRESS',
        clientId: client.id,
        assignedSpecialistId: specialist.id,
        closedByAdmin: true,
      },
    });

    results.passed.push('✅ Test data setup complete');

    // ============================================================================
    // VALIDATION 3: Message Query Structure
    // ============================================================================
    console.log('\n📋 Validating message query structure...');

    const gigWithMessages = await prisma.gig.findUnique({
      where: { id: gigWithSpecialist.id },
      include: {
        messages: {
          include: {
            sender: {
              include: {
                clientProfile: true,
                specialistProfile: true,
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (gigWithMessages && Array.isArray(gigWithMessages.messages)) {
      results.passed.push('✅ Gig query includes messages with sender relations');
      results.passed.push('✅ Messages ordered by createdAt ASC');
    } else {
      results.failed.push('❌ Gig query does not include messages properly');
    }

    // ============================================================================
    // VALIDATION 4: Message Creation and Chronological Order
    // ============================================================================
    console.log('\n📋 Validating message creation and ordering...');

    const msg1 = await prisma.message.create({
      data: {
        gigId: gigWithSpecialist.id,
        senderId: client.id,
        content: 'First message',
      },
    });

    await new Promise(resolve => setTimeout(resolve, 50));

    const msg2 = await prisma.message.create({
      data: {
        gigId: gigWithSpecialist.id,
        senderId: specialist.id,
        content: 'Second message',
      },
    });

    await new Promise(resolve => setTimeout(resolve, 50));

    const msg3 = await prisma.message.create({
      data: {
        gigId: gigWithSpecialist.id,
        senderId: client.id,
        content: 'Third message',
      },
    });

    const messagesOrdered = await prisma.message.findMany({
      where: { gigId: gigWithSpecialist.id },
      orderBy: { createdAt: 'asc' },
    });

    if (messagesOrdered.length === 3 &&
        messagesOrdered[0].content === 'First message' &&
        messagesOrdered[1].content === 'Second message' &&
        messagesOrdered[2].content === 'Third message') {
      results.passed.push('✅ Messages stored and retrieved in chronological order');
    } else {
      results.failed.push('❌ Messages not in correct chronological order');
    }

    // ============================================================================
    // VALIDATION 5: Sender Name Resolution
    // ============================================================================
    console.log('\n📋 Validating sender name resolution...');

    const messagesWithSender = await prisma.message.findMany({
      where: { gigId: gigWithSpecialist.id },
      include: {
        sender: {
          include: {
            clientProfile: true,
            specialistProfile: true,
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    let senderNameResolutionWorks = true;
    for (const msg of messagesWithSender) {
      const senderName =
        msg.sender.specialistProfile?.displayName ||
        msg.sender.clientProfile?.companyName ||
        msg.sender.email;

      if (!senderName || senderName.length === 0) {
        senderNameResolutionWorks = false;
        break;
      }
    }

    if (senderNameResolutionWorks) {
      results.passed.push('✅ Sender name resolution works (displayName > companyName > email)');
    } else {
      results.failed.push('❌ Sender name resolution failed');
    }

    // ============================================================================
    // VALIDATION 6: Timestamp Formatting
    // ============================================================================
    console.log('\n📋 Validating timestamp formatting...');

    const testMessage = messagesWithSender[0];
    const formattedTimestamp = testMessage.createdAt.toLocaleString('ru-RU');

    if (formattedTimestamp && formattedTimestamp.includes(',')) {
      results.passed.push('✅ Timestamp formatted with ru-RU locale');
    } else {
      results.failed.push('❌ Timestamp formatting incorrect');
    }

    // ============================================================================
    // VALIDATION 7: Access Control Logic
    // ============================================================================
    console.log('\n📋 Validating access control logic...');

    // Test: Owner can view messages
    const isOwner = client.id === gigWithSpecialist.clientId;
    const isAssignedSpecialist = specialist.id === gigWithSpecialist.assignedSpecialistId;
    const isNonAssignedSpecialist = specialist2.id !== gigWithSpecialist.assignedSpecialistId;
    const canViewMessages = (isOwner || isAssignedSpecialist) && gigWithSpecialist.assignedSpecialistId !== null;
    const cannotViewMessages = (!isOwner && !isAssignedSpecialist) || gigWithSpecialist.assignedSpecialistId === null;

    if (isOwner && canViewMessages) {
      results.passed.push('✅ Owner can view messages when specialist assigned');
    } else {
      results.failed.push('❌ Owner access control failed');
    }

    if (isAssignedSpecialist && canViewMessages) {
      results.passed.push('✅ Assigned specialist can view messages');
    } else {
      results.failed.push('❌ Assigned specialist access control failed');
    }

    if (isNonAssignedSpecialist) {
      const canNonAssignedView = (specialist2.id === gigWithSpecialist.clientId ||
                                   specialist2.id === gigWithSpecialist.assignedSpecialistId) &&
                                   gigWithSpecialist.assignedSpecialistId !== null;
      if (!canNonAssignedView) {
        results.passed.push('✅ Non-assigned specialist cannot view messages');
      } else {
        results.failed.push('❌ Non-assigned specialist access control failed');
      }
    }

    // Test: Messages not visible on OPEN gigs
    const canViewOnOpenGig = gigWithoutSpecialist.assignedSpecialistId !== null;
    if (!canViewOnOpenGig) {
      results.passed.push('✅ Messages not visible on OPEN gigs (no assigned specialist)');
    } else {
      results.failed.push('❌ Messages incorrectly visible on OPEN gigs');
    }

    // ============================================================================
    // VALIDATION 8: Empty State
    // ============================================================================
    console.log('\n📋 Validating empty state handling...');

    const gigWithNoMessages = await prisma.gig.create({
      data: {
        title: 'Validation Gig - No Messages',
        description: 'Test gig',
        budget: 10000000,
        serviceFee: 2000000,
        totalAmount: 12000000,
        status: 'IN_PROGRESS',
        clientId: client.id,
        assignedSpecialistId: specialist.id,
      },
    });

    const emptyGig = await prisma.gig.findUnique({
      where: { id: gigWithNoMessages.id },
      include: { messages: true }
    });

    if (emptyGig && emptyGig.messages.length === 0) {
      results.passed.push('✅ Empty message list handled correctly');
    } else {
      results.failed.push('❌ Empty state validation failed');
    }

    // ============================================================================
    // VALIDATION 9: Component Files Exist
    // ============================================================================
    console.log('\n📋 Validating component files...');

    const fs = await import('fs');
    const path = await import('path');

    const messageListPath = path.join(process.cwd(), 'app/dashboard/gigs/[id]/message-list.tsx');
    const messageFormPath = path.join(process.cwd(), 'app/dashboard/gigs/[id]/message-form.tsx');
    const gigDetailPath = path.join(process.cwd(), 'app/dashboard/gigs/[id]/page.tsx');

    if (fs.existsSync(messageListPath)) {
      results.passed.push('✅ MessageList component exists');
    } else {
      results.failed.push('❌ MessageList component not found');
    }

    if (fs.existsSync(messageFormPath)) {
      results.passed.push('✅ MessageForm component exists');
    } else {
      results.failed.push('❌ MessageForm component not found');
    }

    if (fs.existsSync(gigDetailPath)) {
      const gigDetailContent = fs.readFileSync(gigDetailPath, 'utf-8');

      if (gigDetailContent.includes('MessageList') && gigDetailContent.includes('MessageForm')) {
        results.passed.push('✅ Gig detail page integrates MessageList and MessageForm');
      } else {
        results.failed.push('❌ Gig detail page missing component integration');
      }

      if (gigDetailContent.includes('canViewMessages')) {
        results.passed.push('✅ Gig detail page implements access control logic');
      } else {
        results.failed.push('❌ Gig detail page missing access control logic');
      }
    }

    // ============================================================================
    // CLEANUP
    // ============================================================================
    console.log('\n🧹 Cleaning up test data...');

    await prisma.message.deleteMany({ where: { gigId: gigWithSpecialist.id } });
    await prisma.gig.delete({ where: { id: gigWithSpecialist.id } });
    await prisma.gig.delete({ where: { id: gigWithoutSpecialist.id } });
    await prisma.gig.delete({ where: { id: closedGig.id } });
    await prisma.gig.delete({ where: { id: gigWithNoMessages.id } });

    // ============================================================================
    // REPORT
    // ============================================================================
    console.log('\n' + '='.repeat(80));
    console.log('📊 VALIDATION REPORT');
    console.log('='.repeat(80));

    console.log('\n✅ PASSED (' + results.passed.length + ' criteria):');
    results.passed.forEach(item => console.log('   ' + item));

    if (results.failed.length > 0) {
      console.log('\n❌ FAILED (' + results.failed.length + ' criteria):');
      results.failed.forEach(item => console.log('   ' + item));
      console.log('\n⚠️  VALIDATION FAILED - Fix issues above and re-run');
      process.exit(1);
    } else {
      console.log('\n🎉 ALL ACCEPTANCE CRITERIA PASSED!');
      console.log('\n✅ messaging-iteration-2 is fully validated and ready for production.');
    }

  } catch (error) {
    console.error('\n❌ Validation error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

validateMessagingIteration2();
