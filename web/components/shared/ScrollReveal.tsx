"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  from?: "left" | "right" | "bottom" | "top";
  stagger?: boolean;
  as?: "div" | "section" | "article" | "li";
  id?: string;
}

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  duration = 0.7,
  from = "bottom",
  stagger = false,
  as: Tag = "div",
  id,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const el = ref.current;
    if (!el) return;

    const getTransform = () => {
      const dist = 30;
      switch (from) {
        case "left":
          return { x: -dist, y: 0 };
        case "right":
          return { x: dist, y: 0 };
        case "top":
          return { x: 0, y: -dist };
        default:
          return { x: 0, y: dist };
      }
    };

    const ctx = gsap.context(() => {
      if (stagger) {
        const targets = el.children;
        gsap.fromTo(
          targets,
          { ...getTransform(), opacity: 0 },
          {
            ...getTransform(),
            x: 0,
            y: 0,
            opacity: 1,
            duration,
            delay,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      } else {
        gsap.fromTo(
          el,
          { ...getTransform(), opacity: 0 },
          {
            ...getTransform(),
            x: 0,
            y: 0,
            opacity: 1,
            duration,
            delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, ref);

    return () => ctx.revert();
  }, [delay, duration, from, stagger]);

  return (
    <Tag ref={ref as never} className={className} id={id}>
      {children}
    </Tag>
  );
}
