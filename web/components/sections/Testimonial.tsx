"use client";

import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Rudi Mulyono",
    quote:
      "Presisi hasil CNC-nya konsisten dari batch pertama sampai terakhir. Kami sudah repeat order 3 kali dan kualitasnya tidak pernah turun.",
  },
  {
    name: "Siti Nurhaliza",
    quote:
      "Timeline produksi selalu tepat waktu sesuai yang dijanjikan di awal. Tim engineering-nya juga responsif kalau ada revisi desain mendadak.",
  },
  {
    name: "Bambang Setiawan",
    quote:
      "Finishing powder coating-nya rapi dan tahan lama, sudah 2 tahun dipasang di proyek klien belum ada yang komplain soal karat.",
  },
  {
    name: "Dewi Kartika",
    quote:
      "Toleransi ±0.1mm-nya benar-benar akurat, jadi waktu perakitan di lokasi klien jauh lebih cepat karena semua part pas tanpa perlu dipaksa.",
  },
  {
    name: "Ahmad Fauzi",
    quote:
      "Komunikasinya enak, setiap progress produksi selalu diinfokan. Buat kami yang order dari luar kota ini penting banget.",
  },
  {
    name: "Linda Wijaya",
    quote:
      "Harga kompetitif tapi kualitas pengelasannya rapat dan halus, jarang ketemu vendor lokal yang konsisten seperti ini.",
  },
  {
    name: "Hendra Gunawan",
    quote:
      "Custom ukuran sesuai kebutuhan lapangan bisa dipenuhi tanpa drama. Tim mereka paham kondisi real proyek, bukan cuma ikut spek kertas.",
  },
  {
    name: "Maya Puspita",
    quote:
      "Garansi 5 tahunnya bikin tenang. Sudah pernah klaim sekali karena baut kendor, prosesnya cepat dan tidak ribet.",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

const avatarColors = [
  "bg-rose-100 text-rose-700",
  "bg-blue-100 text-blue-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
  "bg-cyan-100 text-cyan-700",
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
];

export default function Testimonials() {
  const loopItems = [...testimonials, ...testimonials];

  return (
    <section id="testimoni" className="bg-gray-50 py-16 sm:py-20 md:py-28">
      <style>{`
        @keyframes testimonial-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .testimonial-track {
          animation: testimonial-marquee 45s linear infinite;
        }
        .testimonial-track:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .testimonial-track {
            animation: none;
          }
        }
      `}</style>

      <div className="container-brand">
        <div className="mb-10 text-center sm:mb-12">
          <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-brand">
            Testimoni
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-navy-800 md:text-4xl">
            Apa Kata Klien Kami
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-gray-500">
            Kepercayaan klien terbangun dari konsistensi kualitas di setiap
            proyek.
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-gray-50 to-transparent sm:w-32"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-gray-50 to-transparent sm:w-32"
        />

        <div className="testimonial-track flex w-max gap-5 px-5">
          {loopItems.map((t, i) => (
            <div
              key={`${t.name}-${i}`}
              className="w-[320px] shrink-0 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.12)] sm:w-[360px]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, n) => (
                    <Star
                      key={n}
                      className="h-4 w-4 fill-brand text-brand"
                      aria-hidden
                    />
                  ))}
                </div>
                <Quote className="h-5 w-5 text-brand/25" aria-hidden />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-[15px]">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ring-2 ring-white ${
                    avatarColors[i % avatarColors.length]
                  }`}
                  aria-hidden
                >
                  {getInitials(t.name)}
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-navy-800">
                    {t.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}