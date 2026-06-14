#!/usr/bin/env node
/**
 * validate-derive-acceptance.js — throwaway scenario→check validator for the
 * `derive-design-system` change. Mirrors the predecessor's validate-acceptance.js.
 *
 * Maps each spec requirement (R1..R7) to deterministic checks against the SSOT
 * (docs/DESIGN_SYSTEM_SPEC.md) + the raw substrate (docs/DESIGN_SPECS.md) + the
 * library SVGs. Documentation-only change: also asserts scope guards.
 *
 * Usage:  node scripts/design-system/validate-derive-acceptance.js
 * Exit 0 = all checks PASS; exit 1 = one or more FAIL.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const read = (p) => {
  try { return fs.readFileSync(path.join(root, p), 'utf8'); } catch { return null; }
};

const SPEC = read('docs/DESIGN_SYSTEM_SPEC.md') || '';
const TOKENS_SVG = read('screens/tokens.svg') || '';
const FRAMES_SVG = read('screens/frames.svg') || '';
const SVGS = TOKENS_SVG + '\n' + FRAMES_SVG;

const has = (hay, needle) => hay.toLowerCase().includes(String(needle).toLowerCase());
const hasAll = (hay, arr) => arr.every((n) => has(hay, n));
const missing = (hay, arr) => arr.filter((n) => !has(hay, n));

let pass = 0, fail = 0;
const check = (label, ok, detail) => {
  if (ok) { pass++; console.log(`PASS  ${label}`); }
  else { fail++; console.log(`FAIL  ${label}${detail ? `  — ${detail}` : ''}`); }
};

// R6: SSOT exists + self-describing + provenance
check('R6 SSOT exists', SPEC.length > 0);
check('R6 declares SSOT', /single source of truth|SSOT/i.test(SPEC));
check('R6 references raw substrate', SPEC.includes('DESIGN_SPECS.md'));

// R1: Canonical scales — every sampled canonical colour traces to a real SVG fill
const sampleHex = ['#0088ff', '#f59e0b', '#f45fb1', '#10121c', '#10b981'];
sampleHex.forEach((hex) =>
  check(`R1 ${hex} traces to SVG`, has(SPEC, hex) && has(SVGS, hex)));
// near-duplicates addressed
['#0cc671', '#ff383c', '#4cacff', '#1379f3', '#9fa0a4', '#1a1d2a'].forEach((hex) =>
  check(`R1 near-dup ${hex} addressed`, has(SPEC, hex)));
// radius + spacing scales
check('R1 radius scale present', /radius|pill|circular/i.test(SPEC));
['xs', 'sm', 'md', 'lg', 'xl', 'pill', 'circular'].forEach((s) =>
  check(`R1 radius step ${s}`, has(SPEC, `radius/${s}`)));
check('R1 spacing scale present', /space\/|base-4/i.test(SPEC));
['17', '21', '47'].forEach((v) => check(`R1 spacing one-off ${v}`, has(SPEC, v)));
check('R1 control-height size token', has(SPEC, 'size/control') && has(SPEC, '40'));

// R1/R5cale: type scale + flagged forward
check('R1 type scale present', /type scale|type\//i.test(SPEC));
check('R1 families named', has(SPEC, 'SF Compact') && has(SPEC, 'NKDy'));
check('R1 font metrics flagged forward', /licen|residual|typography-system/i.test(SPEC));

// R2: Taxonomy
['surface/', 'text/', 'border/', 'brand/', 'status/', 'category/', 'space/', 'radius/', 'type/']
  .forEach((ns) => check(`R2 namespace ${ns}`, has(SPEC, ns)));
check('R2 naming convention stated', /naming convention/i.test(SPEC));

// R3: Vocabulary — primitives + blocks
const primitives = ['Button', 'Input', 'PasswordInput', 'Select', 'Filter', 'Tabs', 'Toggle',
  'Radio', 'Tag', 'CategoryTag', 'StatusBadge', 'Avatar', 'Rating', 'ViewToggle', 'ProgressBar', 'SearchInput'];
check('R3 primitives present', hasAll(SPEC, primitives), `missing: ${missing(SPEC, primitives)}`);
const blocks = ['GigCard', 'ProfileCard', 'MessageBubble', 'ConversationItem', 'NotificationItem',
  'SidebarNav', 'Topbar', 'FilterBar', 'BannerCard', 'StatPanel', 'RequirementCard', 'CriteriaList',
  'ClientCard', 'TermsTabs', 'ApplyPanel', 'ChatPanel', 'MessagesPanel'];
check('R3 blocks present', hasAll(SPEC, blocks), `missing: ${missing(SPEC, blocks)}`);
check('R3 matrices present', /variant|state|matrix/i.test(SPEC));

// R4: Layout grammar
const grammar = ['AppShell', 'AuthLayout', 'Stack', 'Grid', 'Split', 'Section', 'Panel', 'Rail'];
check('R4 grammar present', hasAll(SPEC, grammar), `missing: ${missing(SPEC, grammar)}`);
check('R4 shell states', has(SPEC, 'expanded') && has(SPEC, 'collapsed'));
check('R4 composition rule', /composition only|no raw markup|no styling/i.test(SPEC));

// R5: View-model contracts
check('R5 contracts present', /view-model|view model|VM/i.test(SPEC));
check('R5 GigCard fields', has(SPEC, 'deadlineDays') && has(SPEC, 'rating'));

// R7: Coverage + reconciliation
check('R7 coverage matrix present', /coverage/i.test(SPEC));
check('R7 reconciliation log present', /reconciliation/i.test(SPEC));
const screens = ['auth', 'reg', 'reg-customer', 'reg-specialist', 'customer-dashboard',
  'customer-projects', 'specialist-dashboard', 'specialist-gig-search', 'specialist-gig',
  'specialist-projects', 'specialist-chats', 'specialist-progile'];
check('R7 all 12 screens mapped', hasAll(SPEC, screens), `missing: ${missing(SPEC, screens)}`);
check('R7 generativity check', /generativity|no new (entity|token)/i.test(SPEC));
['0cc671', 'ff383c', '1379f3', '9fa0a4'].forEach((t) =>
  check(`R7 reconciliation entry ${t}`, has(SPEC, t)));
check('R7 decisions recorded', /normalize|variant|flag/i.test(SPEC));

// Scope guards (documentation-only)
check('SCOPE no token JSON', !fs.existsSync(path.join(root, 'openspec/specs/ui/design-tokens.json')));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
