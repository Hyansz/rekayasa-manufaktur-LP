"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, CheckCircle2, Send, Phone, Loader2, AlertCircle } from "lucide-react";
import Script from "next/script";
import ScrollReveal from "@/components/shared/ScrollReveal";

import {
  waUrlWithText,
  WA_DEFAULT_MESSAGE,
  PHONE_NUMBER,
} from "@/lib/contact";

const WA_LINK = waUrlWithText(WA_DEFAULT_MESSAGE);

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

function friendlyError(status: number, message?: string) {
  if (status === 429) return message || "Terlalu banyak percobaan, coba lagi nanti.";
  if (status === 403) return message || "Verifikasi keamanan gagal. Silakan coba lagi.";
  if (status === 400) return message || "Mohon lengkapi semua kolom yang wajib diisi.";
  if (status === 500) return message || "Terjadi masalah di server. Silakan coba lagi nanti.";
  return message || "Permintaan gagal dikirim. Silakan coba lagi.";
}

export default function FinalCTA() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const nama = String(formData.get("nama") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const pesan = String(formData.get("pesan") ?? "").trim();

    let turnstileToken = "";
    try {
      turnstileToken =
        typeof window !== "undefined" && window.turnstile
          ? window.turnstile.getResponse()
          : "";
    } catch {
      turnstileToken = "";
    }

    if (!turnstileToken) {
      setError(
        "Mohon selesaikan verifikasi keamanan di kotak di bawah sebelum mengirim."
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, email, pesan, turnstileToken }),
      });

      let data: { success?: boolean; message?: string } = {};
      try {
        data = await res.json();
      } catch {
        // response bukan JSON — fallback ke pesan status
      }

      if (res.ok && data.success) {
        form.reset();
        if (window.turnstile) {
          try {
            window.turnstile.reset();
          } catch {
            // abaikan — widget sudah hilang dari DOM
          }
        }
        setSubmitted(true);
      } else {
        setError(friendlyError(res.status, data.message));
        if (window.turnstile) {
          try {
            window.turnstile.reset();
          } catch {
            // abaikan
          }
        }
      }
    } catch {
      setError(
        "Koneksi gagal. Periksa internet Anda lalu coba lagi nanti."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="cta"
      className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-[#16224a] py-20 sm:py-28 md:py-36"
    >
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
      />
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 opacity-10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-brand/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]"
      />

      <div className="container-brand relative z-10">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-brand-light">
            Mulai Proyek Anda
          </p>
          <h2 className="mt-4 text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl md:leading-[1.1]">
            Wujudkan Ruang Impian Anda dengan Material Premium
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
            Konsultasi gratis dengan tim engineering kami. Kirim kebutuhan
            Anda, dan kami akan merespons dalam 1x24 jam.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.15} className="mx-auto mt-12 max-w-xl">
          {submitted ? (
            <div className="flex flex-col items-center rounded-3xl border border-white/10 bg-white/5 px-8 py-12 text-center backdrop-blur-md">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/15">
                <CheckCircle2 className="h-7 w-7 text-emerald-400" aria-hidden />
              </span>
              <h3 className="mt-5 text-xl font-bold text-white">
                Terima kasih!
              </h3>
              <p className="mt-2 max-w-sm text-sm text-white/60">
                Pesan Anda sudah kami terima. Tim kami akan segera menghubungi
                Anda melalui email atau telepon.
              </p>
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/15"
              >
                <Phone className="h-4 w-4 text-emerald-400" aria-hidden />
                Lanjut via WhatsApp
              </a>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md sm:p-8"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="cta-nama"
                    className="mb-1.5 block text-sm font-medium text-white/80"
                  >
                    Nama
                  </label>
                  <input
                    id="cta-nama"
                    name="nama"
                    required
                    placeholder="Nama lengkap"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all duration-200 focus:border-brand-light focus:ring-2 focus:ring-brand-light/20"
                  />
                </div>
                <div>
                  <label
                    htmlFor="cta-email"
                    className="mb-1.5 block text-sm font-medium text-white/80"
                  >
                    Email
                  </label>
                  <input
                    id="cta-email"
                    name="email"
                    type="email"
                    required
                    placeholder="nama@email.com"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all duration-200 focus:border-brand-light focus:ring-2 focus:ring-brand-light/20"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="cta-pesan"
                  className="mb-1.5 block text-sm font-medium text-white/80"
                >
                  Kebutuhan Anda
                </label>
                <textarea
                  id="cta-pesan"
                  name="pesan"
                  required
                  rows={3}
                  placeholder="Ceritakan kebutuhan furnitur Anda..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all duration-200 focus:border-brand-light focus:ring-2 focus:ring-brand-light/20"
                />
              </div>
              <div className="mt-5 flex justify-center">
                <div
                  className="cf-turnstile"
                  data-sitekey={TURNSTILE_SITE_KEY}
                  data-appearance="always"
                  data-size="flexible"
                  aria-label="Verifikasi keamanan"
                />
              </div>
              {error && (
                <p
                  role="alert"
                  className="mt-3 flex items-start justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-center text-xs text-red-200"
                >
                  <AlertCircle
                    className="mt-0.5 h-3.5 w-3.5 shrink-0"
                    aria-hidden
                  />
                  <span>{error}</span>
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-brand-dark active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 disabled:active:scale-100"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Mengirim...
                  </>
                ) : (
                  <>
                    Kirim Kebutuhan
                    <Send
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </>
                )}
              </button>
              <p className="mt-4 text-center text-xs text-white/40">
                atau hubungi langsung{" "}
                <a
                  href={`tel:${PHONE_NUMBER}`}
                  className="transition-colors hover:text-white"
                >
                  +62 851 8666 6865
                </a>
              </p>
            </form>
          )}
        </ScrollReveal>

        <ScrollReveal delay={0.3} className="mt-10 text-center">
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition-colors hover:text-white"
          >
            Chat langsung di WhatsApp
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden
            />
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}