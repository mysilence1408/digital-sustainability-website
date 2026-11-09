"use client";

import { Suspense, useCallback, useLayoutEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { setPageEntranceReady } from "./page-entrance";

const full = "polygon(50% 0%,100% 0%,100% 50%,100% 100%,50% 100%,0% 100%,0% 50%,0% 0%)";
const octagon = "polygon(50% 0%,85% 15%,100% 50%,85% 85%,50% 100%,15% 85%,0% 50%,15% 15%)";
const lifted = "polygon(50% 0%,100% 0%,100% 0%,100% 0%,50% 0%,0% 0%,0% 0%,0% 0%)";

/** Persistent overlay: route suspension never replaces it with a naked page. */
export default function PageTransition() {
  const router = useRouter();
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const shade = useRef<HTMLDivElement>(null);
  const leaf = useRef<SVGSVGElement>(null);
  const previousPath = useRef<string | null>(null);
  const busy = useRef(false);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const finish = useCallback(() => {
    // Set up the destination's first animation frame BEFORE removing its cover.
    flushSync(() => setPageEntranceReady(true));
    gsap.set(root.current, { visibility: "hidden" });
    busy.current = false;
  }, []);

  const committed = useCallback((path: string) => {
    if (previousPath.current === null) { previousPath.current = path; return; }
    if (previousPath.current === path) return;
    previousPath.current = path;
    timeline.current?.kill();
    if (timeout.current) clearTimeout(timeout.current);
    busy.current = true;
    setPageEntranceReady(false);
    // Cover in the layout commit, including history navigation, before paint.
    gsap.set(root.current, { visibility: "visible" });
    gsap.set(panel.current, { width: "100%", scale: 1, rotation: 0, clipPath: full });
    gsap.set(shade.current, { opacity: 0 });
    gsap.set(leaf.current, { opacity: 1, y: 0 });
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    timeline.current = gsap.timeline({ delay: reduced ? 0.01 : 0.35, onComplete: finish })
      .to(leaf.current, { opacity: 0, y: -40, duration: reduced ? 0 : 0.2, ease: "expo.out" })
      .to(panel.current, { clipPath: lifted, duration: reduced ? 0 : 0.6, ease: "expo.out" }, 0);
  }, [finish]);

  useLayoutEffect(() => {
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!anchor || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
      const url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      event.preventDefault();
      if (busy.current) return;
      busy.current = true;
      setPageEntranceReady(false);
      timeline.current?.kill();
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.set(root.current, { visibility: "visible" });
      gsap.set(shade.current, { opacity: 0 });
      gsap.set(panel.current, { width: "100vmin", scale: 0, rotation: -60, clipPath: octagon });
      gsap.set(leaf.current, { y: 40, opacity: 0 });
      timeline.current = gsap.timeline({ onComplete: () => {
        // Start the timeout before push so even a synchronous commit cancels it.
        timeout.current = setTimeout(finish, 10000);
        router.push(url.pathname + url.search + url.hash);
      } })
        .to(shade.current, { opacity: 0.25, duration: reduced ? 0 : 0.3 }, 0)
        .to(panel.current, { scale: 0.5, rotation: 0, duration: reduced ? 0 : 0.5, ease: "back.out(1.4)" }, 0)
        .to(panel.current, { scale: 1, duration: reduced ? 0 : 0.35, ease: "expo.inOut" }, reduced ? 0 : 0.5)
        .to(leaf.current, { opacity: 1, y: 0, duration: reduced ? 0 : 0.5, ease: "expo.inOut" }, reduced ? 0 : 0.5)
        .to(panel.current, { width: "100%", clipPath: full, duration: reduced ? 0 : 0.35, ease: "expo.inOut" }, reduced ? 0 : 0.57);
    };
    document.addEventListener("click", click, true);
    return () => {
      document.removeEventListener("click", click, true);
      timeline.current?.kill();
      if (timeout.current) clearTimeout(timeout.current);
      setPageEntranceReady(true);
    };
  }, [router, finish]);

  return <>
    <Suspense fallback={null}><RouteObserver onCommit={committed} /></Suspense>
    <div ref={root} data-page-curtain aria-hidden="true" className="invisible fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden text-[#173d2a]">
      <div ref={shade} className="absolute inset-0 bg-black opacity-0" />
      <div ref={panel} className="absolute h-full w-full bg-[#2ef34e] will-change-transform" />
      <svg ref={leaf} viewBox="0 0 120 120" fill="none" className="relative h-28 w-28 sm:h-40 sm:w-40">
        <path d="M94 20C52 13 21 34 24 65c2 23 25 36 44 23 23-15 28-43 26-68Z" fill="currentColor" />
        <path d="M24 102 78 39M46 76l-3-24m16 9 22-2" stroke="#2ef34e" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  </>;
}

function RouteObserver({ onCommit }: { onCommit: (path: string) => void }) {
  const path = usePathname();
  useLayoutEffect(() => onCommit(path), [path, onCommit]);
  return null;
}
