"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("@/components/3d/HeroScene"), {
  ssr: false,
});

export default function SceneLoader() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    setEnabled(!reduced && isDesktop);
  }, []);

  if (!enabled) return null;

  return (
    <div className="absolute inset-0 z-0">
      {/* Backdrop permanen: selalu ada di belakang canvas, jadi tidak
         pernah ada celah kosong antara loading chunk selesai dan
         scene 3D fade-in selesai. */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800/60 to-transparent" />
      <HeroScene />
    </div>
  );
}