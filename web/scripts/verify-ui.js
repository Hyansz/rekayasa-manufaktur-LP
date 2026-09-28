/* eslint-disable */
/**
 * UI verification script for Rekayasa Manufaktur (static export in ../out).
 * - Screenshots: home / katalog / produk / tentang / kontak x 3 viewports (375x812, 768x1024, 1440x900)
 * - Console log capture, horizontal overflow detection (375px), katalog filter test,
 *   kontak form submit test, sticky CTA / ScrollToTop overlap check on product page.
 * Output: screenshots/ (repo root) + verification-results.json
 * Run: node scripts/verify-ui.js
 */
const path = require("path");
const fs = require("fs");
const { chromium } = require("playwright-core");

const OUT_DIR = path.resolve(__dirname, "..", "out");
const SHOTS_DIR = path.resolve(__dirname, "..", "..", "screenshots");
const RESULTS_PATH = path.join(SHOTS_DIR, "verification-results.json");

const VIEWPORTS = {
  mobile: { width: 375, height: 812 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1440, height: 900 },
};

const PAGES = [
  { key: "home", url: "/index.html", fullPage: true },
  { key: "katalog", url: "/katalog.html", fullPage: true },
  { key: "produk", url: "/produk/kursi-minimalis-alumunium.html", fullPage: true },
  { key: "tentang", url: "/tentang.html", fullPage: true },
  { key: "kontak", url: "/kontak.html", fullPage: true },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function mark(results, section, message) {
  results.findings.push({ section, message });
  console.log(`  [finding] ${section}: ${message}`);
}

async function settleAnimations(page, options = {}) {
  const { skipScroll = false } = options;
  await page.evaluate(
    async (ss) => {
      await document.fonts?.ready?.catch?.(() => {});
      if (!ss) {
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise((r) => setTimeout(r, 350));
        window.scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 250));
      }
    },
    skipScroll
  );
  await sleep(skipScroll ? 100 : 350);
}

async function gotoPage(browser, vpName, url, results, gotoOptions = {}) {
  const ctx = await browser.newContext({ viewport: VIEWPORTS[vpName], deviceScaleFactor: 1, baseURL: "http://localhost:3111" });
  const page = await ctx.newPage();
  const logs = [];
  page.on("console", (msg) => {
    if (["error", "warning"].includes(msg.type())) logs.push(`[${msg.type()}] ${msg.text()}`);
  });
  page.on("pageerror", (err) => logs.push(`[pageerror] ${err.message}`));
  page.on("requestfailed", (req) => {
    const f = req.failure()?.errorText ?? "";
    if (!f.includes("ERR_ABORTED")) logs.push(`[requestfailed] ${req.url()} ${f}`);
  });
  await page.goto(url, { waitUntil: "networkidle", timeout: 45000 }).catch(async () => {
    await page.goto(url, { waitUntil: "load", timeout: 45000 });
  });
  await settleAnimations(page, gotoOptions);
  return { ctx, page, logs };
}

