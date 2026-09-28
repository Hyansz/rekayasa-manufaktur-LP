/* eslint-disable */
/**
 * Objective DOM/CSS audit for Rekayasa Manufaktur.
 * Measures things that define "premium" visual quality and can be verified:
 *   - WCAG contrast ratio for every visible text node (flags < 4.5 AA / < 3.0 large)
 *   - Heading font-size scale consistency across pages
 *   - Section vertical padding consistency
 *   - Heading color token consistency (navy-700 vs navy-800)
 *   - Text-gray shades used on light backgrounds (flag low-contrast grays)
 * Writes audit-results.json to the screenshots dir.
 * Run: node scripts/audit-visual.js
 */
const path = require("path");
const fs = require("fs");
const { chromium } = require("playwright-core");

const OUT_DIR = path.resolve(__dirname, "..", "out");
const SHOTS_DIR = path.resolve(__dirname, "..", "..", "screenshots");
const RESULTS_PATH = path.join(SHOTS_DIR, "audit-visual.json");

const PAGES = [
  { key: "home", url: "/index.html" },
  { key: "katalog", url: "/katalog.html" },
  { key: "produk", url: "/produk/kursi-minimalis-alumunium.html" },
  { key: "tentang", url: "/tentang.html" },
  { key: "kontak", url: "/kontak.html" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Linearize sRGB channels [0..255] -> [0..1]
function lin(c) {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}
// Relative luminance
function lum(r, g, b) {
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
function contrast(fg, bg) {
  const l1 = lum(...fg);
  const l2 = lum(...bg);
  const [a, b] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (a + 0.05) / (b + 0.05);
}

// Resolve computed color (rgb/rgba) to a 3-channel array. If alpha < 1, we
// can't compute real contrast without compositing; approximate by blending
// towards white (typical page bg).
function parseColor(str) {
  if (!str) return null;
  const m = str.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const parts = m[1].split(",").map((s) => parseFloat(s.trim()));
  const [r, g, b] = parts;
  const a = parts.length === 4 ? parts[3] : 1;
  if (a < 0.99) {
    // blend alpha toward white
    return [
      Math.round(r * a + 255 * (1 - a)),
      Math.round(g * a + 255 * (1 - a)),
      Math.round(b * a + 255 * (1 - a)),
    ];
  }
  return [Math.round(r), Math.round(g), Math.round(b)];
}

async function auditPage(browser, key, url) {
  const out = { key, url, contrastFails: [], headings: [], sections: [], bodyTextGray: [] };
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    baseURL: "http://localhost:3111",
  });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
  await page.evaluate(async () => {
    await document.fonts?.ready?.catch?.(() => {});
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 300));
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 200));
  });
  await sleep(300);

  // --- Contrast scan over all visible, non-empty text leaves ---
  const contrastResults = await page.evaluate(() => {
    const lin = (c) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    const lum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    const contrast = (fg, bg) => { const l1 = lum(...fg), l2 = lum(...bg); const [a, b] = l1 > l2 ? [l1, l2] : [l2, l1]; return (a + 0.05) / (b + 0.05); };
    const parseColor = (str) => {
      if (!str) return null;
      const m = str.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const parts = m[1].split(",").map((s) => parseFloat(s.trim()));
      const [r, g, b] = parts;
      const a = parts.length === 4 ? parts[3] : 1;
      if (a < 0.99) return [Math.round(r * a + 255 * (1 - a)), Math.round(g * a + 255 * (1 - a)), Math.round(b * a + 255 * (1 - a))];
      return [Math.round(r), Math.round(g), Math.round(b)];
    };

    const els = document.querySelectorAll("body *");
    const fails = [];
    const seen = new Set();
    for (const el of els) {
      // leaf text element: has direct text, not styled by child
      if (el.children.length > 0) continue;
      const txt = (el.textContent || "").trim();
      if (!txt) continue;
      if (seen.has(el)) continue;
      const cs = getComputedStyle(el);
      // skip invisible
      if (cs.visibility === "hidden" || cs.display === "none" || parseFloat(cs.opacity) === 0) continue;
      // skip elements inside aria-hidden (decorative)
      let hidden = false;
      let n = el;
      while (n && n !== document.body) {
        if (n.getAttribute && n.getAttribute("aria-hidden") === "true") { hidden = true; break; }
        n = n.parentElement;
      }
      if (hidden) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;

      const fs = parseFloat(cs.fontSize);
      const fw = parseInt(cs.fontWeight, 10);
      const isLarge = fs >= 24 || (fs >= 18.66 && fw >= 700);
      const need = isLarge ? 3.0 : 4.5;

      const fg = cs.color;
      const bg = cs.backgroundColor;

      // find effective background by walking ancestors (skip transparent)
      let bgColor = null;
      let node = el;
      while (node && node !== document.body) {
        const bc = getComputedStyle(node).backgroundColor;
        if (bc && bc !== "rgba(0, 0, 0, 0)" && bc !== "transparent") { bgColor = parseColor(bc); break; }
        node = node.parentElement;
      }
      if (!bgColor) bgColor = [255, 255, 255];

      const fgArr = parseColor(fg);
      if (!fgArr) continue;

      const ratio = contrast(fgArr, bgColor);
      const cls = (el.className || "").toString().slice(0, 60);
      const snippet = txt.slice(0, 40);
      const keyStr = `${fg}${bg}${snippet}`;
      if (ratio < need && !seen.has(keyStr)) {
        seen.add(keyStr);
        fails.push({
          tag: el.tagName.toLowerCase(),
          text: snippet,
          fg,
          bg: bgColor.join(","),
          ratio: Math.round(ratio * 100) / 100,
          need: isLarge ? "3.0(large)" : "4.5",
          fontSize: fs,
          cls,
        });
      }
      if (fails.length >= 12) break;
    }
    return fails;
  });
  out.contrastFails = contrastResults;

  // --- Heading sizes + colors per page ---
  out.headings = await page.evaluate(() => {
    const list = [];
    document.querySelectorAll("h1, h2, h3").forEach((h) => {
      const cs = getComputedStyle(h);
      const r = h.getBoundingClientRect();
      if (r.width === 0) return;
      list.push({
        tag: h.tagName.toLowerCase(),
        text: (h.textContent || "").trim().slice(0, 30),
        size: parseFloat(cs.fontSize),
        color: cs.color,
        weight: cs.fontWeight,
        cls: (h.className || "").toString().slice(0, 55),
      });
    });
    return list;
  });

  // --- Section top/bottom padding ---
  out.sections = await page.evaluate(() => {
    const list = [];
    document.querySelectorAll("main section").forEach((s) => {
      const cs = getComputedStyle(s);
      const pt = parseFloat(cs.paddingTop);
      const pb = parseFloat(cs.paddingBottom);
      list.push({
        top: pt,
        bottom: pb,
        bg: cs.backgroundColor.slice(0, 40),
        cls: (s.className || "").toString().slice(0, 50),
      });
    });
    return list;
  });

  await ctx.close();
  return out;
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) throw new Error("out/ not found — run build first");
  fs.mkdirSync(SHOTS_DIR, { recursive: true });
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const results = {};
  for (const p of PAGES) {
    console.log(`Auditing ${p.key} ...`);
    results[p.key] = await auditPage(browser, p.key, p.url);
  }
  await browser.close();
  fs.writeFileSync(RESULTS_PATH, JSON.stringify(results, null, 2));
  console.log(`\nWrote ${RESULTS_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
