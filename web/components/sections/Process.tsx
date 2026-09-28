"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import {
  Film,
  Pause,
  Play,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FloatingShapes from "@/components/3d/FloatingShapes";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface StepVideo {
  poster: string;
  mp4: string;
  webm?: string;
}

interface ProcessStep {
  num: string;
  title: string;
  text: string;
  posterAlt: string;
  video?: StepVideo | null;
  videoCaption?: string;
}

// Sumber footage: CDN Cloudinary (integrasi yang sama dengan Hero — tidak perlu
// dependency baru). Ganti/pindah ke /public/videos/process/ kalo client kasih
// file lokal: isi `poster` + `mp4` (+ `webm` kalau ada) per step di bawah.
const FACILITY_VIDEO = {
  poster:
    "https://res.cloudinary.com/dtsrtikhr/image/upload/f_auto,q_auto,w_1920/v1789530994/two-worker-making-gates-smithy_1_vw6qlr.jpg",
  mp4: "https://res.cloudinary.com/dtsrtikhr/video/upload/f_auto,q_auto,w_1080/v1789530904/8._Pengelasan_Wastafel_g0ul1x.mp4",
};

const steps: ProcessStep[] = [
  {
    num: "01",
    title: "Pemotongan Presisi (Cutting)",
    text: "Pelat logam dipotong presisi menggunakan mesin CNC laser cutting untuk membentuk profil dengan toleransi ±0.1mm.",
    posterAlt:
      "Mesin CNC laser cutting memotong pelat logam presisi di bengkel fabrikasi Rekayasa Manufaktur",
    video: {
      poster: "/images/process/step-01-cutting.jpg",
      mp4: "/videos/process/step-01-cutting.mp4",
      webm: "/videos/process/step-01-cutting.webm",
    },
  },
  {
    num: "02",
    title: "Pengelasan (Welding)",
    text: "Profil disatukan dengan pengelasan TIG presisi untuk hasil sambungan yang rapi, kuat, dan tahan lama.",
    posterAlt:
      "Operator melakukan pengelasan TIG pada pelat stainless steel di bengkel fabrikasi Rekayasa Manufaktur",
    video: {
      poster: "/images/process/step-02-welding.jpg",
      mp4: "/videos/process/step-02-welding.mp4",
      webm: "/videos/process/step-02-welding.webm",
    },
  },
  {
    num: "03",
    title: "Penghalusan & Finishing Las (Grinding)",
    text: "Sambungan las dihaluskan menggunakan gerinda untuk hasil akhir yang rata, bebas gerinda kasar, dan siap untuk tahap pelapisan.",
    posterAlt:
      "Operator menghaluskan sambungan las dengan gerinda di bengkel fabrikasi Rekayasa Manufaktur",
    video: {
      poster: "/images/process/step-03-welding.jpg",
      mp4: "/videos/process/step-03-welding.mp4",
      webm: "/videos/process/step-03-welding.webm",
    },
  },
  {
    num: "04",
    title: "Pelapisan Permukaan (Powder Coating)",
    text: "Treatment powder coating untuk proteksi anti karat dan tampilan premium yang tahan lama pada setiap produk.",
    posterAlt:
      "Proses powder coating rangka logam di bengkel finishing Rekayasa Manufaktur",
    video: {
      poster: "/images/process/step-04-coating.jpg",
      mp4: "/videos/process/step-04-coating.mp4",
      webm: "/videos/process/step-04-coating.webm",
    },
  },
];

const stats = [
  { value: 15, suffix: "+", label: "Tahun Pengalaman" },
  { value: 500, suffix: "+", label: "Ton Material / Tahun" },
];

const certifications = ["ISO 9001", "ISO 14001", "RoHS Compliance"];

