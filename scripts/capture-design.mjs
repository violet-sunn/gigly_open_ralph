// Capture the gigly_full_design prototype's rendered screens as the canonical
// "transport source" for the design-transport initiative.
//
// Serves gigly_full_design/ over a local static server, drives the prototype's
// window.__giglyGo() state hook (and clicks, for interaction-only states) with
// Playwright chromium at 1512px, and writes a fully-resolved HTML + reference PNG
// for every state into design-reference/screens/. Also emits STATE-MATRIX.md.
//
// Run: npm run capture:design
//
// Notes (gotchas already hit):
//  - ROOT is path.resolve'd so the static-server startsWith() guard doesn't 404
//    on Windows slash-mismatch (C:/ vs C:\).
//  - We await document.fonts.ready before every screenshot so PNGs don't capture
//    a font swap (the prototype pulls Handjet/Manrope over the network).
//  - screenshots use { animations: 'disabled' } to freeze the skeleton shimmer.
//  - applyParams() (Gigly App.dc.html) only maps modal=settings|notif|profStack;
//    bio/cats modals, toasts and confirm dialogs are interaction-only.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const PROJECT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ROOT = path.resolve(PROJECT, 'gigly_full_design');
const OUT = path.resolve(PROJECT, 'design-reference', 'screens');
const MATRIX = path.resolve(PROJECT, 'design-reference', 'STATE-MATRIX.md');
const ENTRY = 'Gigly App.dc.html';

const TYPES = { '.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.woff':'font/woff','.woff2':'font/woff2' };

// Gig statuses (STATUS map in Gigly App.dc.html) — drive gigDetail variants via stage param.
const STATUSES = ['открыт','на рассмотрении','в работе','на проверке','завершён','оплачен','отклонён'];

// Page-title (header) per route — used as the landing-verification discriminator.
const TITLE = {
  dashboard:'ДАШБОРД', search:'ПОИСК', gigs:'МОИ ГИГИ', chats:'ЧАТЫ', finance:'ФИНАНСЫ',
  disputes:'СПОРЫ', profile:'ПРОФИЛЬ', gigDetail:'ПРОЕКТ', createGig:'СОЗДАТЬ ГИГ',
  applications:'ОТКЛИКИ', disputeNew:'ОТКРЫТЬ СПОР', disputeDetail:'СПОР', disputeResolve:'РЕШЕНИЕ СПОРА',
};
const ADMIN_DASH_TITLE = 'МОДЕРАЦИЯ';

// ---- state matrix ---------------------------------------------------------
// Each entry: { name, role, via, params?, expect, fn? }
// via 'hook' → window.__giglyGo(params); via 'click' → run fn(page) after a base nav.
const STATES = [];
const hook = (name, role, params, expect) => STATES.push({ name, role, via:'hook', params:{ role, ...params }, expect });

// Entry route-states (role-valid)
hook('dashboard.specialist','specialist',{ route:'dashboard' }, TITLE.dashboard);
hook('dashboard.company','company',{ route:'dashboard' }, TITLE.dashboard);
hook('dashboard.admin','admin',{ route:'dashboard' }, ADMIN_DASH_TITLE);
hook('search.specialist','specialist',{ route:'search' }, TITLE.search);
hook('search.company','company',{ route:'search' }, TITLE.search);
hook('gigs.specialist','specialist',{ route:'gigs' }, TITLE.gigs);
hook('gigs.company','company',{ route:'gigs' }, TITLE.gigs);
hook('chats.specialist','specialist',{ route:'chats' }, TITLE.chats);
hook('chats.company','company',{ route:'chats' }, TITLE.chats);
hook('finance.specialist','specialist',{ route:'finance' }, TITLE.finance);
hook('finance.company','company',{ route:'finance' }, TITLE.finance);
hook('disputes.specialist','specialist',{ route:'disputes' }, TITLE.disputes);
hook('disputes.company','company',{ route:'disputes' }, TITLE.disputes);
hook('profile.specialist','specialist',{ route:'profile' }, TITLE.profile);
hook('profile.company','company',{ route:'profile' }, TITLE.profile);
hook('createGig.company','company',{ route:'createGig' }, TITLE.createGig);
hook('applications.company','company',{ route:'applications', gig:1 }, TITLE.applications);
hook('disputeNew.specialist','specialist',{ route:'disputeNew' }, TITLE.disputeNew);
hook('disputeNew.company','company',{ route:'disputeNew' }, TITLE.disputeNew);

// gigDetail variants: role × gig status
for (const role of ['specialist','company']) {
  for (const st of STATUSES) {
    const slug = st.replace(/\s+/g,'-');
    hook(`gigDetail.${role}.${slug}`, role, { route:'gigDetail', gig:1, stage:st }, TITLE.gigDetail);
  }
}

// gigDetail specialist: applied variant (after an application is submitted)
hook('gigDetail.specialist.открыт-applied','specialist',{ route:'gigDetail', gig:1, stage:'открыт', applied:1 }, TITLE.gigDetail);

