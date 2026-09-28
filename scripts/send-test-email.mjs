import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

function parseDotDevVars() {
  const raw = readFileSync(join(root, ".dev.vars"), "utf8");
  const vars = {};
  for (const line of raw.split("\n")) {
    const m = line.replace(/\r$/, "").match(/^([A-Z_]+)=(.*)$/);
    if (m) vars[m[1]] = m[2].trim();
  }
  return vars;
}

const env = parseDotDevVars();
const apiKey = env.RESEND_API_KEY;
const recipient = env.RECIPIENT_EMAIL;
if (!apiKey || !recipient) {
  throw new Error("RESEND_API_KEY / RECIPIENT_EMAIL tidak ada di .dev.vars");
}

const source = readFileSync(join(root, "functions", "api", "contact.js"), "utf8");
const start = source.indexOf("const NAVY =");
const end = source.indexOf("export async function onRequestOptions");
if (start < 0 || end < 0) {
  throw new Error("template block tidak ditemukan di contact.js");
}
const block = source.slice(start, end);
const factory = new Function(`${block}\nreturn { buildEmailHtml };`);
const { buildEmailHtml } = factory();

const nama = "Budi Santoso";
const email = "budi@example.com";
const pesan = "Halo, saya ingin meminta penawaran untuk kursi stainless steel.";
const cleanNama = nama.replace(/[\r\n]+/g, " ").trim();

const body = {
  from: "Rekayasa Manufaktur <onboarding@resend.dev>",
  to: recipient,
  subject: `Permintaan Penawaran Baru dari ${cleanNama}`,
  reply_to: email,
  html: buildEmailHtml({ nama, email, pesan }),
  text: `Permintaan Penawaran Baru\n\nNama: ${nama}\nEmail: ${email}\nPesan: ${pesan}\n\nDikirim otomatis dari form kontak rekayasamanufaktur.id`,
};

const res = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

const result = await res.json();
console.log("HTTP", res.status);
if (res.ok) {
  console.log("Email tes terkirim, id:", result.id);
} else {
  console.log("Gagal:", JSON.stringify(result));
  process.exit(1);
}