declare global {
  interface Window {
    __lenis?: {
      scrollTo(
        target: string | HTMLElement,
        opts?: { offset?: number; duration?: number; easing?: (t: number) => number }
      ): void;
      start(): void;
      stop(): void;
    };
  }
}

export function scrollToSection(
  href: string,
  e?: React.MouseEvent<HTMLAnchorElement>
) {
  e?.preventDefault();
  const target = document.querySelector(href) as HTMLElement | null;
  if (!target) return;
  if (window.__lenis) {
    window.__lenis.scrollTo(target, { offset: -70 });
  } else {
    target.scrollIntoView({ behavior: "smooth" });
  }
}