// Overlays reachable via the hook
hook('overlay.notif','specialist',{ route:'dashboard', modal:'notif' }, TITLE.dashboard);
hook('overlay.profStack','specialist',{ route:'profile', modal:'profStack' }, 'Редактировать стек');

// Interaction-only states (clicks). expect is checked after the interaction.
const click = (name, role, baseParams, expect, fn, note) => STATES.push({ name, role, via:'click', params:{ role, ...baseParams }, expect, fn, note });

// my-gigs tabs (specialist) — click each tab pill by its Russian label
for (const [slug, label] of [['applications','Заявки'],['in-progress','В работе'],['review','На проверке'],['completed','Завершённые']]) {
  click(`myGigs.specialist.${slug}`,'specialist',{ route:'gigs' }, TITLE.gigs,
    async (page) => { await page.getByText(label, { exact:true }).first().click({ timeout:4000 }); },
    `click my-gigs tab "${label}"`);
}

// profile edit modals: stack via hook (overlay.profStack); bio/cats by clicking their section pencils.
click('profile.specialist.modal-bio','specialist',{ route:'profile' }, 'Редактировать описание',
  async (page) => { await clickContentPencil(page, 1); }, 'click the Bio ("описание") section pencil');
click('profile.specialist.modal-cats','specialist',{ route:'profile' }, 'Выберите направления',
  async (page) => { await openCatsModal(page); }, 'open the "Избранные категории" modal');

// dispute detail / resolve — render directly from route + dispute id (ids are 1..6)
hook('disputeDetail.specialist','specialist',{ route:'disputeDetail', dispute:1 }, TITLE.disputeDetail);
hook('disputeDetail.company','company',{ route:'disputeDetail', dispute:1 }, TITLE.disputeDetail);
// admin resolve renders under the МОДЕРАЦИЯ header with a "← Назад к модерации" back-link (not a "РЕШЕНИЕ СПОРА" title)
hook('disputeResolve.admin','admin',{ route:'disputeResolve', dispute:1 }, 'Назад к модерации');

// Pending interaction states we document but cannot reliably auto-reach this pass.
const PENDING = [
  ['search.empty','specialist','apply a filter combination that yields no results (filters are UI-only; no __giglyGo param)'],
  ['search.loading','specialist','click the "Поиск" nav item — loading lasts ~650ms (navTo timer); transient, capture-by-interaction'],
  ['gigs.loading','specialist','click the "Мои гиги" nav item — transient ~650ms loading skeleton'],
  ['toast.success','specialist','trigger a success action (e.g. submit work / mark paid) — sets state.toast, auto-dismisses'],
  ['confirm.destructive','company','trigger a destructive action (e.g. close gig / withdraw) — sets state.confirm'],
];

// ---- interaction helpers --------------------------------------------------
// The profile content column (left ~800-1100) has one small edit pencil per editable section,
// ordered top-to-bottom: [0]=stack ("Редактировать стек"), [1]=bio ("Редактировать описание").
async function clickContentPencil(page, idx) {
  const h = await page.evaluateHandle((i) => {
    const hosts = [...document.querySelectorAll('main *')].filter(el => {
      const s = getComputedStyle(el);
      if (s.cursor !== 'pointer' || !el.querySelector('svg')) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.width <= 24 && r.left > 800 && r.left < 1100;
    });
    const uniq = []; const seen = new Set();
    for (const el of hosts) { const r = el.getBoundingClientRect(); const k = Math.round(r.top) + 'x' + Math.round(r.left); if (!seen.has(k)) { seen.add(k); uniq.push(el); } }
    uniq.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
    return uniq[i] || null;
  }, idx);
  const el = h.asElement();
  if (!el) throw new Error(`content pencil #${idx} not found`);
  await el.click({ timeout: 3000 });
}
// Categories edit ("Избранные категории" modal). The section heading text equals the modal title,
// so we can't detect by title; the modal's unique marker is the subtitle "Выберите направления".
// The trigger pencil isn't in the bio/stack column, so brute-force the small pencils until the
// modal's unique marker appears (re-navigating between attempts so state stays clean).
async function openCatsModal(page) {
  const pencils = () => page.evaluate(() => [...document.querySelectorAll('main *')]
    .filter(el => { const s = getComputedStyle(el); return s.cursor === 'pointer' && el.querySelector('svg') && el.getBoundingClientRect().width <= 24; }).length);
  const count = await pencils();
  for (let i = 0; i < count; i++) {
    await page.evaluate(() => window.__giglyGo({ role: 'specialist', route: 'profile' }));
    await page.waitForTimeout(450);
    const h = await page.evaluateHandle((idx) => [...document.querySelectorAll('main *')]
      .filter(el => { const s = getComputedStyle(el); return s.cursor === 'pointer' && el.querySelector('svg') && el.getBoundingClientRect().width <= 24; })[idx] || null, i);
    const el = h.asElement(); if (!el) continue;
    try { await el.click({ timeout: 1500 }); } catch { continue; }
    await page.waitForTimeout(300);
    if (await page.evaluate(() => document.body.innerText.includes('Выберите направления'))) return;
  }
  throw new Error('could not open categories modal');
}

