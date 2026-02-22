import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
});

const prisma = new PrismaClient({
  adapter: adapter as any,
});

async function cleanupDatabase() {
  console.log('🧹 Starting database cleanup...\n');

  try {
    // Delete in order respecting foreign key constraints
    console.log('Deleting Messages...');
    const messages = await prisma.message.deleteMany({});
    console.log(`✓ Deleted ${messages.count} messages`);

    console.log('Deleting ModerationLogs...');
    const logs = await prisma.moderationLog.deleteMany({});
    console.log(`✓ Deleted ${logs.count} moderation logs`);

    console.log('Deleting Applications...');
    const applications = await prisma.application.deleteMany({});
    console.log(`✓ Deleted ${applications.count} applications`);

    console.log('Deleting Gigs...');
    const gigs = await prisma.gig.deleteMany({});
    console.log(`✓ Deleted ${gigs.count} gigs`);

    console.log('Deleting ClientProfiles...');
    const clientProfiles = await prisma.clientProfile.deleteMany({});
    console.log(`✓ Deleted ${clientProfiles.count} client profiles`);

    console.log('Deleting SpecialistProfiles...');
    const specialistProfiles = await prisma.specialistProfile.deleteMany({});
    console.log(`✓ Deleted ${specialistProfiles.count} specialist profiles`);

    console.log('Deleting Users...');
    const users = await prisma.user.deleteMany({});
    console.log(`✓ Deleted ${users.count} users`);

    console.log('\n✅ Database cleanup complete!');
    console.log('Run "npm run seed" to populate with fresh foundation data.');
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

cleanupDatabase();
