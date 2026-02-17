import { prisma } from '../lib/prisma';

async function seedMessagesForManualTesting() {
  console.log('🌱 Seeding messages for manual testing...\n');

  try {
    // Find existing test users and gig
    const client = await prisma.user.findFirst({ where: { role: 'CLIENT' } });
    const specialist = await prisma.user.findFirst({ where: { role: 'SPECIALIST' } });

    if (!client || !specialist) {
      console.log('❌ No test users found. Run test-message-model.ts first.');
      process.exit(1);
    }

    // Find or create a gig with assigned specialist
    let gig = await prisma.gig.findFirst({
      where: {
        clientId: client.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: specialist.id,
      }
    });

    if (!gig) {
      gig = await prisma.gig.create({
        data: {
          title: 'Build React Dashboard',
          description: 'Need a modern dashboard with charts and analytics',
          budget: 15000000, // 150,000 roubles
          serviceFee: 3000000, // 30,000 roubles
          totalAmount: 18000000,
          status: 'IN_PROGRESS',
          tags: 'React, TypeScript, Charts',
          clientId: client.id,
          assignedSpecialistId: specialist.id,
        },
      });
      console.log('✅ Created test gig:', gig.title);
    } else {
      console.log('✅ Found existing test gig:', gig.title);
    }

    // Clear existing messages for this gig
    await prisma.message.deleteMany({ where: { gigId: gig.id } });
    console.log('🧹 Cleared existing messages\n');

    // Create a conversation
    console.log('💬 Creating test conversation...\n');

    await prisma.message.create({
      data: {
        gigId: gig.id,
        senderId: client.id,
        content: 'Hi! Thanks for accepting this project. When can you start?',
      },
    });
    console.log('   ✅ Client: "Hi! Thanks for accepting this project. When can you start?"');

    // Wait a bit to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 100));

    await prisma.message.create({
      data: {
        gigId: gig.id,
        senderId: specialist.id,
        content: 'Hello! I can start today. I have reviewed the requirements and they look clear.',
      },
    });
    console.log('   ✅ Specialist: "Hello! I can start today..."');

    await new Promise(resolve => setTimeout(resolve, 100));

    await prisma.message.create({
      data: {
        gigId: gig.id,
        senderId: client.id,
        content: 'Great! Do you need any additional information or access to our systems?',
      },
    });
    console.log('   ✅ Client: "Great! Do you need any additional information..."');

    await new Promise(resolve => setTimeout(resolve, 100));

    await prisma.message.create({
      data: {
        gigId: gig.id,
        senderId: specialist.id,
        content: 'Yes, I will need:\n1. Access to the design files\n2. API documentation\n3. Staging environment credentials',
      },
    });
    console.log('   ✅ Specialist: "Yes, I will need..."');

    await new Promise(resolve => setTimeout(resolve, 100));

    await prisma.message.create({
      data: {
        gigId: gig.id,
        senderId: client.id,
        content: 'I will send all of that via email within the hour. Looking forward to seeing the progress!',
      },
    });
    console.log('   ✅ Client: "I will send all of that via email..."');

    console.log('\n✅ Successfully seeded 5 messages!\n');
    console.log('📋 Test Instructions:');
    console.log('   1. Start dev server: npm run dev');
    console.log('   2. Login as CLIENT:', client.email);
    console.log('   3. Navigate to gig detail page');
    console.log('   4. Verify messages are visible in chronological order');
    console.log('   5. Try sending a new message');
    console.log('   6. Login as SPECIALIST:', specialist.email);
    console.log('   7. Verify same messages are visible');
    console.log('   8. Try sending a reply\n');
    console.log(`🔗 Gig ID: ${gig.id}\n`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedMessagesForManualTesting();
