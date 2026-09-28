const ALLOWED_ORIGINS = new Set([
  "https://rekayasamanufaktur.id",
  "https://rekayasa-manufaktur.pages.dev",
  "http://localhost:8788",
  "http://127.0.0.1:8788",
]);

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_SECONDS = 600;

const NAVY = "#0B1B3A";
const BLUE = "#2563EB";
const SPARK = "#FFB020";
const PALE = "#F4F8FF";
const CANVAS = "#EAF1FF";

function corsHeaders(request) {
  const origin = request.headers.get("Origin");
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    };
  }
  return {};
}

function json(status, body, request) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(request),
    },
  });
}

function clientIp(request) {
  const cfIp = request.headers.get("CF-Connecting-IP");
  if (cfIp) {
    return cfIp.trim();
  }
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0].trim();
    if (first) {
      return first;
    }
  }
  return "unknown";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function fieldRow(label, valueHtml, accent = false) {
  return `
  <tr><td style="padding:0 0 16px 0;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr><td align="left" style="padding:0;">
        <span style="display:inline-block;background:${BLUE};color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;padding:4px 10px;border:2px solid ${NAVY};border-bottom:0;">${label}</span>
      </td></tr>
      <tr><td style="background:${PALE};border:2px solid ${NAVY};${accent ? `border-left:8px solid ${BLUE};` : ""}padding:12px 14px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:${NAVY};">${valueHtml}</td></tr>
    </table>
  </td></tr>`;
}

