// Renders a clock-driven composition (window.seek(t)) to stills or a frame sequence with the installed Chrome.
//   node motion.mjs cyber.html stills 0.3,0.8,2.6     → work/<name>-stills/t-<t>.png
//   node motion.mjs cyber.html frames 30 6           → work/<name>-frames/f%04d.png
import { chromium } from "@playwright/test";
import { createServer } from "node:http";
import { createReadStream, statSync, existsSync, mkdirSync } from "node:fs";
import { join, resolve, extname, basename } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const WORK = import.meta.dirname;
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const MIME = { ".html": "text/html; charset=utf-8", ".ttf": "font/ttf", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".glb": "model/gltf-binary", ".hdr": "application/octet-stream" };

const server = createServer((req, res) => {
  const url = req.url.split("?")[0];
  const file = url.startsWith("/public/") ? join(ROOT, url) : join(WORK, url);
  if (!existsSync(file) || statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": MIME[extname(file)] ?? "application/octet-stream", "Content-Length": statSync(file).size });
  createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(8797, r));

const [file, mode, a, b] = process.argv.slice(2);
const name = basename(file, ".html");
// swiftshader flags: headless Chrome has no GPU, WebGL scenes (prism.html) need the software renderer
const browser = await chromium.launch({ executablePath: CHROME, args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto(`http://localhost:8797/${file}`, { waitUntil: "load" });
await page.evaluate(() => window.ready);
const shot = async (t, path) => { await page.evaluate((tt) => window.seek(tt), t); await page.waitForTimeout(16); await page.screenshot({ path, type: "png" }); };

if (mode === "stills") {
  const dir = join(WORK, `${name}-stills`); mkdirSync(dir, { recursive: true });
  for (const t of a.split(",").map(Number)) { await shot(t, join(dir, `t-${t.toFixed(2)}.png`)); console.log(`still ${t}`); }
} else {
  const fps = Number(a ?? 30), dur = Number(b ?? 6), n = Math.round(fps * dur);
  const dir = join(WORK, `${name}-frames`); mkdirSync(dir, { recursive: true });
  for (let i = 0; i < n; i++) await shot(i / fps, join(dir, `f${String(i).padStart(4, "0")}.png`));
  console.log(`${n} frames → ${dir}`);
}
await browser.close(); server.close();
