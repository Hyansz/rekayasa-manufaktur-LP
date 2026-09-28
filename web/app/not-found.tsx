import Link from "next/link";
import SiteShell from "@/components/layout/SiteShell";

export default function NotFound() {
  return (
    <SiteShell>
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <p className="text-6xl font-extrabold text-navy-700 md:text-8xl">404</p>
        <h1 className="mt-4 text-2xl font-bold text-navy-800 md:text-3xl">
          Halaman Tidak Ditemukan
        </h1>
        <p className="mt-3 max-w-md text-gray-600">
          Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>
        <Link
          href="/"
          className="mt-8 rounded-full bg-navy-700 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-600"
        >
          Kembali ke Beranda
        </Link>
      </section>
    </SiteShell>
  );
}