function buildEmailHtml({ nama, email, pesan }) {
  const safeNama = escapeHtml(nama);
  const safeEmail = escapeHtml(email);
  const safePesan = escapeHtml(pesan).replace(/\r?\n/g, "<br>");

  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>Permintaan Penawaran Baru</title>
</head>
<body style="margin:0;padding:0;background:${CANVAS};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${CANVAS}" style="background:${CANVAS};">
  <tr><td align="center" style="padding:32px 16px 44px 16px;">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;background:#FFFFFF;border:3px solid ${NAVY};box-shadow:8px 8px 0 ${BLUE};">
      <tr><td bgcolor="${NAVY}" style="background:${NAVY};padding:14px 22px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td align="left" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:800;letter-spacing:2px;color:#FFFFFF;">REKAYASA MANUFAKTUR</td>
          <td align="right"><span style="display:inline-block;background:${SPARK};color:${NAVY};font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:800;letter-spacing:1.2px;padding:4px 10px;">PERMINTAAN BARU</span></td>
        </tr></table>
      </td></tr>
      <tr><td style="padding:28px 22px 30px 22px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="padding:0 0 22px 0;font-family:Arial,Helvetica,sans-serif;font-size:30px;line-height:1.1;font-weight:900;color:${NAVY};">Permintaan Penawaran Baru</td></tr>
          ${fieldRow("Nama", safeNama)}
          ${fieldRow("Email", `<a href="mailto:${safeEmail}" style="color:${BLUE};font-weight:700;text-decoration:underline;">${safeEmail}</a>`)}
          ${fieldRow("Pesan", safePesan, true)}
          <tr><td style="padding:8px 0 0 0;">
            <a href="mailto:${safeEmail}" style="display:inline-block;background:${BLUE};color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:800;text-decoration:none;padding:13px 22px;border:3px solid ${NAVY};box-shadow:5px 5px 0 ${NAVY};">Balas ke ${safeNama}</a>
          </td></tr>
        </table>
      </td></tr>
      <tr><td bgcolor="${SPARK}" style="background:${SPARK};border-top:3px solid ${NAVY};padding:12px 22px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;color:${NAVY};">
        Dikirim otomatis dari form kontak rekayasamanufaktur.id
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

export async function onRequestOptions(context) {
  return new Response(null, {
    status: 204,
    headers: {
      Allow: "POST, OPTIONS",
      ...corsHeaders(context.request),
    },
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return json(400, { success: false, message: "Bad request: body JSON tidak valid." }, request);
    }

    const nama = typeof body.nama === "string" ? body.nama.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const pesan = typeof body.pesan === "string" ? body.pesan.trim() : "";
    const turnstileToken =
      typeof body.turnstileToken === "string" ? body.turnstileToken.trim() : "";

    const missing = [];
    if (!nama) missing.push("nama");
    if (!email) missing.push("email");
    if (!pesan) missing.push("pesan");
    if (missing.length > 0) {
      return json(
        400,
        { success: false, message: `Kolom wajib belum diisi: ${missing.join(", ")}.` },
        request
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json(400, { success: false, message: "Format email tidak valid." }, request);
    }

    if (!env.TURNSTILE_SECRET_KEY) {
      console.error("[contact] TURNSTILE_SECRET_KEY belum diset.");
      return json(
        500,
        { success: false, message: "Konfigurasi keamanan di server belum lengkap." },
        request
      );
    }
    if (!turnstileToken || turnstileToken.length > 2048) {
      return json(
        403,
        { success: false, message: "Verifikasi keamanan gagal. Muat ulang halaman dan coba lagi." },
        request
      );
    }

    const remoteip = clientIp(request);
    let verifyResult;
    try {
      const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: env.TURNSTILE_SECRET_KEY,
          response: turnstileToken,
          remoteip,
        }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) {
        throw new Error(`siteverify HTTP ${res.status}`);
      }
      verifyResult = await res.json();
    } catch (err) {
      console.error("[contact] Turnstile siteverify error:", err);
      return json(
        403,
        { success: false, message: "Verifikasi keamanan gagal. Silakan coba lagi." },
        request
      );
    }
    if (verifyResult.success !== true) {
      return json(
        403,
        { success: false, message: "Verifikasi keamanan gagal. Silakan coba lagi." },
        request
      );
    }

    if (!env.RATE_LIMIT) {
      console.error("[contact] Binding KV RATE_LIMIT tidak terpasang.");
      return json(
        500,
        { success: false, message: "Konfigurasi server belum lengkap." },
        request
      );
    }

    const key = `ratelimit:${remoteip}`;
    try {
      const currentRaw = await env.RATE_LIMIT.get(key);
      const current = Number.parseInt(currentRaw, 10) || 0;
      if (current >= RATE_LIMIT_MAX) {
        return json(
          429,
          { success: false, message: "Terlalu banyak percobaan, coba lagi nanti." },
          request
        );
      }
      await env.RATE_LIMIT.put(key, String(current + 1), {
        expirationTtl: RATE_LIMIT_WINDOW_SECONDS,
      });
    } catch (err) {
      console.error("[contact] RATE_LIMIT KV error:", err);
      return json(
        500,
        { success: false, message: "Terjadi kesalahan pada server. Silakan coba lagi." },
        request
      );
    }

    if (!env.RESEND_API_KEY) {
      console.error("[contact] RESEND_API_KEY belum diset.");
      return json(
        500,
        { success: false, message: "Konfigurasi pengiriman email di server belum lengkap." },
        request
      );
    }
    if (!env.RECIPIENT_EMAIL) {
      console.error("[contact] RECIPIENT_EMAIL belum diset.");
      return json(
        500,
        { success: false, message: "Konfigurasi penerima email di server belum lengkap." },
        request
      );
    }

    const cleanNama = nama.replace(/[\r\n]+/g, " ").trim();

    const html = buildEmailHtml({ nama, email, pesan });
    const text = `Permintaan Penawaran Baru\n\nNama: ${nama}\nEmail: ${email}\nPesan: ${pesan}\n\nDikirim otomatis dari form kontak rekayasamanufaktur.id`;

    let resendResult;
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Rekayasa Manufaktur <onboarding@resend.dev>",
          to: env.RECIPIENT_EMAIL,
          subject: `Permintaan Penawaran Baru dari ${cleanNama}`,
          reply_to: email,
          html,
          text,
        }),
        signal: AbortSignal.timeout(15_000),
      });
      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        console.error(`[contact] Resend HTTP ${res.status}:`, errText.slice(0, 200));
        return json(
          500,
          { success: false, message: "Gagal mengirim email. Silakan coba lagi nanti." },
          request
        );
      }
      resendResult = await res.json();
    } catch (err) {
      console.error("[contact] Resend error:", err);
      return json(
        500,
        { success: false, message: "Gagal mengirim email. Silakan coba lagi nanti." },
        request
      );
    }

    return json(
      200,
      { success: true, message: "Terima kasih, kami akan segera menghubungi Anda.", id: resendResult?.id ?? null },
      request
    );
  } catch (err) {
    console.error("[contact] Unhandled error:", err);
    return json(
      500,
      { success: false, message: "Terjadi kesalahan pada server. Silakan coba lagi." },
      request
    );
  }
}