import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
});

const prisma = new PrismaClient({
  adapter: adapter as any,
});

async function main() {
  const exampleGigs = await prisma.gig.findMany({
    where: { isExample: true },
    select: {
      id: true,
      title: true,
      isExample: true,
      budget: true,
      goal: true,
      deliverables: true,
      constraints: true,
      acceptanceCriteria: true,
    },
  });

  console.log(`\n✓ Found ${exampleGigs.length} example gigs:\n`);

  exampleGigs.forEach((gig, index) => {
    console.log(`${index + 1}. ${gig.title}`);
    console.log(`   Budget: ${(gig.budget / 100).toLocaleString('ru-RU')} ₽`);
    console.log(`   Goal: ${gig.goal ? '✓' : '✗'}`);
    console.log(`   Deliverables: ${gig.deliverables ? '✓' : '✗'}`);
    console.log(`   Constraints: ${gig.constraints ? '✓' : '✗'}`);
    console.log(`   Acceptance Criteria: ${gig.acceptanceCriteria ? '✓' : '✗'}`);
    console.log('');
  });

  // Check seed user
  const seedUser = await prisma.user.findUnique({
    where: { email: 'example-client@gigly.ru' },
    select: { id: true, email: true, role: true },
  });

  if (seedUser) {
    console.log(`✓ Seed user exists: ${seedUser.email} (${seedUser.role})\n`);
  } else {
    console.log('✗ Seed user not found\n');
  }
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
