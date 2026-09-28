import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { join, normalize, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { brotliCompressSync, gzipSync } from "node:zlib";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..", "out");
const PORT = Number(process.env.PORT || 3111);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
};

createServer(async (req, res) => {
  let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  if (urlPath === "/") urlPath = "/index.html";

  let filePath = normalize(join(ROOT, urlPath));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  // Next static export: foo/ -> foo.html, and RSC requests append .txt
  if (urlPath.endsWith(".txt")) filePath = filePath.slice(0, -4) + ".html";

  if (!filePath.endsWith(".html") && existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = join(filePath, "index.html");
  }

  // Next static export: /katalog -> katalog.html, /produk/foo -> produk/foo.html
  if (!existsSync(filePath) && !filePath.endsWith(".html")) {
    const htmlAlt = filePath + ".html";
    if (existsSync(htmlAlt)) filePath = htmlAlt;
  }

  if (!existsSync(filePath)) {
    res.writeHead(404);
    res.end("Not Found: " + urlPath);
    return;
  }

  const ext = extname(filePath);

  const cacheHeader = urlPath.startsWith("/_next/static/")
    ? "public, max-age=31536000, immutable"
    : "no-cache";

  const size = statSync(filePath).size;
  const encodings = (req.headers["accept-encoding"] || "").split(",").map((s) => s.trim());

  const MIME_HEADER = MIME[ext] || "application/octet-stream";

  let body = null;
  let contentEncoding = null;
  let finalSize = size;

  const compressible = /^(text\/|application\/(javascript|json|xml|xhtml\+xml)|image\/svg\+xml)/.test(MIME_HEADER);
  if (compressible && size > 256) {
    const raw = await readAll(filePath);
    if (encodings.includes("br")) {
      const buf = brotliCompressSync(raw);
      if (buf.byteLength < size) { body = buf; contentEncoding = "br"; finalSize = buf.byteLength; }
    } else if (encodings.includes("gzip")) {
      const buf = gzipSync(raw);
      if (buf.byteLength < size) { body = buf; contentEncoding = "gzip"; finalSize = buf.byteLength; }
    }
  }

  const headers = {
    "content-type": MIME_HEADER,
    "content-length": finalSize,
    "cache-control": cacheHeader,
  };
  if (contentEncoding) headers["content-encoding"] = contentEncoding;

  res.writeHead(200, headers);
  if (body) {
    res.end(body);
  } else {
    createReadStream(filePath).pipe(res);
  }
}).listen(PORT, "127.0.0.1", () => {
  console.log(`Static server on http://localhost:${PORT} serving ${ROOT}`);
});

function readAll(filePath) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const s = createReadStream(filePath);
    s.on("data", (c) => chunks.push(c));
    s.on("end", () => resolve(Buffer.concat(chunks)));
    s.on("error", reject);
  });
}
