#!/usr/bin/env node
/**
 * validate-generativity.js — the generativity gate (the system-level acceptance scaffold).
 *
 * Asserts that a NOVEL screen (one with no mock) can be assembled purely from the kit with ZERO
 * off-system values. "Zero off-system values" = the kit-only generativity probe is a composed
 * screen (Template + slotted Blocks + data only) AND the composition + token-purity lints pass
 * (they scan the probe): no off-system import / className / style, no off-token literal.
 *
 * A planted off-token literal (or off-system className/import) in the probe makes a lint fail →
 * this gate fails. This is the scaffold `prove-extensibility-admin` (#29) extends to the admin proof.
 *
 * Usage: node scripts/design-system/validate-generativity.js   (exit 0 = pass, 1 = fail)
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..', '..');
const PROBE = path.join(root, 'app', 'workbench', 'screens', 'GenerativityProbe.tsx');

// The mock-less admin screens (prove-extensibility-admin, #29) — rebuilt purely from the kit. The gate now asserts
// these REAL novel screens (not just the probe) assemble with zero off-system values.
const ADMIN_SCREENS = [
  path.join(root, 'app', 'admin', 'AdminDashboard.tsx'),
  path.join(root, 'app', 'admin', 'users', 'AdminUsers.tsx'),
  path.join(root, 'app', 'admin', 'gigs', 'AdminGigs.tsx'),
];

function fail(msg) {
  console.error('✗ generativity: FAIL — ' + msg);
  process.exit(1);
}

// 1. Novel kit-only screens exist and are composed screens: the probe + the mock-less admin screens.
if (!fs.existsSync(PROBE)) fail('GenerativityProbe.tsx missing — no novel kit-only screen to assemble');
if (!fs.readFileSync(PROBE, 'utf8').includes('@composed-screen')) {
  fail('GenerativityProbe.tsx is not marked @composed-screen');
}
for (const screen of ADMIN_SCREENS) {
  const rel = path.relative(root, screen).replace(/\\/g, '/');
  if (!fs.existsSync(screen)) fail(`admin screen missing — ${rel} (the admin proof must be composed from the kit)`);
  if (!fs.readFileSync(screen, 'utf8').includes('@composed-screen')) {
    fail(`${rel} is not marked @composed-screen — the admin proof must be a kit-only composed screen`);
  }
}

// 2. Zero off-system values = composition + token-purity lints pass (they scan the probe).
function runLint(script, label) {
  try {
    execFileSync('node', [path.join(__dirname, script)], { stdio: 'inherit' });
  } catch {
    fail(`${label} failed — the generativity probe contains an off-system value`);
  }
}
runLint('validate-composition.js', 'composition lint');
runLint('validate-token-purity.js', 'token-purity lint');

console.log(
  '✓ generativity: PASS (the probe + the mock-less admin screens assemble from the kit with zero off-system values)',
);
process.exit(0);
