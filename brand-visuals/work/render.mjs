// Renders each brand visual (an HTML file at an exact pixel size) to PNG with the installed Chrome.
// Serves the project's public/ assets (fonts, pixel wave, artwork) and this folder on localhost.
//   node render.mjs            → renders every entry in JOBS
//   node render.mjs key og     → only the named jobs
import { chromium } from "@playwright/test";
import { createServer } from "node:http";
import { createReadStream, statSync, existsSync } from "node:fs";
import { join, resolve, extname } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const WORK = import.meta.dirname;
const OUT = resolve(WORK, "..");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const MIME = { ".html": "text/html; charset=utf-8", ".ttf": "font/ttf", ".svg": "image/svg+xml", ".png": "image/png", ".css": "text/css" };

export const JOBS = {
  key: { file: "key-visual.html", w: 1920, h: 1080, out: "01-key-visual.png" },
  og: { file: "og-card.html", w: 1200, h: 630, out: "02-social-card.png" },
  p1: { file: "poster.html?n=1", w: 1080, h: 1350, out: "03-poster-1.png" },
  p2: { file: "poster.html?n=2", w: 1080, h: 1350, out: "03-poster-2.png" },
  p3: { file: "poster.html?n=3", w: 1080, h: 1350, out: "03-poster-3.png" },
  avatar: { file: "avatar.html", w: 1024, h: 1024, out: "04-avatar.png" },
  board: { file: "board.html", w: 2400, h: 1500, out: "00-brand-board.png" },
  altA: { file: "alt-a.html", w: 1920, h: 1080, out: "10-direction-A-act.png" },
  altAp: { file: "alt-a-post.html", w: 1080, h: 1080, out: "11-direction-A-post.png" },
  altB: { file: "alt-b.html", w: 1920, h: 1080, out: "12-direction-B-status.png" },
  altBp: { file: "alt-b-post.html", w: 1080, h: 1080, out: "13-direction-B-post.png" },
  alts: { file: "alts-sheet.html", w: 2400, h: 1050, out: "09-directions.png" },
  premL: { file: "prem-light.html", w: 1920, h: 1080, out: "20-premium-light.png" },
  premD: { file: "prem-dark.html", w: 1920, h: 1080, out: "21-premium-dark.png" },
};

const server = createServer((req, res) => {
  const url = req.url.split("?")[0];
  const file = url.startsWith("/public/") ? join(ROOT, url) : url.startsWith("/out/") ? join(OUT, url.slice(5)) : join(WORK, url);
  if (!existsSync(file) || statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": MIME[extname(file)] ?? "application/octet-stream", "Content-Length": statSync(file).size });
  createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(8799, r));

const wanted = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: CHROME });
for (const [name, job] of Object.entries(JOBS)) {
  if (wanted.length && !wanted.includes(name)) continue;
  const page = await browser.newPage({ viewport: { width: job.w, height: job.h }, deviceScaleFactor: 1 });
  await page.goto(`http://localhost:8799/${job.file}`, { waitUntil: "load" });
  await page.evaluate(async () => { await document.fonts.ready; await new Promise((r) => setTimeout(r, 150)); });
  await page.screenshot({ path: join(OUT, job.out), type: "png", clip: { x: 0, y: 0, width: job.w, height: job.h } });
  console.log(`${name} → ${job.out} (${job.w}×${job.h})`);
  await page.close();
}
await browser.close();
server.close();
