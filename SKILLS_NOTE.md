# Catatan Skill — Proyek Rekayasa Manufaktur (Landing Page)

Tanggal: 2026-09-11

Proyek ini sekarang murni **landing page satu halaman** (Next.js 15 + Tailwind v4 + Three.js / React Three Fiber).
Semua folder skill (`.opencode/skills`, `.claude/skills`, `.agents/skills`) sengaja DIKECUALIKAN dari pembersihan —
yang dihapus hanya dokumen/artefak lama (setup/PRD/session docs, `web.zip`, `screenshots.zip`, `screenshots/`, `agent/`, dll).
`agent/` juga dihapus karena duplikat mirror dari `.agents/skills`.

Catatan berikut mendaftar skill yang **tidak dipakai** untuk landing page ini, lokasinya, dan alasannya.

## Skill yang dipakai / relevan untuk proyek ini

| Direktori | Skill |
|---|---|
| `.opencode/skills` | `design`, `ui-ux-pro-max`, `ui-styling`, `design-system`, `brand` |
| `.claude/skills` = `.agents/skills` (mirror) | `design-taste-frontend`, `full-output-enforcement`, `high-end-visual-design`, `minimalist-ui`, `industrial-brutalist-ui`, `imagegen-frontend-web` |

## Skill TIDAK dipakai

### `.opencode/skills`
| Skill | Alasan tidak dipakai |
|---|---|
| `banner-design` | Untuk banner sosial/ads/print; landing page ini tidak punya kebutuhan banner. Berisi sebagai aksi dari skill `design` juga, jadi redundant. |
| `slides` | Membuat presentasi HTML (Chart.js); tidak dibutuhkan. |

### `.claude/skills` & `.agents/skills` (dua folder identik/mirror — cek keduanya)
Skill engineering/workflow ini mengasumsikan repo dengan test suite, issue tracker, arsitektur multi-module, atau alur PR — tidak ada di landing page statis ini:

| Skill | Alasan tidak dipakai |
|---|---|
| `ask-matt` | Router eksplorasi skill; alur kerja sudah menetap. |
| `claude-handoff`, `handoff` | Serah-terima sesi antar agen; pengerjaan langsung satu sesi. |
| `code-review` | Review branch/PR; tidak ada alur PR. |
| `codebase-design` | Desain deep-module/interface; satu halaman, tak berarti. |
| `diagnosing-bugs` | Tidak ada bug sistemik yang butuh loop diagnostik. |
| `domain-modeling` | Dokumentasi terminology/ADR; tidak dibutuhkan. |
| `git-guardrails-claude-code` | Hook git safety untuk Claude Code; tool aktif adalah opencode. |
| `grilling`, `grill-me`, `grill-with-docs`, `loop-me` | Interview/pengasahan rencana; brief landing sudah final. |
| `implement`, `implement-spec`, `to-questionnaire`, `to-spec`, `to-tickets`, `triage`, `wayfinder`, `wizard` | Alur issue-tracker/tiket/provisioning; tidak ada tracker. |
| `improve-codebase-architecture` | Audit arsitektur; kode landing sederhana. |
| `migrate-to-shoehorn` | Migrasi `as`-assertion di test TS; tidak ada test. |
| `research` | Riset sumber primer; tidak diminta. |
| `resolving-merge-conflicts` | Belum ada konflik merge. |
| `retro` | Retrospektif sesi; tidak diminta. |
| `scaffold-exercises` | Latihan terstruktur; bukan kebutuhan landing. |
| `setup-matt-pocock-skills` | Setup repo engineering skills/tracker; tidak dipakai. |
| `setup-pre-commit` | Husky/lint-staged; tanpa flow commit terstruktur. |
| `setup-ts-deep-modules` | dependency-cruiser + deep modules; tidak perlu. |
| `tdd` | Test-first; tidak ada test suite. |
| `teach` | Pengajaran; tidak diminta. |
| `wait-what` | Ulang-pitch ide; tidak dibutuhkan. |
| `writing-beats`, `writing-fragments`, `writing-shape` | Menulis artikel/eksplorasi naskah; konten landing sudah ditulis. |
| `writing-for-agents` | Mengedit skill/AGENTS.md; skill tidak diedit. |
| `brandkit` | Produksi brand kit/identity deck; identitas visual sudah ada. |
| `imagegen-frontend-mobile` | Mockup aplikasi mobile; ini web, bukan app. |
| `image-to-code` | Konversi screenshot → kode; desain langsung diimplementasi. |

## Cadangan (belum dipakai, tapi berguna nanti untuk proyek ini)
Skill berikut tidak dipakai saat ini tetapi masih relevan untuk pengembangan lanjutan, jadi tidak dilabeli "tidak dipakai":

- `gpt-taste` — motion GSAP level lanjut (landing saat ini memakai ScrollTrigger dasar langsung).
- `redesign-existing-projects` — jika ingin audit & upgrade kualitas tampilan sekali lagi.