/* eslint-disable */
/* Find which elements poke out beyond the viewport on home @375px */
const { chromium } = require("playwright-core");

(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto("http://localhost:3111/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);

  const culprits = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const out = [];
    const all = document.querySelectorAll("body *");
    for (const el of all) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      // element extends past right edge of viewport
      if (r.right > vw + 1 || r.left < -1) {
        const cs = getComputedStyle(el);
        out.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className || "").toString().slice(0, 110),
          left: Math.round(r.left),
          right: Math.round(r.right),
          width: Math.round(r.width),
          position: cs.position,
          text: (el.textContent || "").trim().slice(0, 40),
        });
        if (out.length >= 25) break;
      }
    }
    return { vw, bodyScrollWidth: document.body.scrollWidth, docScrollWidth: document.documentElement.scrollWidth, out };
  });

  console.log(JSON.stringify(culprits, null, 2));
  await browser.close();
})();
