"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll() {
  const pathname = usePathname();
  const lenis = useRef<Lenis | null>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const tick = () => lenis.current?.raf(performance.now());
    const syncLock = () => {
      if (document.documentElement.dataset.navigationOpen === "true") lenis.current?.stop();
      else lenis.current?.start();
    };
    const destroy = () => {
      gsap.ticker.remove(tick);
      lenis.current?.off("scroll", ScrollTrigger.update);
      lenis.current?.destroy();
      lenis.current = null;
    };
    const configure = () => {
      destroy();
      if (motion.matches) return;
      lenis.current = new Lenis({
        autoRaf: false,
        lerp: 0.1,
        smoothWheel: true,
        syncTouch: false,
        anchors: true,
      });
      lenis.current.on("scroll", ScrollTrigger.update);
      syncLock();
      gsap.ticker.add(tick);
    };

    configure();
    window.addEventListener("navigation-lock-change", syncLock);
    motion.addEventListener("change", configure);
    return () => {
      motion.removeEventListener("change", configure);
      window.removeEventListener("navigation-lock-change", syncLock);
      destroy();
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useLayoutEffect(() => {

    if (window.location.hash) {
      lenis.current?.scrollTo(window.scrollY, { immediate: true, force: true });
      return;
    }

    const resetToTop = () => {
      lenis.current?.resize();

      lenis.current?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      ScrollTrigger.update();
    };

    resetToTop();

    const frame = requestAnimationFrame(() => {
      resetToTop();
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}

