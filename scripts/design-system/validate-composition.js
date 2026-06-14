#!/usr/bin/env node
/**
 * validate-composition.js — composition lint (Fidelity DoD F5).
 *
 * Enforces the screen-composition rule (DESIGN_SYSTEM_SPEC §4.3):
 *   a screen = Template + slotted Blocks + data bindings — composition only,
 *   NO styling, NO layout literals, NO raw markup.
 *
 * Scope: OPT-IN. A file is a "composed screen" only if it contains the marker
 *   /* @composed-screen *\/   (or // @composed-screen)
 * so existing pre-redesign pages are not flagged. Phase 2 composed screens carry
 * the marker; a later change widens the scope to all route page.tsx after
 * compose-shell-cutover.
 *
 * A composed screen FAILS if it:
 *   - imports from outside the allowlist (templates / blocks / layout / primitives /
 *     react / next / lib / actions / data / hooks), or
 *   - contains a `style=` attribute, or
 *   - contains a `className=` attribute (layout/styling belongs to primitives, not the screen).
 *
 * Usage: node scripts/design-system/validate-composition.js
 * Exit 0 = pass; 1 = violation(s).
 */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const SCAN_DIRS = ['app', 'components'];
const MARKER = '@composed-screen';

const ALLOWED_IMPORT_PREFIXES = [
  '@/app/components/templates',
  '@/app/components/blocks',
  '@/app/components/layout',
  '@/app/components/primitives',
  '@/lib',
  '@/app/actions',
  '@/app/data',
  '@/app/hooks',
  'react',
  'next',
];

function walk(dir, out = []) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.next') continue;
      walk(full, out);
    } else if (e.name.endsWith('.tsx')) {
      out.push(full);
    }
  }
  return out;
}

function importSources(text) {
  const sources = [];
  const re = /(?:import|export)\s[^;]*?from\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(text)) !== null) sources.push(m[1]);
  // bare side-effect imports: import 'x'
  const re2 = /import\s*['"]([^'"]+)['"]/g;
  while ((m = re2.exec(text)) !== null) sources.push(m[1]);
  return sources;
}

function isAllowedImport(src) {
  // relative imports are allowed only if they reach a kit dir
  if (src.startsWith('.')) {
    return /(templates|blocks|layout|primitives)\//.test(src);
  }
  return ALLOWED_IMPORT_PREFIXES.some((p) => src === p || src.startsWith(p + '/') || src.startsWith(p));
}

const files = SCAN_DIRS.flatMap((d) => walk(path.join(root, d)));
const violations = [];

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  if (!text.includes(MARKER)) continue; // not a composed screen — skip
  const rel = path.relative(root, file).replace(/\\/g, '/');

  for (const src of importSources(text)) {
    if (!isAllowedImport(src)) {
      violations.push({ rel, reason: `disallowed import "${src}" (composed screens import only templates/blocks/primitives/layout/data)` });
    }
  }
  if (/\bstyle\s*=/.test(text)) {
    violations.push({ rel, reason: 'inline `style=` attribute (no styling in screens — use tokens via blocks/primitives)' });
  }
  if (/\bclassName\s*=/.test(text)) {
    violations.push({ rel, reason: '`className=` attribute (no layout literals/raw markup in screens — arrange via layout primitives)' });
  }
}

const scanned = files.filter((f) => fs.readFileSync(f, 'utf8').includes(MARKER)).length;

if (violations.length === 0) {
  console.log(`✓ composition: PASS (${scanned} composed screen(s) checked; composition-only rule satisfied)`);
  process.exit(0);
}

console.error('✗ composition: FAIL — composed screens must be Template + slotted Blocks + data only:');
for (const v of violations) console.error(`   ${v.rel}: ${v.reason}`);
console.error('\nMove styling into tokens/blocks/primitives and arrange via layout primitives (DESIGN_SYSTEM_SPEC §4.3).');
process.exit(1);
