// Scrapes the Awwwards WebGL collection: dismisses the cookie modal, scrolls, screenshots 4 frames, lists the site cards.
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const dir = resolve(import.meta.dirname, "sites/awwwards"); mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: "en-US",
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36" });
await page.goto("https://www.awwwards.com/websites/webgl/", { waitUntil: "load", timeout: 90000 });
await page.waitForTimeout(4000);
// the consent modal ignores clicks in headless; drop every large fixed overlay and unlock scrolling
await page.evaluate(() => {
  for (const el of [...document.querySelectorAll("body *")]) {
    const s = getComputedStyle(el), r = el.getBoundingClientRect();
    if (s.position === "fixed" && r.width > 600 && r.height > 300) el.remove();
  }
  document.documentElement.style.overflow = "auto"; document.body.style.overflow = "auto";
});
await page.waitForTimeout(1000);
for (let i = 0; i < 4; i++) {
  await page.screenshot({ path: join(dir, `f${i}.png`) });
  for (let k = 0; k < 9; k++) { await page.mouse.wheel(0, 100); await page.waitForTimeout(80); }
  await page.waitForTimeout(1500);
}
const cards = await page.evaluate(() => {
  const out = [];
  for (const a of document.querySelectorAll("a[href^='/sites/']")) {
    const href = a.getAttribute("href"); if (!href || href.split("/").length !== 3) continue;
    const card = a.closest("li, article, figure, div");
    const media = card?.querySelector("img, video");
    const title = (a.getAttribute("title") || a.textContent || "").trim().replace(/\s+/g, " ");
    if (!out.some((o) => o.href === href)) out.push({ href, title, media: media?.getAttribute("src") || media?.getAttribute("data-src") || media?.querySelector?.("source")?.getAttribute("src") || null });
  }
  return out;
});
writeFileSync(join(dir, "cards.json"), JSON.stringify(cards, null, 2));
console.log(cards.length, "cards");
for (const c of cards.slice(0, 40)) console.log(c.href, "|", c.title.slice(0, 50));
await browser.close();