// Poster/video step. Saat step.video kosong (footage belum dari client),
// render placeholder "Video segera hadir" — bukan kotak kosong tanpa fungsi.
function StepMedia({ step }: { step: ProcessStep }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const userPaused = useRef(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video || !step.video) return;

    video.muted = true;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Autoplay (muted) saat card masuk viewport, pause saat keluar —
    // hemat resource & kuota. IntersectionObserver native, tanpa dependency.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Reduced-motion atau user sudah pernah pause manual → jangan autoplay.
            if (reduced || userPaused.current) return;
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(wrap);
    return () => observer.disconnect();
  }, [step.video]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
    } else {
      v.pause();
      userPaused.current = true;
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  if (!step.video) {
    return (
      <div className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/15 bg-gradient-to-br from-navy-800/80 to-navy-900/90 transition-colors duration-300 hover:border-brand-light/30">
        <Film className="h-10 w-10 text-white/20" aria-hidden />
        <span className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-navy-950/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/70 backdrop-blur-sm">
          STEP {step.num} · {step.title}
        </span>
        <p className="absolute bottom-3 text-xs font-medium uppercase tracking-wider text-white/40">
          Video segera hadir
        </p>
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      className="group relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-navy-800/60 shadow-lg transition-all duration-300 hover:border-brand-light/40 hover:shadow-[0_0_60px_rgba(37,99,235,0.18)]"
    >
      {/* Poster (lazy di luar viewport) — first paint + SEO/alt. Hilang setelah
          frame video pertama termuat biar tidak ada flash kosong. */}
      {!ready && (
        <Image
          src={step.video.poster}
          alt={step.posterAlt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          loading="lazy"
          className="object-cover"
        />
      )}

      {/* MP4 (h264) + WebM (alternatif). Lazy-load via preload=metadata. */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        loop
        playsInline
        preload="metadata"
        onLoadedData={() => setReady(true)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={step.video.mp4} type="video/mp4" />
        {step.video.webm && <source src={step.video.webm} type="video/webm" />}
        {/* Siap diisi saat ada narasi/voice over: src ke file .vtt */}
        <track kind="captions" srcLang="id" label="Bahasa Indonesia" />
      </video>

      {/* Keterangan step */}
      <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-navy-950/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm">
        STEP {step.num} · {step.title}
      </span>

      {/* Kontrol play/pause + mute di pojok */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2 transition-opacity duration-300 md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100">
        <button
          type="button"
          aria-label={playing ? "Jeda video proses" : "Putar video proses"}
          onClick={togglePlay}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-950/70 text-white/90 backdrop-blur-sm transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          {playing ? (
            <Pause className="h-4 w-4" aria-hidden />
          ) : (
            <Play className="ml-0.5 h-4 w-4" aria-hidden />
          )}
        </button>
        <button
          type="button"
          aria-label={muted ? "Aktifkan suara video" : "Matikan suara video"}
          onClick={toggleMute}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-950/70 text-white/90 backdrop-blur-sm transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          {muted ? (
            <VolumeX className="h-4 w-4" aria-hidden />
          ) : (
            <Volume2 className="h-4 w-4" aria-hidden />
          )}
        </button>
      </div>
    </div>
  );
}

function FacilityVideoModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    window.__lenis?.stop();
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", onKey);
      window.__lenis?.start();
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Video fasilitas produksi lengkap Rekayasa Manufaktur"
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 bg-navy-950/90 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-navy-900 shadow-2xl">
        <button
          ref={closeRef}
          type="button"
          aria-label="Tutup video"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-navy-950/70 text-white/80 backdrop-blur-sm transition-colors hover:text-white"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
        <video
          className="aspect-video w-full bg-black"
          controls
          autoPlay
          muted
          playsInline
          preload="metadata"
          poster={FACILITY_VIDEO.poster}
        >
          <source src={FACILITY_VIDEO.mp4} type="video/mp4" />
          <track kind="captions" srcLang="id" label="Bahasa Indonesia" />
        </video>
      </div>
    </div>,
    document.body
  );
}

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lineWrapRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduced) {
      // Tanpa animasi → angka stats langsung final (bukan 0).
      document
        .querySelectorAll<HTMLElement>(".process-stat-number")
        .forEach((el, i) => {
          el.textContent = String(stats[i].value);
        });
      return;
    }

    const ctx = gsap.context(() => {
      const stepEls = stepRefs.current.filter(Boolean) as HTMLElement[];
      if (!stepEls.length) return;

      const firstStep = stepEls[0];
      const lastStep = stepEls[stepEls.length - 1];

      gsap.set(stepEls, { opacity: 0.15, scale: 0.92 });

      // Reveal should finish exactly when the dot (vertically centered on
      // the card) crosses the viewport's center line — so we anchor the
      // end of the trigger to the card's own center ("center center"),
      // not an arbitrary "top 40%" which only tracked the card's top edge
      // and drifted away from where the dot actually is.
      stepEls.forEach((step) => {
        gsap.to(step, {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: step,
            start: "top 90%",
            end: "center center",
            scrub: true,
          },
        });
      });

      // Line hanya membentang antara dot pertama & terakhir (keduanya
      // vertikal-centered di card-nya), dihitung saat runtime.
      const positionLine = () => {
        if (!lineWrapRef.current || !trackRef.current) return;
        const trackTop = trackRef.current.getBoundingClientRect().top;
        const firstCenter =
          firstStep.getBoundingClientRect().top +
          firstStep.offsetHeight / 2 -
          trackTop;
        const lastCenter =
          lastStep.getBoundingClientRect().top +
          lastStep.offsetHeight / 2 -
          trackTop;

        lineWrapRef.current.style.top = `${firstCenter}px`;
        lineWrapRef.current.style.height = `${lastCenter - firstCenter}px`;
      };

      positionLine();

      gsap.to(".process-progress", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: firstStep,
          start: "top 90%",
          endTrigger: lastStep,
          end: "center center",
          scrub: 1,
        },
      });

      gsap.to(".process-bg", {
        y: -120,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Counter stats strip on-scroll (pola sama seperti SocialProof).
      if (document.querySelector(".process-stat-number")) {
        gsap.fromTo(
          ".process-stat-number",
          { innerText: 0 },
          {
            innerText: (i: number) => stats[i].value,
            duration: 2,
            ease: "power1.out",
            snap: { innerText: 1 },
            stagger: 0.15,
            scrollTrigger: {
              trigger: ".process-stats",
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Recompute line geometry & re-measure ScrollTrigger setelah resize.
      const handleRefresh = () => positionLine();
      ScrollTrigger.addEventListener("refresh", handleRefresh);

      let resizeTimeout: ReturnType<typeof setTimeout>;
      const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          ScrollTrigger.refresh();
        }, 150);
      };
      window.addEventListener("resize", handleResize);

      return () => {
        ScrollTrigger.removeEventListener("refresh", handleRefresh);
        window.removeEventListener("resize", handleResize);
        clearTimeout(resizeTimeout);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative overflow-hidden bg-navy-900"
    >
      {/* Parallax background */}
      <div
        aria-hidden
        className="process-bg bg-grid pointer-events-none absolute inset-0 opacity-20"
      />
      <FloatingShapes variant="dark" />

      <div className="relative">
        <div className="flex flex-col justify-center py-28 sm:py-32 md:py-40">
          <div className="container-brand relative z-10 flex flex-col items-center text-center">
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-brand-light">
              Dari Billet hingga Masterpiece
            </p>
            <h2 className="mt-6 text-balance text-3xl font-bold tracking-tight text-white md:text-4xl">
              Proses Manufaktur Kami
            </h2>
          </div>

          <div
            ref={trackRef}
            className="container-brand relative z-10 mt-14 md:mt-20"
          >
            <div className="relative">
              {/* Progress line — top/height set runtime (positionLine) agar
                  membentang tepat dari pusat dot pertama ke dot terakhir.
                  Opacity diturunkan + fade di kedua ujung biar timeline tidak
                  mendominasi — video jadi focal point. */}
              <div
                ref={lineWrapRef}
                className="absolute left-1/2 hidden w-px -translate-x-1/2 bg-white/5 md:block"
                style={{
                  maskImage:
                    "linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)",
                }}
              >
                <div className="process-progress h-full w-full origin-top scale-y-0 bg-brand-light" />
              </div>

              <div className="space-y-20 md:space-y-32">
                {steps.map((step, i) => (
                  <div
                    key={step.num}
                    ref={(el) => {
                      stepRefs.current[i] = el;
                    }}
                    className={cn(
                      "process-step relative grid items-center gap-6 md:grid-cols-2 md:gap-16",
                      i % 2 === 1 && "md:[direction:rtl]",
                    )}
                  >
                    {/* Step dot */}
                    <span className="absolute left-1/2 top-1/2 hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand-light bg-navy-900 md:block" />

                    {/* Media (video) — di atas teks di mobile, zig-zag di desktop */}
                    <div className="md:[direction:ltr]">
                      <StepMedia step={step} />
                    </div>

                    <div className="md:[direction:ltr]">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm md:p-10">
                        <div className="flex items-center gap-4">
                          <div>
                            <span className="text-[13px] font-bold tracking-widest text-brand-light">
                              STEP {step.num}
                            </span>
                            <h3 className="mt-1 text-2xl font-bold tracking-tight text-white">
                              {step.title}
                            </h3>
                          </div>
                        </div>
                        <p className="mt-4 text-sm leading-relaxed text-white/65 md:text-base">
                          {step.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>



          {/* CTA video fasilitas + badge sertifikasi — DISEMBUNYIKAN sementara.
              Saat footage fasilitas final sudah siap, kembalikan tombol "Lihat
              Video Fasilitas Produksi Lengkap" + <FacilityVideoModal> di blok ini. */}
        </div>
      </div>
    </section>
  );
}