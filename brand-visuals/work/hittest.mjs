// At scroll t, reports what elementFromPoint returns across the h1's box: node hittest.mjs cyberluxe.html 2.67 [1440x900]
import { chromium } from "@playwright/test";
const [file, t = "0", size = "1440x900"] = process.argv.slice(2);
const [W, H] = size.split("x").map(Number);
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.goto(`http://localhost:8797/${file}?capture=1`, { waitUntil: "load" });
await page.evaluate(() => window.ready);
const r = await page.evaluate(async (tt) => {
  await window.seek(tt); await new Promise((r) => requestAnimationFrame(r));
  const h = document.querySelector("h1"); const b = h.getBoundingClientRect(); const hits = {};
  for (let i = 0; i < 8; i++) for (let j = 0; j < 4; j++) {
    const x = b.left + (i + 0.5) / 8 * b.width, y = b.top + (j + 0.5) / 4 * b.height;
    const e = document.elementFromPoint(x, y); const k = e ? (e.tagName.toLowerCase() + (e.id ? "#" + e.id : "") + (e.className && typeof e.className === "string" ? "." + e.className.split(" ")[0] : "") + (h.contains(e) ? " (h1)" : "")) : "null";
    hits[k] = (hits[k] || 0) + 1;
  }
  const cs = getComputedStyle(h);
  return { y: scrollY, box: [Math.round(b.left), Math.round(b.top), Math.round(b.width), Math.round(b.height)], hits, opacity: cs.opacity, visibility: cs.visibility, transform: cs.transform, p: document.querySelector("#hero").style.getPropertyValue("--p") };
}, Number(t));
console.log(JSON.stringify(r, null, 1)); await browser.close(); process.exit(0);
