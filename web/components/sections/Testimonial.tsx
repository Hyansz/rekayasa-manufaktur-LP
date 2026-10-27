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
      "Garansi 3 tahunnya bikin tenang. Sudah pernah klaim sekali karena baut kendor, prosesnya cepat dan tidak ribet.",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
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

function TestimonialCard({
  name,
  quote,
  index,
}: {
  name: string;
  quote: string;
  index: number;
}) {
  return (
    <article className="flex h-full min-w-0 flex-col rounded-2xl border border-gray-200/80 bg-white p-5 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.12)] transition-shadow duration-300 hover:shadow-md sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div
          className="flex items-center gap-1"
          aria-label="Rating 5 dari 5"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="h-4 w-4 fill-brand text-brand"
              aria-hidden="true"
            />
          ))}
        </div>

        <Quote
          className="h-5 w-5 shrink-0 text-brand/25"
          aria-hidden="true"
        />
      </div>

      <p className="mt-4 flex-1 whitespace-normal break-words text-sm leading-7 text-gray-600 sm:text-base">
        &ldquo;{quote}&rdquo;
      </p>

      <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ring-2 ring-white ${
            avatarColors[index % avatarColors.length]
          }`}
          aria-hidden="true"
        >
          {getInitials(name)}
        </div>

        <div className="min-w-0">
          <p className="break-words text-sm font-semibold text-navy-800 sm:text-base">
            {name}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function Testimonials() {
  return (
    <section
      id="testimoni"
      aria-labelledby="testimonials-heading"
      className="scroll-mt-24 overflow-hidden bg-gray-50 py-12 sm:py-16 md:py-20 lg:py-24"
    >
      {/* Section heading */}
      <div className="container-brand">
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10 md:mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand sm:text-[13px]">
            Testimoni
          </p>

          <h2
            id="testimonials-heading"
            className="mt-3 text-balance text-2xl font-bold leading-tight tracking-tight text-navy-800 sm:text-3xl md:text-4xl"
          >
            Apa Kata Klien Kami
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-500 sm:mt-4 sm:text-base sm:leading-7">
            Kepercayaan klien terbangun dari konsistensi kualitas di
            setiap proyek.
          </p>
        </div>
      </div>

      {/* Auto-loop: Desktop and Mobile */}
      <div className="relative overflow-hidden">
        <style>{`
          @keyframes testimonial-marquee {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }

          .testimonial-track {
            display: flex;
            width: max-content;
            animation: testimonial-marquee 45s linear infinite;
            will-change: transform;
          }

          .testimonial-group {
            display: flex;
            flex-shrink: 0;
            align-items: stretch;
            gap: 16px;
            padding-right: 16px;
          }

          .testimonial-track:hover {
            animation-play-state: paused;
          }

          @media (min-width: 640px) {
            .testimonial-group {
              gap: 20px;
              padding-right: 20px;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .testimonial-track {
              animation: none;
              will-change: auto;
            }
          }
        `}</style>

        {/* Left fade */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-gray-50 to-transparent sm:w-12 lg:w-16"
        />

        {/* Right fade */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-gray-50 to-transparent sm:w-12 lg:w-16"
        />

        <div className="testimonial-track">
          {[0, 1].map((groupIndex) => (
            <div
              key={groupIndex}
              className="testimonial-group"
              aria-hidden={groupIndex === 1 ? "true" : undefined}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={`${groupIndex}-${testimonial.name}`}
                  className="w-[280px] shrink-0 sm:w-[300px] lg:w-[320px]"
                >
                  <TestimonialCard
                    name={testimonial.name}
                    quote={testimonial.quote}
                    index={index}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}