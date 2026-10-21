// A scroll-through of the page as frames: node scrollvid.mjs 61 → scroll-frames/f000..f060.png (t = 0..6 over the page height)
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
const N = Number(process.argv[2] || 61);
try { await fetch("http://localhost:8797/"); } catch { await import("./serve.mjs"); }
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto("http://localhost:8797/cyberluxe.html?capture=1", { waitUntil: "load" });
await page.evaluate(() => window.ready);
const dir = resolve(import.meta.dirname, "scroll-frames"); mkdirSync(dir, { recursive: true });
for (let i = 0; i < N; i++) {
  await page.evaluate((tt) => window.seek(tt), (i / (N - 1)) * 6); await page.waitForTimeout(80);
  await page.screenshot({ path: join(dir, `f${String(i).padStart(3, "0")}.png`) });
}
console.log(`${N} frames → ${dir}`); await browser.close(); process.exit(0);
