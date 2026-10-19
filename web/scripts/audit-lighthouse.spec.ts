/**
 * Lighthouse audit via Playwright (gratis, npx).
 * Jalankan: npx playwright test web/scripts/audit-lighthouse.spec.ts
 * atau secara manual: npx playwright test web/scripts/audit-lighthouse.spec.ts --headed
 */

import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

const SCREENSHOT_DIR = path.join(process.cwd(), "web", "screenshots-audit");
const LH_DIR = path.join(process.cwd(), "web", "lh-results");

const VIEWPORTS = [
  { name: "360", width: 360, height: 800 },
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1280", width: 1280, height: 900 },
  { name: "1440", width: 1440, height: 900 },
];

const PAGES = [
  { name: "home", url: process.env.BASE_URL || "http://localhost:3000/" },
  {
    name: "product",
    url: process.env.BASE_URL
      ? `${process.env.BASE_URL}/produk/meja-guru`
      : "http://localhost:3000/produk/meja-guru",
  },
];

test.beforeEach(() => {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  fs.mkdirSync(LH_DIR, { recursive: true });
});

for (const page of PAGES) {
  for (const vp of VIEWPORTS) {
    test(`screenshot ${page.name} @ ${vp.width}px`, async ({ page: pwPage }) => {
      await pwPage.setViewportSize({ width: vp.width, height: vp.height });
      await pwPage.goto(page.url, { waitUntil: "networkidle", timeout: 45000 });
      await pwPage.waitForTimeout(500);

      await pwPage.screenshot({
        path: path.join(
          SCREENSHOT_DIR,
          `${page.name}-${vp.width}px.png`
        ),
        fullPage: true,
      });

      const { scrollWidth, innerWidth } = await pwPage.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }));

      const overflow = scrollWidth > innerWidth + 1;
      expect(overflow).toBe(false);
    });
  }
}

test("tap targets >= 44px on home", async ({ page: pwPage }) => {
  await pwPage.goto(PAGES[0].url, { waitUntil: "networkidle", timeout: 45000 });
  await pwPage.waitForTimeout(500);

  const targets = await pwPage.evaluate(() => {
    const els = document.querySelectorAll(
      'a[href], button:not([disabled]), input, textarea, select'
    );
    const items: { label: string; height: number; width: number }[] = [];
    els.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const h = rect.height;
      const w = rect.width;
      if (h >= 44 || w >= 44) return;
      const label =
        (el.getAttribute("aria-label") ||
          (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement
            ? el.getAttribute("placeholder") || el.name
            : "") ||
          el.textContent?.trim().slice(0, 40) ||
          "") as string;
      items.push({ label, height: Math.round(h), width: Math.round(w) });
    });
    return items;
  });

  console.log("Tap targets < 44px:", JSON.stringify(targets, null, 2));
  expect(targets.length).toBe(0);
});