// ---- static server --------------------------------------------------------
function serve() {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p === '/') p = '/' + ENTRY;
    const file = path.join(ROOT, p);
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end('nf'); return; }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise(r => server.listen(0, () => r(server)));
}

async function settle(page) {
  await page.waitForTimeout(650);          // allow re-render + any navTo loading timer
  await page.evaluate(() => document.fonts.ready).catch(()=>{});
  await page.waitForTimeout(150);
}

// ---- main -----------------------------------------------------------------
// Clean prior output each run so the file set is reproducible (no orphans from removed states).
// Delete the files inside OUT rather than the dir itself (the dir may be a live cwd on Windows).
fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(OUT)) { if (/\.(html|png)$/.test(f)) fs.rmSync(path.join(OUT, f), { force: true }); }
const server = await serve();
const port = server.address().port;
const url = `http://localhost:${port}/${encodeURIComponent(ENTRY)}`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1512, height: 982 } });

const pageErrors = [];
const failedReqs = [];
page.on('pageerror', e => pageErrors.push(e.message));
page.on('requestfailed', r => { const u = r.url(); if (u.includes(`localhost:${port}`)) failedReqs.push(u); });

await page.goto(url, { waitUntil: 'networkidle' });
await settle(page);
if (await page.evaluate(() => typeof window.__giglyGo) !== 'function') {
  console.error('FATAL: window.__giglyGo not present — prototype did not initialise.');
  await browser.close(); server.close(); process.exit(1);
}

const rows = [];
let failures = 0;
for (const s of STATES) {
  try {
    await page.evaluate(p => window.__giglyGo(p), s.params);
    await settle(page);
    if (s.fn) { await s.fn(page); await settle(page); }
    if (s.expect) {
      // scan the whole body: modals/overlays render outside <main>. Header titles are UPPERCASE,
      // so they stay distinct from the mixed-case sidebar nav labels.
      const body = await page.evaluate(() => document.body.innerText.slice(0, 8000));
      if (!body.includes(s.expect)) throw new Error(`landing check failed: "${s.expect}" not found`);
    }
    await page.screenshot({ path: path.join(OUT, s.name + '.png'), fullPage: true, animations: 'disabled' });
    fs.writeFileSync(path.join(OUT, s.name + '.html'), await page.content());
    const trigger = s.via === 'hook' ? `__giglyGo(${JSON.stringify(s.params)})` : `${JSON.stringify(s.params)} → ${s.note}`;
    rows.push({ name:s.name, via:s.via, trigger, status:'captured' });
    console.log(`ok    ${s.name}`);
  } catch (e) {
    failures++;
    rows.push({ name:s.name, via:s.via, trigger:(s.note||JSON.stringify(s.params)), status:'FAILED: '+e.message });
    console.log(`FAIL  ${s.name} — ${e.message}`);
  }
}
for (const [name, role, note] of PENDING) rows.push({ name, via:'interaction', trigger:note, status:'pending (documented, not auto-captured)' });

// ---- STATE-MATRIX.md ------------------------------------------------------
const captured = rows.filter(r => r.status === 'captured').length;
let md = `# Design Reference — State → Trigger Matrix\n\n`;
md += `Generated by \`npm run capture:design\` (scripts/capture-design.mjs). Source: \`gigly_full_design/${ENTRY}\` rendered at 1512px.\n\n`;
md += `**Captured:** ${captured} / ${STATES.length} programmatic states. **Pending (capture-by-interaction):** ${PENDING.length}. **Page errors:** ${pageErrors.length}. **Failed requests:** ${failedReqs.length}.\n\n`;
md += `| State | Via | Trigger | Status |\n|---|---|---|---|\n`;
for (const r of rows) md += `| \`${r.name}\` | ${r.via} | ${String(r.trigger).replace(/\|/g,'\\|')} | ${r.status} |\n`;
md += `\n## Notes\n`;
md += `- Out of scope this round: the settings modal (settings deferred) and \`Auth.dc.html\` screens (captured by the auth change).\n`;
md += `- \`applyParams\` (Gigly App.dc.html) reaches \`modal=settings|notif|profStack\` only; bio/cats modals, toasts and confirm dialogs are interaction-only.\n`;
fs.writeFileSync(MATRIX, md);

console.log(`\nCaptured ${captured}/${STATES.length} programmatic states; ${PENDING.length} pending.`);
console.log(`Page errors: ${pageErrors.length}  Failed requests: ${failedReqs.length}`);
if (pageErrors.length) console.log('PAGE ERRORS:', pageErrors.slice(0,10));
if (failedReqs.length) console.log('FAILED REQS:', failedReqs.slice(0,10));

await browser.close();
server.close();

// Hard gate: zero page errors / failed prototype requests. Interaction failures are reported, not fatal.
if (pageErrors.length || failedReqs.length) { console.error('\nFAILED: page errors or failed requests present.'); process.exit(1); }
console.log(`\nDone. Output: design-reference/screens/  Matrix: design-reference/STATE-MATRIX.md`);
if (failures) console.log(`Note: ${failures} interaction state(s) need attention (see matrix).`);
