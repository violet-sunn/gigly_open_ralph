// Screenshots of a scroll page on the running server: node shots.mjs cyberluxe.html 0,1,2,3,4.5,6 [1920x1080]
//   t runs 0..6 over the whole page height (window.seek in the page). Starts serve.mjs if nothing answers on 8797.
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join, resolve, basename } from "node:path";
const [file, ts = "0", size = "1920x1080"] = process.argv.slice(2);
const [W, H] = size.split("x").map(Number);
const url = `http://localhost:8797/${file}${file.includes("?") ? "&" : "?"}capture=1`;
try { await fetch("http://localhost:8797/"); } catch { await import("./serve.mjs"); }
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
page.on("pageerror", (e) => console.log("[error]", e.message)); page.on("console", (m) => { if (m.type() === "error" && !/404/.test(m.text())) console.log("[console]", m.text()); });
await page.goto(url, { waitUntil: "load" });
await page.evaluate(() => window.ready);
const dir = resolve(import.meta.dirname, `${basename(file.split("?")[0], ".html")}-shots`); mkdirSync(dir, { recursive: true });
for (const t of ts.split(",").map(Number)) {
  const info = await page.evaluate((tt) => window.seek(tt), t); await page.waitForTimeout(150);
  await page.screenshot({ path: join(dir, `${size}-t${t.toFixed(1)}.png`) }); console.log("shot", size, t, JSON.stringify(info));
}
await browser.close(); process.exit(0);
