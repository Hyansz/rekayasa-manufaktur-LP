<?php
/**
 * KONFIGURASI endpoint form kontak Hostinger.
 *
 * 1. Salin file ini menjadi config.php
 * 2. Isi nilai rahasia (JANGAN commit config.php ke git — sudah di-ignore)
 *
 * Nilai bisa diambil & harus SAMA DENGAN secret di Cloudflare Pages:
 *   - TURNSTILE_SECRET_KEY  = "Secret Key" widget Turnstile (challenges.cloudflare.com)
 *   - RESEND_API_KEY        = API Key Resend     (resend.com/api-keys)
 *   - RECIPIENT_EMAIL       = alamat tujuan email form
 *
 * allowed_origins: origin yang boleh memanggil endpoint (kunci CORS).
 *   Untuk tahap localhost/domain uji, tambahkan:
 *   "http://localhost:8788", "http://127.0.0.1:8788"
 */

return [
    'TURNSTILE_SECRET_KEY' => 'ISI_TURNSTILE_SECRET_KEY',

    'RESEND_API_KEY' => 'ISI_RESEND_API_KEY',

    'RECIPIENT_EMAIL' => 'entrijm@gmail.com',

    'allowed_origins' => [
        'https://rekayasa-manufaktur.com',
        'https://rekayasa-manufaktur.pages.dev',
    ],
];