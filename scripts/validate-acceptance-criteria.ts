import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
});

const prisma = new PrismaClient({
  adapter: adapter as any,
});

interface ValidationResult {
  requirement: string;
  scenario: string;
  status: 'PASS' | 'FAIL';
  details?: string;
}

const results: ValidationResult[] = [];

function logResult(requirement: string, scenario: string, status: 'PASS' | 'FAIL', details?: string) {
  results.push({ requirement, scenario, status, details });
  const icon = status === 'PASS' ? '✓' : '✗';
  console.log(`${icon} ${scenario}`);
  if (details) console.log(`  ${details}`);
}

async function validateDatabase() {
  console.log('\n📦 DATABASE SPECIFICATION VALIDATION');
  console.log('═'.repeat(70));

  console.log('\n🔹 Requirement: Gig Model Example Flag\n');

  try {
    const gig = await prisma.gig.findFirst();
    if (gig && 'isExample' in gig) {
      logResult('Gig Model', 'isExample field exists', 'PASS');
    } else {
      logResult('Gig Model', 'isExample field exists', 'FAIL', 'Field not found');
    }
  } catch (error) {
    logResult('Gig Model', 'isExample field exists', 'FAIL', String(error));
  }

  try {
    const exampleGigs = await prisma.gig.findMany({ where: { isExample: true } });
    if (exampleGigs.length === 5) {
      logResult('Gig Model', 'Example gigs marked correctly', 'PASS', '5 example gigs found');
    } else {
      logResult('Gig Model', 'Example gigs marked correctly', 'FAIL', `Expected 5, found ${exampleGigs.length}`);
    }
  } catch (error) {
    logResult('Gig Model', 'Example gigs marked correctly', 'FAIL', String(error));
  }

  console.log('\n🔹 Requirement: Example Gig Seed Data\n');

  try {
    const exampleGigs = await prisma.gig.findMany({
      where: { isExample: true },
      include: { client: true },
    });

    let allValid = true;
    for (const gig of exampleGigs) {
      if (gig.status !== 'OPEN') allValid = false;
      if (!gig.acceptanceCriteria || gig.acceptanceCriteria.length < 200) allValid = false;
      if (!gig.goal || !gig.deliverables || !gig.constraints) allValid = false;
      const budgetRub = gig.budget / 100;
      if (budgetRub < 150000 || budgetRub > 200000) allValid = false;
    }

    if (allValid) {
      logResult('Seed Data', 'All example gigs meet quality standards', 'PASS');
    } else {
      logResult('Seed Data', 'All example gigs meet quality standards', 'FAIL');
    }
  } catch (error) {
    logResult('Seed Data', 'All example gigs meet quality standards', 'FAIL', String(error));
  }
}

async function validateServerAction() {
  console.log('\n\n🛡️ SERVER ACTION VALIDATION');
  console.log('═'.repeat(70));

  const fs = require('fs');
  const path = require('path');

  try {
    const actionPath = path.join(process.cwd(), 'app', 'actions', 'gig.ts');
    const actionCode = fs.readFileSync(actionPath, 'utf-8');

    if (actionCode.includes('gig.isExample')) {
      logResult('Server Action', 'applyToGig checks isExample', 'PASS');
    } else {
      logResult('Server Action', 'applyToGig checks isExample', 'FAIL');
    }

    if (actionCode.includes('demonstration purposes')) {
      logResult('Server Action', 'Error message correct', 'PASS');
    } else {
      logResult('Server Action', 'Error message correct', 'FAIL');
    }
  } catch (error) {
    logResult('Server Action', 'Code validation', 'FAIL', String(error));
  }
}

async function validateUI() {
  console.log('\n\n🎨 UI VALIDATION');
  console.log('═'.repeat(70));

  const fs = require('fs');
  const path = require('path');

  try {
    const browsePath = path.join(process.cwd(), 'app', 'dashboard', 'gigs', 'page.tsx');
    const browseCode = fs.readFileSync(browsePath, 'utf-8');

    if (browseCode.includes('gig.isExample') && browseCode.includes('Example')) {
      logResult('Browse Page', 'Example badge renders', 'PASS');
    } else {
      logResult('Browse Page', 'Example badge renders', 'FAIL');
    }

    if (browseCode.includes('bg-indigo-100')) {
      logResult('Browse Page', 'Badge styling correct', 'PASS');
    } else {
      logResult('Browse Page', 'Badge styling correct', 'FAIL');
    }
  } catch (error) {
    logResult('Browse Page', 'Validation', 'FAIL', String(error));
  }

  try {
    const detailPath = path.join(process.cwd(), 'app', 'dashboard', 'gigs', '[id]', 'page.tsx');
    const detailCode = fs.readFileSync(detailPath, 'utf-8');

    if (detailCode.includes('Example Gig')) {
      logResult('Detail Page', 'Example banner renders', 'PASS');
    } else {
      logResult('Detail Page', 'Example banner renders', 'FAIL');
    }

    // Accept both !gig.isExample and gig.isExample ? patterns
    if (detailCode.includes('!gig.isExample') || detailCode.includes('gig.isExample ?')) {
      logResult('Detail Page', 'Apply form conditionally hidden', 'PASS');
    } else {
      logResult('Detail Page', 'Apply form conditionally hidden', 'FAIL');
    }
  } catch (error) {
    logResult('Detail Page', 'Validation', 'FAIL', String(error));
  }
}

async function main() {
  console.log('\n🧪 ACCEPTANCE CRITERIA VALIDATION');
  console.log('═'.repeat(70));

  await validateDatabase();
  await validateServerAction();
  await validateUI();

  console.log('\n\n' + '═'.repeat(70));
  console.log('📊 SUMMARY');
  console.log('═'.repeat(70));

  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;

  console.log(`\nPassed: ${passed}`);
  console.log(`Failed: ${failed}`);

  if (failed > 0) {
    console.log('\n❌ VALIDATION FAILED\n');
    return 1;
  } else {
    console.log('\n✅ ALL CRITERIA MET\n');
    return 0;
  }
}

main()
  .then((exitCode) => process.exit(exitCode))
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
