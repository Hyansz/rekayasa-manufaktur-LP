This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Form kontak (Cloudflare Pages Functions + Turnstile + KV + Resend)

Form kontak di `components/sections/FinalCTA.tsx` mengirim POST ke `functions/api/contact.js`
(dirih root repo, otomatis di-route Cloudflare Pages ke `/api/contact` — **bukan** Next.js API
route, karena project ini static export).

### Environment variables — WAJIB di-set manual di dashboard Cloudflare Pages

Buka **Cloudflare Dashboard → Workers & Pages → projekt `rekayasa-manufaktur` →
Settings → Environment variables**, lalu set di tab Production **dan** Preview:

| Variabel | Tipe | Catatan |
| --- | --- | --- |
| `TURNSTILE_SECRET_KEY` | Secret | Rahasia, diambil dari **dashboard Cloudflare → Turnstile** (widget "Rekayasa Manufaktur Contact", sitekey `0x4AAAAAAFC4JaB9XzaxhrNe`). JANGAN hardcode di kode. |
| `RESEND_API_KEY` | Secret | Dari [resend.com](https://resend.com) → API Keys. JANGAN hardcode di kode. |
| `RECIPIENT_EMAIL` | Plain text | Alamat email penerima pemberitahuan penawaran, mis. `hello@rekayasamanufaktur.id`. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Plain text | **Wajib ada saat `next build`** — dipakai frontend untuk render widget. Sitekey `0x4AAAAAAFC4JaB9XzaxhrNe`. |

Catatan:
- KV namespace `RATE_LIMIT` sudah dibinding lewat `wrangler.toml` (id
  `9fa6bfe8d84e4a0a8b38b0ac8d9c5681`). Rate limit = 3 kiriman / 10 menit per IP.
- `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, `RECIPIENT_EMAIL` juga bisa di-set
  melalui `wrangler pages secret <nama> --project-name rekayasa-manufaktur`
  (masuk via stdin).
- Kode function membaca env dari binding `env.*`, jadi nilai harus ada di
  dashboard (atau `.dev.vars` saat `wrangler pages dev` lokal), bukan di kode.
