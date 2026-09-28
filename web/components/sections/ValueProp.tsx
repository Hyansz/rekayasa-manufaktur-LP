import { Ruler, ShieldCheck, Repeat, Layers } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";

export default function ValueProp() {
  return (
    <section id="value" className="bg-gray-50 py-16 sm:py-20 md:py-28">
      <div className="container-brand">
        <ScrollReveal className="mb-10 max-w-2xl sm:mb-12 md:mb-14">
          <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-brand">
            Standar Material Kami
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-navy-800 md:text-4xl">
            Standar Engineering untuk Ruang Anda
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-500 md:text-lg">
            Tiga pilar yang menopang setiap produk: material premium tahan
            karat, presisi machining, dan desain yang tidak lekang oleh waktu.
          </p>
        </ScrollReveal>

        <div className="grid gap-5 md:grid-cols-12 md:gap-6">
          {/* Card 1: Material Premium (large, dark) */}
          <ScrollReveal className="md:col-span-7">
            <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-navy-800 p-8 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-navy-900/20 md:p-10">
              {/* 3D floating accent */}
              <div
                aria-hidden
                className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent transition-transform duration-500 group-hover:rotate-12"
                style={{ transformStyle: "preserve-3d" }}
              />
              <div className="relative">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                  <ShieldCheck
                    className="h-5 w-5 text-blue-200"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </span>
                <h3 className="mt-5 text-2xl font-bold tracking-tight md:text-3xl">
                  Material Premium
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70 md:text-base">
                  Stainless Steel SS 304 &amp; SS 201 dengan finishing BA dan HL,
                  serta Mild Steel dengan treatment anti karat dan powder
                  coating. Tahan karat, awet, dan sesuai kebutuhan estetik
                  maupun fungsional.
                </p>
              </div>
              <div className="relative mt-8 flex flex-wrap gap-2">
                {[
                  "SS 304",
                  "SS 201",
                  "Mild Steel",
                  "BA Finish",
                  "HL Finish",
                  "Anti Karat",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: Presisi Teknik */}
          <ScrollReveal className="md:col-span-5" delay={0.1}>
            <div className="group flex h-full flex-col justify-between rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/20 hover:shadow-md">
              <div>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10">
                  <Ruler
                    className="h-5 w-5 text-brand"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </span>
                <h3 className="mt-5 text-2xl font-bold tracking-tight text-navy-800">
                  Presisi Teknik
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-500 md:text-base">
                  Toleransi machining ±0.1mm. Setiap joint, weld, dan surface
                  finish diuji kualitasnya.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 3: Cepat Produksi (3D-ish) */}
          <ScrollReveal className="md:col-span-4" delay={0.1}>
            <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-10 -left-10 h-28 w-28 rounded-full border border-brand/20 bg-brand/5 transition-transform duration-500 group-hover:scale-110"
                style={{ transformStyle: "preserve-3d" }}
              />
              <div>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10">
                  <Repeat
                    className="h-5 w-5 text-brand"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </span>
                <h3 className="mt-5 text-xl font-bold tracking-tight text-navy-800">
                  Produksi Cepat
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">
                  Proses fabrikasi &amp; machining terotomatisasi (laser
                  cutting, welding, CNC) untuk lead time produksi yang efisien.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 4: Desain Timeless (large, dark) */}
          <ScrollReveal className="md:col-span-8" delay={0.2}>
            <div className="group relative flex h-full items-center overflow-hidden rounded-2xl bg-navy-800 p-8 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-navy-900/20 md:p-10">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-10 bottom-0 h-32 w-32 rounded-2xl border border-white/10 bg-gradient-to-tl from-white/10 to-transparent transition-transform duration-500 group-hover:-rotate-6"
                style={{ transformStyle: "preserve-3d" }}
              />
              <div className="relative max-w-lg">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                  <Layers
                    className="h-5 w-5 text-blue-200"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </span>
                <h3 className="mt-5 text-2xl font-bold tracking-tight md:text-3xl">
                  Desain Timeless
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70 md:text-base">
                  Estetika minimalis yang tidak lekang oleh waktu. Cocok untuk
                  berbagai gaya interior — dari industrial hingga modern
                  kontemporer.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}