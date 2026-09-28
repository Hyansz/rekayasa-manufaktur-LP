import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const source = readFileSync(join(root, "functions", "api", "contact.js"), "utf8");

const start = source.indexOf("const NAVY =");
const end = source.indexOf("export async function onRequestOptions");
if (start < 0 || end < 0) {
  throw new Error("template block tidak ditemukan di contact.js");
}

const block = source.slice(start, end);
const factory = new Function(`${block}\nreturn { buildEmailHtml };`);
const { buildEmailHtml } = factory();

const samples = [
  {
    label: "normal",
    nama: "Budi Santoso",
    email: "budi@example.com",
    pesan: "Halo, saya ingin penawaran untuk kursi stainless.\nBisa kirim katalog?",
  },
  {
    label: "xss",
    nama: "<script>alert(1)</script>",
    email: "xss@example.com",
    pesan: "aman <img src=x onerror=alert(2)>",
  },
];

const outputParts = [];
for (const s of samples) {
  const html = buildEmailHtml({ nama: s.nama, email: s.email, pesan: s.pesan });
  const escaped = !html.includes("<script>alert(1)</script>")
    && !html.includes("<img src=x onerror=")
    && html.includes("&lt;script&gt;alert(1)&lt;/script&gt;")
    && html.includes("&lt;img src=x onerror=");
  outputParts.push(`<!-- ===== SAMPLE: ${s.label} ===== -->\n${html}`);

  const label = ["Nama", "Email", "Pesan", "REKAYASA MANUFAKTUR"].every((k) => html.includes(k))
    ? "all-fields-ok"
    : "missing-field";
  console.log(`[${s.label}] escaped=${escaped} ${label} length=${html.length}`);
}

writeFileSync(join(root, "email-preview.html"), outputParts.join("\n\n"), "utf8");
console.log("email-preview.html ditulis");