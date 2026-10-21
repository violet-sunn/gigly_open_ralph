// Static server for the brand-visual pages: node serve.mjs → http://localhost:8797/cyberluxe.html
import { createServer } from "node:http";
import { createReadStream, statSync, existsSync } from "node:fs";
import { join, resolve, extname } from "node:path";
const ROOT = resolve(import.meta.dirname, "../.."), WORK = import.meta.dirname;
const MIME = { ".html": "text/html; charset=utf-8", ".ttf": "font/ttf", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".glb": "model/gltf-binary", ".png": "image/png", ".jpg": "image/jpeg", ".css": "text/css" };
const PORT = Number(process.env.PORT || 8797);
createServer((req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]), file = url.startsWith("/public/") ? join(ROOT, url) : join(WORK, url);
  if (!existsSync(file) || statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": MIME[extname(file)] ?? "application/octet-stream", "Cache-Control": "no-store" });
  createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`open http://localhost:${PORT}/cyberluxe.html  (Ctrl+C to stop)`));
