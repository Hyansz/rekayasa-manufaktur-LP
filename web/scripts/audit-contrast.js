/* eslint-disable */
/**
 * Precise low-contrast scan for Rekayasa Manufaktur.
 * Fixes the gradient false-positives: we only report text whose computed
 * background is a LIGHT (or explicit solid) color AND whose fg is gray/tinted,
 * i.e. the cases most likely to fail WCAG AA on light sections.
 * We also verify contrast by reading the element's effective background and
 * skipping anything on a dark/gradient backdrop (navy hero etc).
 * Run: node scripts/audit-contrast.js
 */
const path = require("path");
const fs = require("fs");
const { chromium } = require("playwright-core");

const SHOTS_DIR = path.resolve(__dirname, "..", "..", "screenshots");
const RESULTS_PATH = path.join(SHOTS_DIR, "audit-contrast.json");

const PAGES = [
  { key: "home", url: "/index.html" },
  { key: "katalog", url: "/katalog.html" },
  { key: "produk", url: "/produk/kursi-minimalis-alumunium.html" },
  { key: "tentang", url: "/tentang.html" },
  { key: "kontak", url: "/kontak.html" },
];

const GREY_HEX = [
  "rgb(107, 114, 128)", // gray-500
  "rgb(156, 163, 175)", // gray-400
  "rgb(75, 85, 99)",    // gray-600
  "rgb(55, 65, 81)",    // gray-700
  "rgb(148, 163, 184)", // slate-400
  "rgb(100, 116, 139)", // slate-500
];

async function main() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const results = {};
  for (const p of PAGES) {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      baseURL: "http://localhost:3111",
    });
    const page = await ctx.newPage();
    await page.goto(p.url, { waitUntil: "networkidle", timeout: 45000 });
    await page.evaluate(async () => {
      await document.fonts?.ready?.catch?.(() => {});
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 300));
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 200));
    });

    const fails = await page.evaluate(() => {
      const lin = (c) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
      const lum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
      const contrast = (f, b) => { const l1 = lum(...f), l2 = lum(...b); const [a, bb] = l1 > l2 ? [l1, l2] : [l2, l1]; return (a + 0.05) / (bb + 0.05); };
      // resolve ANY css color string to [r,g,b] (blended over white) using a 2d canvas
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      const g2 = canvas.getContext("2d", { willReadFrequently: true });
      const toRgb = (colorStr) => {
        try {
          g2.clearRect(0, 0, 1, 1);
          g2.fillStyle = "rgb(255,255,255)";
          g2.fillRect(0, 0, 1, 1);
          g2.fillStyle = colorStr;
          g2.fillRect(0, 0, 1, 1);
          const d = g2.getImageData(0, 0, 1, 1).data;
          const alpha = d[3];
          if (alpha < 255) {
            const a = alpha / 255;
            return [Math.round(d[0] * a + 255 * (1 - a)), Math.round(d[1] * a + 255 * (1 - a)), Math.round(d[2] * a + 255 * (1 - a))];
          }
          return [d[0], d[1], d[2]];
        } catch { return null; }
      };

      // effective solid bg walking up (skip gradients): returns resolved [r,g,b] over white
      const effBg = (el) => {
        let n = el;
        while (n && n !== document.body) {
          const cs = getComputedStyle(n);
          if (cs.backgroundImage === "none" && cs.backgroundColor !== "rgba(0, 0, 0, 0)" && cs.backgroundColor !== "transparent") {
            const c = toRgb(cs.backgroundColor);
            if (c) return c;
          }
          n = n.parentElement;
        }
        return [255, 255, 255];
      };

      const out = [];
      const leaves = document.querySelectorAll("body *");
      for (const el of leaves) {
        if (el.children.length > 0) continue;
        const txt = (el.textContent || "").trim();
        if (!txt || txt.length < 2) continue;
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) === 0) continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        const fg = toRgb(cs.color);
        if (!fg) continue;
        // skip white-on-light (decorative low-contrast) — only flag mid-tone tinted text
        const spread = Math.max(...fg) - Math.min(...fg);
        const isTint = spread <= 30 && fg[0] > 70 && fg[0] < 200;
        if (!isTint) continue;
        const bg = effBg(el);
        if (bg[0] + bg[1] + bg[2] < 240) continue;
        const ratio = contrast(fg, bg);
        const fs = parseFloat(cs.fontSize);
        const fw = parseInt(cs.fontWeight, 10);
        const large = fs >= 24 || (fs >= 18.66 && fw >= 700);
        const need = large ? 3.0 : 4.5;
        if (ratio < need) {
          out.push({ text: txt.slice(0, 42), fg: fg.join(","), bg: bg.join(","), ratio: Math.round(ratio * 100) / 100, need: large ? "3(large)" : "4.5", fs: Math.round(fs), cls: (el.className || "").toString().slice(0, 50) });
        }
      }
      const seen = new Set();
      return out.filter((o) => { const k = o.text + "|" + o.ratio; if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 20);
    });

    results[p.key] = fails;
    console.log(`${p.key}: ${fails.length} low-contrast text`);
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(RESULTS_PATH, JSON.stringify(results, null, 2));
  console.log("Wrote", RESULTS_PATH);
}
main().catch((e) => { console.error(e); process.exit(1); });
