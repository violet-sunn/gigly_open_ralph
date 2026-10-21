// Captures reference sites the way the taste-skill study did: first viewport + frames while wheel-scrolling, 1440x900.
//   node sites-capture.mjs            → all sites
//   node sites-capture.mjs lusion igloo
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = resolve(import.meta.dirname, "sites");
const SITES = {
  awwwards: "https://www.awwwards.com/websites/webgl/",
  lusion: "https://lusion.co/",
  igloo: "https://igloo.inc/",
  raycast: "https://www.raycast.com/",
  genshin: "https://genshin.hoyoverse.com/en/",
  zzz: "https://zenless.hoyoverse.com/en-us/",
  wuwa: "https://wutheringwaves.kurogames.com/en/main/",
  endfield: "https://endfield.gryphline.com/en-us/",
  hsr: "https://hsr.hoyoverse.com/en-us/",
};
// extra sites (e.g. picked from the Awwwards list) live in sites-extra.json: { name: url }
try { Object.assign(SITES, JSON.parse((await import("node:fs")).readFileSync(join(import.meta.dirname, "sites-extra.json"), "utf8"))); } catch {}
const only = process.argv.slice(2);
const FRAMES = 8;

const browser = await chromium.launch({ executablePath: CHROME, args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
for (const [name, url] of Object.entries(SITES)) {
  if (only.length && !only.includes(name)) continue;
  const dir = join(OUT, name); mkdirSync(dir, { recursive: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, locale: "en-US",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36" });
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: process.env.WAIT || "load", timeout: 90000 });
    await page.waitForTimeout(7000);
    for (const sel of ["button:has-text('Accept')", "button:has-text('Agree')", "button:has-text('I agree')", "button:has-text('OK')", "button:has-text('Enter')", "[class*=cookie] button", "[class*=consent] button", "[class*=agree]"]) {
      try { const b = page.locator(sel).first(); if (await b.isVisible({ timeout: 400 })) await b.click({ timeout: 1000 }); } catch {}
    }
    if (process.env.CLICK) { try { await page.getByText(process.env.CLICK, { exact: false }).first().click({ timeout: 3000 }); await page.waitForTimeout(5000); } catch {} }
    await page.mouse.move(720, 450);
    for (let i = 0; i < FRAMES; i++) {
      if (i > 0) { for (let k = 0; k < 9; k++) { await page.mouse.wheel(0, 100); await page.waitForTimeout(70); } await page.waitForTimeout(1600); }
      await page.screenshot({ path: join(dir, `f${i}.png`) });
    }
    const info = await page.evaluate(() => ({
      title: document.title, height: document.documentElement.scrollHeight, y: scrollY,
      canvases: document.querySelectorAll("canvas").length,
      fonts: [...new Set([...document.querySelectorAll("h1,h2,h3,p,a,button,span")].map((e) => getComputedStyle(e).fontFamily.split(",")[0].replace(/"/g, "")))].slice(0, 10),
    }));
    writeFileSync(join(dir, "info.json"), JSON.stringify(info, null, 2));
    console.log(`${name}: "${info.title}" h=${info.height} canvases=${info.canvases} fonts=${info.fonts.join(" | ")}`);
  } catch (e) { console.log(`${name}: FAILED ${e.message.split("\n")[0]}`); }
  await ctx.close();
}
// contact sheets: 4x2 frames per site at half size
const sheetPage = await browser.newPage({ viewport: { width: 2880, height: 1620 } });
for (const name of Object.keys(SITES)) {
  if (only.length && !only.includes(name)) continue;
  const dir = join(OUT, name);
  const imgs = Array.from({ length: FRAMES }, (_, i) => `<div><img src="file:///${dir.replace(/\\/g, "/")}/f${i}.png"><span>${name} · f${i}</span></div>`).join("");
  await sheetPage.setContent(`<style>body{margin:0;background:#222;display:grid;grid-template-columns:repeat(4,720px);grid-auto-rows:810px}div{position:relative;width:720px;height:810px;border:1px solid #444}img{width:720px;height:450px;object-fit:cover;object-position:top;display:block}span{position:absolute;left:6px;top:6px;font:14px monospace;color:#fff;background:#000a;padding:2px 6px}</style>${imgs}`);
  await sheetPage.waitForTimeout(800);
  await sheetPage.screenshot({ path: join(dir, "sheet.png") });
}
await browser.close();
console.log("done");
