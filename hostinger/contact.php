<?php
/**
 * Endpoint form kontak untuk Hostinger (hosting statis + PHP).
 *
 * Frontend mem-POST JSON ke "/api/contact" (FinalCTA.tsx). Di Cloudflare
 * Pages URL itu di-handle oleh functions/api/contact.js. Di Hostinger URL
 * yang sama di-rewrite oleh .htaccess ke file ini — jadi logika di bawah
 * harus MENIRU perilaku contact.js agar responsnya identik.
 *
 * Secret dibaca dari config.php (JANGAN di-commit ke git).
 */

// only-config
$CFG = require __DIR__ . '/config.php';

$ALLOWED_ORIGINS = $CFG['allowed_origins'];

$RATE_LIMIT_MAX = 3;
$RATE_LIMIT_WINDOW_SECONDS = 600;

$NAVY = '#0B1B3A';
$BLUE = '#2563EB';
$SPARK = '#FFB020';
$PALE = '#F4F8FF';
$CANVAS = '#EAF1FF';

function corsHeaders(): array
{
    global $ALLOWED_ORIGINS;
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (in_array($origin, $ALLOWED_ORIGINS, true)) {
        return [
            'Access-Control-Allow-Origin' => $origin,
            'Access-Control-Allow-Methods' => 'POST, OPTIONS',
            'Access-Control-Allow-Headers' => 'Content-Type',
            'Access-Control-Max-Age' => '86400',
        ];
    }
    return [];
}

function sendCorsHeaders(): void
{
    foreach (corsHeaders() as $k => $v) {
        header("{$k}: {$v}");
    }
}

