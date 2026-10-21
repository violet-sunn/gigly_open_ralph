// Prints the text blocks whose right edge is furthest from the viewport's right edge, at a given width: node measure.mjs cyberluxe.html 390
import { chromium } from "@playwright/test";
const [file, w = "390"] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: Number(w), height: 844 } });
await page.goto(`http://localhost:8797/${file}`, { waitUntil: "load" });
await page.evaluate(() => window.ready); await page.waitForTimeout(500);
const rows = await page.evaluate(() => {
  const W = innerWidth, out = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n; while ((n = walker.nextNode())) {
    if (!n.textContent.trim()) continue; const el = n.parentElement; if (!el || el.closest("script,style")) continue;
    const cs = getComputedStyle(el); if (cs.visibility === "hidden" || cs.display === "none" || Number(cs.opacity) === 0) continue;
    const r = document.createRange(); r.selectNodeContents(n); const b = r.getBoundingClientRect(); if (!b.width) continue;
    const path = []; let e = el; while (e && e !== document.body && path.length < 4) { path.unshift(e.tagName.toLowerCase() + (e.className && typeof e.className === "string" ? "." + e.className.split(" ")[0] : "")); e = e.parentElement; }
    out.push({ text: n.textContent.trim().slice(0, 30), left: Math.round(b.left), right: Math.round(W - b.right), size: cs.fontSize, path: path.join(">") });
  }
  const byRight = [...out].sort((a, b) => a.right - b.right).slice(0, 6), byLeft = [...out].sort((a, b) => a.left - b.left).slice(0, 4);
  return { W, byRight, byLeft, count: out.length };
});
console.log(JSON.stringify(rows, null, 1));
await browser.close(); process.exit(0);
