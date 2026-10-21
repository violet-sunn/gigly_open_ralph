// Captures the live hero scene (text hidden) across the hold into loop-frames/, for the footer loop and the stills.
//   node loopcap.mjs 27   → 27 frames from t=0 to t=2.6 (the hero hold at 1920×1080)
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
const N = Number(process.argv[2] || 27), T_END = 2.6;
try { await fetch("http://localhost:8797/"); } catch { await import("./serve.mjs"); }
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto("http://localhost:8797/cyberluxe.html?bare=1&capture=1", { waitUntil: "load" });
await page.evaluate(() => window.ready);
const dir = resolve(import.meta.dirname, "loop-frames"); mkdirSync(dir, { recursive: true });
for (let i = 0; i < N; i++) {
  await page.evaluate((tt) => window.seek(tt), (i / (N - 1)) * T_END); await page.waitForTimeout(80);
  await page.screenshot({ path: join(dir, `f${String(i).padStart(3, "0")}.png`) });
}
console.log(`${N} frames → ${dir}`); await browser.close(); process.exit(0);
