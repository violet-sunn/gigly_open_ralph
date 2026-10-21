// Opens a composition on the motion server, waits for window.ready and prints window.info (debug data the page exposes).
//   node probe.mjs prism.html
import { chromium } from "@playwright/test";
import { createServer } from "node:http";
import { createReadStream, statSync, existsSync } from "node:fs";
import { join, resolve, extname } from "node:path";
const ROOT = resolve(import.meta.dirname, "../.."), WORK = import.meta.dirname;
const MIME = { ".html": "text/html; charset=utf-8", ".ttf": "font/ttf", ".js": "text/javascript", ".glb": "model/gltf-binary", ".png": "image/png", ".jpg": "image/jpeg" };
const server = createServer((req, res) => {
  const url = req.url.split("?")[0], file = url.startsWith("/public/") ? join(ROOT, url) : join(WORK, url);
  if (!existsSync(file) || statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": MIME[extname(file)] ?? "application/octet-stream" }); createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(8798, r));
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on("console", (m) => console.log("[page]", m.text()));
page.on("pageerror", (e) => console.log("[error]", e.message));
await page.goto(`http://localhost:8798/${process.argv[2]}`, { waitUntil: "load" });
const t0 = Date.now();
await page.evaluate(() => window.ready);
console.log("ready in", Date.now() - t0, "ms");
const [, , file, snippet, label = "probe", t = "0"] = process.argv;
if (snippet) {
  // run a tweak against the page's exposed objects (window.T), seek, screenshot
  await page.evaluate(([s, tt]) => { new Function("T", s)(window.T); window.seek(Number(tt)); }, [snippet, t]);
  await page.waitForTimeout(50);
  const { mkdirSync } = await import("node:fs"); mkdirSync(join(WORK, "probe-stills"), { recursive: true });
  await page.screenshot({ path: join(WORK, "probe-stills", `${label}.png`) }); console.log("shot", label);
} else console.log(JSON.stringify(await page.evaluate(() => window.info ?? null), null, 1));
await browser.close(); server.close();
