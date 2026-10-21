// For each card in sites/awwwards/cards.json, opens its Awwwards page and extracts the live site URL, title and tags.
import { chromium } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const dir = resolve(import.meta.dirname, "sites/awwwards");
const cards = JSON.parse(readFileSync(join(dir, "cards.json"), "utf8"));
const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: "en-US",
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36" });
const out = [];
for (const c of cards) {
  try {
    await page.goto(`https://www.awwwards.com${c.href}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(1500);
    const info = await page.evaluate(() => {
      const visit = [...document.querySelectorAll("a")].find((a) => /visit/i.test(a.textContent) && /^https?:/.test(a.href) && !/awwwards\.com/.test(a.href));
      const tags = [...document.querySelectorAll("a[href*='/websites/'], a[href*='/tag/']")].map((a) => a.textContent.trim()).filter((t) => t && t.length < 30);
      return { title: document.title.replace(/ - Awwwards.*$/, "").trim(), url: visit?.href ?? null, tags: [...new Set(tags)].slice(0, 14) };
    });
    out.push({ slug: c.href.split("/")[2], ...info });
    console.log(out.at(-1).slug, "|", info.title, "|", info.url, "|", info.tags.join(", "));
  } catch (e) { console.log(c.href, "FAILED", e.message.split("\n")[0]); }
}
writeFileSync(join(dir, "visit.json"), JSON.stringify(out, null, 2));
await browser.close();
