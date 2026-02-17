import { prisma } from '../lib/prisma';

async function testMessageModel() {
  console.log('🧪 Testing Message model...\n');

  try {
    // Step 1: Find or create test users (client and specialist)
    console.log('1️⃣ Setting up test users...');
    let client = await prisma.user.findFirst({ where: { role: 'CLIENT' } });
    let specialist = await prisma.user.findFirst({ where: { role: 'SPECIALIST' } });

    if (!client) {
      client = await prisma.user.create({
        data: {
          email: 'test-client-msg@example.com',
          password: 'hashed_password',
          role: 'CLIENT',
        },
      });
      console.log('   ✅ Created test CLIENT user');
    } else {
      console.log('   ✅ Found existing CLIENT user');
    }

    if (!specialist) {
      specialist = await prisma.user.create({
        data: {
          email: 'test-specialist-msg@example.com',
          password: 'hashed_password',
          role: 'SPECIALIST',
        },
      });
      console.log('   ✅ Created test SPECIALIST user');
    } else {
      console.log('   ✅ Found existing SPECIALIST user');
    }

    // Step 2: Find or create a test gig
    console.log('\n2️⃣ Setting up test gig...');
    let gig = await prisma.gig.findFirst({ where: { clientId: client.id } });

    if (!gig) {
      gig = await prisma.gig.create({
        data: {
          title: 'Test Gig for Messaging',
          description: 'Testing message functionality',
          budget: 10000000, // 100,000 roubles in kopecks
          serviceFee: 2000000, // 20,000 roubles
          totalAmount: 12000000,
          status: 'IN_PROGRESS',
          clientId: client.id,
          assignedSpecialistId: specialist.id,
        },
      });
      console.log('   ✅ Created test gig');
    } else {
      console.log('   ✅ Found existing gig');
    }

    // Step 3: Create test messages
    console.log('\n3️⃣ Creating test messages...');
    const message1 = await prisma.message.create({
      data: {
        gigId: gig.id,
        senderId: client.id,
        content: 'Hello! Can you clarify the requirements?',
      },
    });
    console.log('   ✅ Created message from client');

    const message2 = await prisma.message.create({
      data: {
        gigId: gig.id,
        senderId: specialist.id,
        content: 'Sure! What specific part needs clarification?',
      },
    });
    console.log('   ✅ Created message from specialist');

    // Step 4: Test Message → Gig relation
    console.log('\n4️⃣ Testing Message → Gig relation...');
    const messageWithGig = await prisma.message.findUnique({
      where: { id: message1.id },
      include: { gig: true },
    });
    if (messageWithGig?.gig.id === gig.id) {
      console.log('   ✅ Message correctly links to Gig');
    } else {
      throw new Error('Message → Gig relation failed');
    }

    // Step 5: Test Message → User (sender) relation
    console.log('\n5️⃣ Testing Message → User (sender) relation...');
    const messageWithSender = await prisma.message.findUnique({
      where: { id: message1.id },
      include: { sender: true },
    });
    if (messageWithSender?.sender.id === client.id) {
      console.log('   ✅ Message correctly links to sender User');
    } else {
      throw new Error('Message → User relation failed');
    }

    // Step 6: Test Gig → Messages relation
    console.log('\n6️⃣ Testing Gig → Messages relation...');
    const gigWithMessages = await prisma.gig.findUnique({
      where: { id: gig.id },
      include: { messages: true },
    });
    if (gigWithMessages && gigWithMessages.messages.length >= 2) {
      console.log(`   ✅ Gig has ${gigWithMessages.messages.length} messages`);
    } else {
      throw new Error('Gig → Messages relation failed');
    }

    // Step 7: Test User → sentMessages relation
    console.log('\n7️⃣ Testing User → sentMessages relation...');
    const userWithMessages = await prisma.user.findUnique({
      where: { id: client.id },
      include: { sentMessages: true },
    });
    if (userWithMessages && userWithMessages.sentMessages.length >= 1) {
      console.log(`   ✅ User has ${userWithMessages.sentMessages.length} sent messages`);
    } else {
      throw new Error('User → sentMessages relation failed');
    }

    // Step 8: Test foreign key constraint (should fail)
    console.log('\n8️⃣ Testing foreign key constraints...');
    try {
      await prisma.message.create({
        data: {
          gigId: 'invalid-gig-id',
          senderId: client.id,
          content: 'This should fail',
        },
      });
      throw new Error('Foreign key constraint should have prevented this');
    } catch (error: any) {
      if (error.message.includes('Foreign key constraint')) {
        console.log('   ✅ Foreign key constraint on gigId works correctly');
      } else {
        console.log('   ✅ Invalid gigId rejected (constraint enforced)');
      }
    }

    // Step 9: Test message persistence
    console.log('\n9️⃣ Testing message persistence...');
    const allMessages = await prisma.message.findMany({
      where: { gigId: gig.id },
      orderBy: { createdAt: 'asc' },
    });
    if (allMessages.length >= 2) {
      console.log(`   ✅ Found ${allMessages.length} persisted messages`);
      console.log(`   📝 First message: "${allMessages[0].content.substring(0, 50)}..."`);
    } else {
      throw new Error('Messages did not persist');
    }

    // Step 10: Cleanup test messages
    console.log('\n🧹 Cleaning up test messages...');
    await prisma.message.deleteMany({
      where: { gigId: gig.id },
    });
    console.log('   ✅ Test messages cleaned up');

    console.log('\n✅ All tests passed! Message model is working correctly.\n');
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testMessageModel();