function jsonResponse(int $status, array $body): void
{
    http_response_code($status);
    sendCorsHeaders();
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function clientIp(): string
{
    $forwarded = $_SERVER['HTTP_CF_CONNECTING_IP']
        ?? $_SERVER['HTTP_X_FORWARDED_FOR']
        ?? '';
    if ($forwarded !== '') {
        $first = trim(explode(',', $forwarded)[0]);
        if ($first !== '') {
            return $first;
        }
    }
    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

function escapeHtml($value): string
{
    return htmlspecialchars((string)($value ?? ''), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function fieldRow(string $label, string $valueHtml, bool $accent = false): string
{
    global $NAVY, $BLUE, $PALE;
    $accentBorder = $accent ? "border-left:8px solid {$BLUE};" : '';
    return "
  <tr><td style=\"padding:0 0 16px 0;\">
    <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\">
      <tr><td align=\"left\" style=\"padding:0;\">
        <span style=\"display:inline-block;background:{$BLUE};color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;padding:4px 10px;border:2px solid {$NAVY};border-bottom:0;\">{$label}</span>
      </td></tr>
      <tr><td style=\"background:{$PALE};border:2px solid {$NAVY};{$accentBorder}padding:12px 14px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:{$NAVY};\">{$valueHtml}</td></tr>
    </table>
  </td></tr>";
}

function buildEmailHtml(string $nama, string $email, string $pesan): string
{
    global $NAVY, $BLUE, $SPARK, $PALE, $CANVAS;
    $safeNama = escapeHtml($nama);
    $safeEmail = escapeHtml($email);
    $safePesan = nl2br(escapeHtml($pesan));
    $fieldNama = fieldRow('Nama', $safeNama);
    $fieldEmail = fieldRow('Email', '<a href="mailto:' . $safeEmail . '" style="color:' . $BLUE . ';font-weight:700;text-decoration:underline;">' . $safeEmail . '</a>');
    $fieldPesan = fieldRow('Pesan', $safePesan, true);

    return '<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>Permintaan Penawaran Baru</title>
</head>
<body style="margin:0;padding:0;background:' . $CANVAS . ';">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="' . $CANVAS . '" style="background:' . $CANVAS . ';">
  <tr><td align="center" style="padding:32px 16px 44px 16px;">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;background:#FFFFFF;border:3px solid ' . $NAVY . ';box-shadow:8px 8px 0 ' . $BLUE . ';">
      <tr><td bgcolor="' . $NAVY . '" style="background:' . $NAVY . ';padding:14px 22px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td align="left" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:800;letter-spacing:2px;color:#FFFFFF;">REKAYASA MANUFAKTUR</td>
          <td align="right"><span style="display:inline-block;background:' . $SPARK . ';color:' . $NAVY . ';font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:800;letter-spacing:1.2px;padding:4px 10px;">PERMINTAAN BARU</span></td>
        </tr></table>
      </td></tr>
      <tr><td style="padding:28px 22px 30px 22px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="padding:0 0 22px 0;font-family:Arial,Helvetica,sans-serif;font-size:30px;line-height:1.1;font-weight:900;color:' . $NAVY . ';">Permintaan Penawaran Baru</td></tr>
          ' . $fieldNama . $fieldEmail . $fieldPesan . '
          <tr><td style="padding:8px 0 0 0;">
            <a href="mailto:' . $safeEmail . '" style="display:inline-block;background:' . $BLUE . ';color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:800;text-decoration:none;padding:13px 22px;border:3px solid ' . $NAVY . ';box-shadow:5px 5px 0 ' . $NAVY . ';">Balas ke ' . $safeNama . '</a>
          </td></tr>
        </table>
      </td></tr>
      <tr><td bgcolor="' . $SPARK . '" style="background:' . $SPARK . ';border-top:3px solid ' . $NAVY . ';padding:12px 22px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;color:' . $NAVY . ';">
        Dikirim otomatis dari form kontak rekayasa-manufaktur.com
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>';
}

function readConfig($CFG, string $key): ?string
{
    $v = $CFG[$key] ?? '';
    return $v === '' ? null : (string)$v;
}

function rateLimitAllow(string $ip): bool
{
    global $RATE_LIMIT_MAX, $RATE_LIMIT_WINDOW_SECONDS;
    $tmp = sys_get_temp_dir();
    $file = rtrim($tmp, '/\\') . DIRECTORY_SEPARATOR . 'rmk_' . md5($ip) . '.lock';

    $count = 0;
    $now = time();
    if (is_file($file)) {
        $raw = @file_get_contents($file);
        $data = json_decode((string)$raw, true);
        if (is_array($data) && isset($data['c'], $data['t'])) {
            if ($now - (int)$data['t'] >= $RATE_LIMIT_WINDOW_SECONDS) {
                $count = 0;
            } else {
                $count = (int)$data['c'];
            }
        }
    }

    if ($count >= $RATE_LIMIT_MAX) {
        return false;
    }

    @file_put_contents(
        $file,
        json_encode(['c' => $count + 1, 't' => $now]),
        LOCK_EX
    );
    return true;
}

sendCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'OPTIONS') {
    http_response_code(204);
    header('Allow: POST, OPTIONS');
    sendCorsHeaders();
    exit;
}

if ($method !== 'POST') {
    jsonResponse(405, ['success' => false, 'message' => 'Method Not Allowed.']);
}

$rawBody = file_get_contents('php://input');
$body = json_decode((string)$rawBody, true);
if (!is_array($body)) {
    jsonResponse(400, ['success' => false, 'message' => 'Bad request: body JSON tidak valid.']);
}

$nama = isset($body['nama']) && is_string($body['nama']) ? trim($body['nama']) : '';
$email = isset($body['email']) && is_string($body['email']) ? trim($body['email']) : '';
$pesan = isset($body['pesan']) && is_string($body['pesan']) ? trim($body['pesan']) : '';
$turnstileToken = isset($body['turnstileToken']) && is_string($body['turnstileToken'])
    ? trim($body['turnstileToken'])
    : '';

$missing = [];
if ($nama === '') $missing[] = 'nama';
if ($email === '') $missing[] = 'email';
if ($pesan === '') $missing[] = 'pesan';
if (count($missing) > 0) {
    jsonResponse(400, [
        'success' => false,
        'message' => 'Kolom wajib belum diisi: ' . implode(', ', $missing) . '.',
    ]);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(400, ['success' => false, 'message' => 'Format email tidak valid.']);
}

$turnstileSecret = readConfig($CFG, 'TURNSTILE_SECRET_KEY');
if ($turnstileSecret === null) {
    error_log('[contact] TURNSTILE_SECRET_KEY belum diset.');
    jsonResponse(500, ['success' => false, 'message' => 'Konfigurasi keamanan di server belum lengkap.']);
}

if ($turnstileToken === '' || mb_strlen($turnstileToken) > 2048) {
    jsonResponse(403, [
        'success' => false,
        'message' => 'Verifikasi keamanan gagal. Muat ulang halaman dan coba lagi.',
    ]);
}

$remoteip = clientIp();

$ch = curl_init('https://challenges.cloudflare.com/turnstile/v0/siteverify');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => http_build_query([
        'secret' => $turnstileSecret,
        'response' => $turnstileToken,
        'remoteip' => $remoteip,
    ]),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
]);
$verifyRaw = curl_exec($ch);
$curlErr = curl_error($ch);
curl_close($ch);

if ($verifyRaw === false) {
    error_log('[contact] Turnstile siteverify curl error: ' . $curlErr);
    jsonResponse(403, ['success' => false, 'message' => 'Verifikasi keamanan gagal. Silakan coba lagi.']);
}
$verify = json_decode($verifyRaw, true);
if (!is_array($verify) || ($verify['success'] ?? false) !== true) {
    error_log('[contact] Turnstile siteverify menolak token.');
    jsonResponse(403, ['success' => false, 'message' => 'Verifikasi keamanan gagal. Silakan coba lagi.']);
}

if (!rateLimitAllow($remoteip)) {
    jsonResponse(429, ['success' => false, 'message' => 'Terlalu banyak percobaan, coba lagi nanti.']);
}

$resendApiKey = readConfig($CFG, 'RESEND_API_KEY');
$recipientEmail = readConfig($CFG, 'RECIPIENT_EMAIL');

if ($resendApiKey === null) {
    error_log('[contact] RESEND_API_KEY belum diset.');
    jsonResponse(500, ['success' => false, 'message' => 'Konfigurasi pengiriman email di server belum lengkap.']);
}
if ($recipientEmail === null) {
    error_log('[contact] RECIPIENT_EMAIL belum diset.');
    jsonResponse(500, ['success' => false, 'message' => 'Konfigurasi penerima email di server belum lengkap.']);
}

$cleanNama = preg_replace('/[\r\n]+/', ' ', $nama);
$cleanNama = trim((string)$cleanNama);

$html = buildEmailHtml($nama, $email, $pesan);
$text = "Permintaan Penawaran Baru\n\nNama: {$nama}\nEmail: {$email}\nPesan: {$pesan}\n\nDikirim otomatis dari form kontak rekayasa-manufaktur.com";

$payload = json_encode([
    'from' => 'Rekayasa Manufaktur <onboarding@resend.dev>',
    'to' => $recipientEmail,
    'subject' => 'Permintaan Penawaran Baru dari ' . $cleanNama,
    'reply_to' => $email,
    'html' => $html,
    'text' => $text,
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

$ch = curl_init('https://api.resend.com/emails');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 15,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $resendApiKey,
        'Content-Type: application/json',
    ],
]);
$resendRaw = curl_exec($ch);
$resendErr = curl_error($ch);
$resendStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($resendRaw === false || (int)$resendStatus >= 400) {
    error_log('[contact] Resend HTTP ' . $resendStatus . ': ' . $resendErr . ' ' . substr((string)$resendRaw, 0, 200));
    jsonResponse(500, ['success' => false, 'message' => 'Gagal mengirim email. Silakan coba lagi nanti.']);
}

$resendJson = json_decode((string)$resendRaw, true);
jsonResponse(200, [
    'success' => true,
    'message' => 'Terima kasih, kami akan segera menghubungi Anda.',
    'id' => $resendJson['id'] ?? null,
]);