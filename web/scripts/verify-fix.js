/* eslint-disable */
/**
 * Focused re-audit after horizontal-overflow fix:
 * 1. "/" @375px  -> body/document scrollWidth must equal innerWidth (375)
 * 2. ScrollReveal animation must still run (transform x: -30 -> 0 when scrolled into view)
 * 3. "/tentang" @375px -> same overflow check (uses from="left"/"right" too)
 * 4. "/katalog" @375px -> sticky filter bar still sticks (regression check for overflow-x: clip)
 * Re-screenshots: home-mobile-375.png, tentang-mobile-375.png
 * Run: node scripts/verify-fix.js
 */
const path = require("path");
const fs = require("fs");
const { chromium } = require("playwright-core");

const SHOTS_DIR = path.resolve(__dirname, "..", "..", "screenshots");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function measureOverflow(page) {
  return page.evaluate(() => {
    const settle = () => {};
    return {
      innerWidth: window.innerWidth,
      bodyScrollWidth: document.body.scrollWidth,
      docScrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    };
  });
}

async function main() {
  fs.mkdirSync(SHOTS_DIR, { recursive: true });
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const out = {};

  // ---------- 1) HOME @375px: overflow + animation still works ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const page = await ctx.newPage();
    await page.goto("http://localhost:3111/", { waitUntil: "networkidle", timeout: 45000 });
    await page.evaluate(async () => {
      await document.fonts?.ready?.catch?.(() => {});
    });
    await sleep(500);

    out.home = { before_scroll: await measureOverflow(page) };

    // ScrollReveal regression check: (a) on FRESH load the two Craftsmanship
    // wrappers must be armed at x=-30 / x=+30; (b) after scrolling through the
    // whole page, both must have animated to identity (x=0). Per-element triggers
    // (start "top 85%") mean each reveals when IT enters the viewport.
    out.home.scrollReveal = await page.evaluate(async () => {
      const section = [...document.querySelectorAll("section")].find((s) =>
        s.textContent.includes("Proses Manufaktur")
      );
      const getXs = () =>
        [...section.querySelectorAll("*")]
          .map((el) => {
            const t = getComputedStyle(el).transform;
            if (!t || t === "none" || t === "matrix(1, 0, 0, 1, 0, 0)") return null;
            return { cls: (el.className || "").toString().slice(0, 50), x: Math.round(new DOMMatrixReadOnly(t).m41) };
          })
          .filter(Boolean);
      const before = getXs(); // page at top, section below fold -> x=-30 / x=+30
      window.scrollTo(0, document.body.scrollHeight); // fire every ScrollTrigger
      await new Promise((r) => setTimeout(r, 1500)); // let 0.7s tweens finish
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 300));
      const after = getXs(); // all revealed -> identity -> empty list
      return {
        elementsAtFreshLoad: before,
        elementsAfterFullScroll: after,
        animated: before.length >= 2 && before.every((e) => e.x !== 0) && after.length === 0,
      };
    });

    await page.evaluate(async () => {
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 400));
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 400));
    });
    await sleep(400);
    out.home.after_scroll = await measureOverflow(page);

    await page.screenshot({ path: path.join(SHOTS_DIR, "home-mobile-375.png"), fullPage: true });

    await ctx.close();
  }

  // ---------- 2) TENTANG @375px: overflow check ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const page = await ctx.newPage();
    await page.goto("http://localhost:3111/tentang", { waitUntil: "networkidle", timeout: 45000 });
    await sleep(500);
    await page.evaluate(async () => {
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 400));
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 400));
    });
    await sleep(300);
    out.tentang = { after_scroll: await measureOverflow(page) };
    await page.screenshot({ path: path.join(SHOTS_DIR, "tentang-mobile-375.png"), fullPage: true });
    await ctx.close();
  }

  // ---------- 3) KATALOG @375px: sticky filter bar still sticks ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 872 } });
    const page = await ctx.newPage();
    await page.goto("http://localhost:3111/katalog", { waitUntil: "networkidle", timeout: 45000 });
    await sleep(500);
    out.katalog = await page.evaluate(async () => {
      const bar = document.querySelector("div.sticky.top-\\[72px\\]");
      const before = bar.getBoundingClientRect().top;
      window.scrollTo(0, 800);
      await new Promise((r) => setTimeout(r, 500));
      const after = bar.getBoundingClientRect().top;
      return {
        barTop_atPageTop: Math.round(before),
        barTop_afterScroll800: Math.round(after),
        stillSticky: after === 72, // pinned right below the 72px navbar
        pageScrollWidth: document.documentElement.scrollWidth,
      };
    });
    await ctx.close();
  }

  // ---------- 4) PNG actual pixel width check ----------
  const pngW = (p) => {
    const b = fs.readFileSync(p);
    return b.readUInt32BE(16); // IHDR width
  };
  out.pngWidths = {
    "home-mobile-375.png": pngW(path.join(SHOTS_DIR, "home-mobile-375.png")),
    "tentang-mobile-375.png": pngW(path.join(SHOTS_DIR, "tentang-mobile-375.png")),
  };

  await browser.close();

  fs.writeFileSync(path.join(SHOTS_DIR, "verify-fix-results.json"), JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out, null, 2));

  const checks = [
    ["home scrollWidth==375 (after full-page scroll)", out.home.after_scroll.docScrollWidth === 375],
    ["tentang scrollWidth==375", out.tentang.after_scroll.docScrollWidth === 375],
    ["ScrollReveal still animates (x: -30 -> 0)", out.home.scrollReveal.animated === true],
    ["katalog sticky bar still sticks at top:72px", out.katalog.stillSticky === true],
    ["home-mobile-375.png is exactly 375px wide", out.pngWidths["home-mobile-375.png"] === 375],
  ];
  console.log("\n=== VERDICT ===");
  checks.forEach(([label, ok]) => console.log(`${ok ? "PASS" : "FAIL"}  ${label}`));
  if (checks.some(([, ok]) => !ok)) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