// Check whether the page has an element wider than the viewport (accidental horizontal overflow)
async function detectOverflow(page, viewportW) {
  return page.evaluate((vw) => {
    const doc = document.documentElement;
    const bodyW = Math.max(document.body.scrollWidth, doc.scrollWidth);
    const overflows = [];
    const all = document.querySelectorAll("body *");
    for (const el of all) {
      const cs = getComputedStyle(el);
      if (["fixed", "absolute", "sticky"].includes(cs.position)) continue;
      const w = el.getBoundingClientRect().width;
      if (w > vw + 1 && el.children.length === 0) {
        overflows.push({ tag: el.tagName.toLowerCase(), cls: (el.className || "").toString().slice(0, 80), w: Math.round(w) });
      }
      if (overflows.length >= 5) break;
  }
    return { bodyW, vw, docScrollW: doc.scrollWidth, overflows };
  }, viewportW);
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) throw new Error(`out/ not found — run build first: ${OUT_DIR}`);
  fs.mkdirSync(SHOTS_DIR, { recursive: true });
  const results = { findings: [], console: {}, overflow: {}, filterTest: null, formTest: null, stickyCta: null, screenshots: [] };
  const browser = await chromium.launch({ channel: "chrome", headless: true });

  const totalCombos = PAGES.length * Object.keys(VIEWPORTS).length;
  let done = 0;

  for (const [vpName, vp] of Object.entries(VIEWPORTS)) {
    console.log(`\n=== viewport ${vpName} ${vp.width}x${vp.height} ===`);
    for (const p of PAGES) {
      const { ctx, page, logs } = await gotoPage(browser, vpName, p.url, results);
      const name = `${p.key}-${vpName}-${vp.width}`;
      await page.screenshot({ path: path.join(SHOTS_DIR, `${name}.png`), fullPage: p.fullPage });
      results.screenshots.push(`screenshots/${name}.png`);
      console.log(`  shot: ${name}.png`);
      if (logs.length) results.console[name] = logs;

      // overflow check only at 375px
      if (vpName === "mobile") {
        const of = await detectOverflow(page, vp.width);
        results.overflow[name] = of;
        if (of.bodyW > of.vw + 1) mark(results, "overflow", `${name}: body width ${of.bodyW}px > viewport ${of.vw}px`);
        for (const o of of.overflows) mark(results, "overflow", `${name}: <${o.tag} class="${o.cls}"> w=${o.w}px exceeds viewport`);
      }
      await ctx.close();
      done++;
      console.log(`  (${done}/${totalCombos})`);
    }
  }

  // ---- Mobile-specific interactions (fresh contexts so navbar is at top state) ----

  // 1) Home: navbar transparent vs solid
  // Use skipScroll so the "top" screenshot captures the navbar in its true
  // initial state (transparent over the hero) instead of after settleAnimations
  // has scrolled the page up and down.
  {
    const { ctx, page } = await gotoPage(browser, "mobile", "/index.html", results, { skipScroll: true });
    await page.screenshot({ path: path.join(SHOTS_DIR, "home-mobile-375-top.png") });
    results.screenshots.push("screenshots/home-mobile-375-top.png");
    console.log("  shot: home-mobile-375-top.png");

    await page.evaluate(() => window.scrollTo(0, 100));
    await sleep(600); // navbar transition 300ms + settle
    await page.screenshot({ path: path.join(SHOTS_DIR, "home-mobile-375-scrolled.png") });
    results.screenshots.push("screenshots/home-mobile-375-scrolled.png");
    console.log("  shot: home-mobile-375-scrolled.png");
    await ctx.close();
  }

  // 2) Katalog: filter bar close-up (pills horizontal scroll, no wrap) + functional filter test
  {
    const { ctx, page } = await gotoPage(browser, "mobile", "/katalog.html", results);
    const bar = page.locator("div.sticky.top-\\[72px\\]").first();
    await bar.scrollIntoViewIfNeeded();
    await sleep(250);
    await bar.screenshot({ path: path.join(SHOTS_DIR, "katalog-mobile-375-filterbar.png") });
    results.screenshots.push("screenshots/katalog-mobile-375-filterbar.png");
    console.log("  shot: katalog-mobile-375-filterbar.png");

    // pills must not wrap: all in one row
    const pillBox = await page.evaluate(() => {
      const wrap = document.querySelector("div.sticky.top-\\[72px\\] .flex.gap-2");
      const btns = [...wrap.querySelectorAll("button")];
      return { top1: btns[0].getBoundingClientRect().top, topN: btns[btns.length - 1].getBoundingClientRect().top, count: btns.length, scrollW: wrap.scrollWidth, clientW: wrap.clientWidth };
    });
    if (Math.abs(pillBox.top1 - pillBox.topN) > 2) mark(results, "katalog", `pills WRAP into multiple rows (top ${pillBox.top1} vs ${pillBox.topN})`);
    else console.log(`  pills OK: ${pillBox.count} in one row (scrollW ${pillBox.scrollW} vs clientW ${pillBox.clientW})`);

    // functional filter test: click "Meja" pill, count visible cards, capture grid state
    const before = await page.locator("a[href^='/produk/']").count();
    await page.getByRole("button", { name: "Meja", exact: true }).click();
    await sleep(400);
    const after = await page.locator("a[href^='/produk/']").count();
    const counterText = (await page.locator("p:has-text('produk ditemukan')").first().textContent()).trim();
    results.filterTest = { before, after, counterText, pass: before > after && after === 2 && counterText.startsWith("2") };
    console.log(`  filter test: ${before} cards -> click Meja -> ${after} cards, counter "${counterText}" => ${results.filterTest.pass ? "PASS" : "FAIL"}`);
    if (!results.filterTest.pass) mark(results, "katalog", `filter test failed: ${before} -> ${after}, counter "${counterText}"`);

    const shotName = "katalog-mobile-375-filtered-meja.png";
    await page.locator("section.container-brand").first().screenshot({ path: path.join(SHOTS_DIR, shotName) });
    results.screenshots.push(`screenshots/${shotName}`);
    console.log(`  shot: ${shotName}`);
    await ctx.close();
  }

  // 3) Product page: sticky CTA at bottom of mobile viewport + ScrollToTop overlap check
  {
    const { ctx, page } = await gotoPage(browser, "mobile", "/produk/kursi-minimalis-alumunium.html", results);
    await page.evaluate(() => window.scrollTo(0, 900)); // > 500 so ScrollToTop appears
    await sleep(700);
    const geo = await page.evaluate(() => {
      const cta = document.querySelector("div.safe-bottom.fixed.inset-x-0.bottom-0");
      const st = document.querySelector("button[aria-label='Kembali ke atas']");
      const vw = window.innerWidth, vh = window.innerHeight;
      const g = (el) => (el ? (({ x, y, width, height }) => ({ x, y, width, height }))(el.getBoundingClientRect()) : null);
      const ctaG = g(cta), stG = g(st);
      let overlap = null;
      if (ctaG && stG) {
        const ox = Math.max(0, Math.min(ctaG.x + ctaG.width, stG.x + stG.width) - Math.max(ctaG.x, stG.x));
        const oy = Math.max(0, Math.min(ctaG.y + ctaG.height, stG.y + stG.height) - Math.max(ctaG.y, stG.y));
        overlap = ox * oy;
      }
      return { vw, vh, cta: ctaG, scrolltotop: stG, overlapArea: overlap, safeBottomPadding: cta ? getComputedStyle(cta).paddingBottom : null };
    });
    results.stickyCta = geo;
    if (geo.overlapArea > 0) mark(results, "produk", `ScrollToTop overlaps sticky CTA (overlap area ${geo.overlapArea.toFixed(0)}px²)`);
    if (geo.cta && geo.cta.y + geo.cta.height > geo.vh + 1) mark(results, "produk", `sticky CTA extends below viewport bottom (bottom ${geo.cta.y + geo.cta.height} > ${geo.vh})`);
    console.log(`  sticky CTA: ${JSON.stringify(geo)}`);

    await page.screenshot({ path: path.join(SHOTS_DIR, "produk-detail-mobile-375-stickycta.png") });
    results.screenshots.push("screenshots/produk-detail-mobile-375-stickycta.png");
    console.log("  shot: produk-detail-mobile-375-stickycta.png");
    await ctx.close();
  }

  // 4) Kontak: form submit with valid data, capture success state (mobile)
  {
    const { ctx, page } = await gotoPage(browser, "mobile", "/kontak.html", results);
    await page.getByPlaceholder("Nama lengkap").fill("Budi Santoso");
    await page.getByPlaceholder("nama@email.com").fill("budi@contoh.co.id");
    await page.getByPlaceholder("+62 ...").fill("+62 812 3456 7890");
    await page.getByPlaceholder("Ceritakan kebutuhan Anda...").fill("Saya ingin menawarkan 20 unit kursi aluminium untuk kantor baru kami di Bekasi. Mohon katalog dan harga grosir.");
    await page.locator("button[type=submit]").click();
    await page.getByText("Pesan terkirim!").waitFor({ timeout: 5000 });
    const shotName = "kontak-mobile-375-form-terkirim.png";
    await page.screenshot({ path: path.join(SHOTS_DIR, shotName) });
    results.screenshots.push(`screenshots/${shotName}`);
    console.log(`  shot: ${shotName}`);
    results.formTest = { pass: true, note: "Form filled with valid data, submitted, success state rendered" };
    await ctx.close();
  }

  // 5) Kontak: Google Maps embed close-up (desktop for legibility)
  {
    const { ctx, page, logs } = await gotoPage(browser, "desktop", "/kontak.html", results);
    const map = page.locator("iframe[title*='Peta lokasi']").first();
    await map.scrollIntoViewIfNeeded();
    await sleep(3500); // allow tiles to paint
    const mapName = "kontak-desktop-1440-maps-embed.png";
    await page.locator("div.overflow-hidden.rounded-2xl", { has: map }).first().screenshot({ path: path.join(SHOTS_DIR, mapName) });
    results.screenshots.push(`screenshots/${mapName}`);
    console.log(`  shot: ${mapName}`);
    // was there an iframe load error?
    const mapLogs = logs.filter((l) => l.includes("google.com/maps"));
    if (mapLogs.length) mark(results, "kontak", `maps iframe console noise: ${mapLogs.join(" | ")}`);
    await ctx.close();
  }

  // 6) Mobile menu open (bonus diagnostic for navbar hamburger)
  {
    const { ctx, page } = await gotoPage(browser, "mobile", "/index.html", results);
    await page.getByRole("button", { name: "Buka menu" }).click();
    await sleep(500);
    await page.screenshot({ path: path.join(SHOTS_DIR, "home-mobile-375-menu-open.png") });
    results.screenshots.push("screenshots/home-mobile-375-menu-open.png");
    console.log("  shot: home-mobile-375-menu-open.png");
    await ctx.close();
  }

  await browser.close();

  fs.writeFileSync(RESULTS_PATH, JSON.stringify(results, null, 2));
  const findings = results.findings;
  console.log(`\n=== DONE ===`);
  console.log(`screenshots: ${results.screenshots.length}`);
  console.log(`findings: ${findings.length}`);
  findings.forEach((f) => console.log(`  - [${f.section}] ${f.message}`));
  const consolePages = Object.entries(results.console);
  console.log(`console issues: ${consolePages.length}`);
  consolePages.forEach(([k, v]) => console.log(`  - ${k}: ${v.slice(0, 3).join(" | ")}`));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
