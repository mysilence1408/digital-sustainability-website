"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { createParticleSculptureRenderer } from "./particle-renderer";

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

/** A single GPU scene travels from its original hero slot into a viewport dock. */
export default function FollowingCompanion({ ready }: { ready: boolean }) {
  const slot = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const readyRef = useRef(ready);
  const mounted = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  useEffect(() => { readyRef.current = ready; }, [ready]);

  useEffect(() => {
    if (!mounted || !slot.current || !layer.current || !canvas.current) return;
    const host = layer.current;
    const surface = canvas.current;
    const anchor = slot.current;
    const hero = anchor.closest("section")!;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-companion-shape]"));
    const last = sections.at(-1);
    let shape = 0;
    const acting = { idle: 0, arrival: 0 };
    let lastScroll = performance.now(), entered = -Infinity;
    let dockSide = 1;
    const onScroll = () => { lastScroll = performance.now(); };
    const onVisibility = () => { lastScroll = performance.now(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    let width = 1, height = 1, lastStamp = performance.now();
    let x = 0, y = 0, scale = 1, initialized = false;
    let wasHidden = false;
    const measure = () => {
      const rect = anchor.getBoundingClientRect();
      width = rect.width; height = rect.height;
      host.style.width = `${width}px`; host.style.height = `${height}px`;
    };
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(anchor);
    const destroy = createParticleSculptureRenderer(surface, () => readyRef.current, true, () => shape, () => acting);
    const tick = () => {
      const stamp = performance.now();
      const dt = Math.min(.1, (stamp-lastStamp)/1000); lastStamp = stamp;
      const viewportHeight = document.documentElement.clientHeight;
      const viewportWidth = document.documentElement.clientWidth;
      const rect = anchor.getBoundingClientRect();
      const heroRect = hero.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -heroRect.top / Math.max(1, heroRect.height * .65)));
      const follow = progress * progress * (3 - 2 * progress);
      const small = viewportWidth < 768;
      const dockWidth = Math.min(width, small ? 185 : 400);
      const dockScale = dockWidth / width;
      let nextShape = progress > .08 ? 1 : 0;
      for (const section of sections) {
        if (section.getBoundingClientRect().top < viewportHeight * .65)
          nextShape = Number(section.dataset.companionShape);
      }
      // A semantic footer takes priority; otherwise use the end of Features.
      const footer = document.querySelector<HTMLElement>("footer, [data-companion-end]");
      const boundary = footer ? footer.getBoundingClientRect().top : last?.getBoundingClientRect().bottom ?? Infinity;
      const goodbye = Math.min(1, Math.max(0, (viewportHeight * .95 - boundary) / (viewportHeight * .5)));
      if (goodbye > 0) nextShape = 5;
      if (nextShape !== shape) {
        shape = nextShape;
        entered = stamp;
        if (shape > 0 && shape < 5) dockSide = shape % 2 === 1 ? 0 : 1;
        host.dataset.shape = String(shape);
        surface.dispatchEvent(new Event("particle-state-change"));
      }
      const entryProgress = Math.min(1, (stamp-entered)/1800);
      acting.arrival = motion.matches ? 0 : Math.sin(entryProgress*Math.PI);
      const waiting = stamp-lastScroll > 30_000 && shape > 0 && shape < 5 && !wasHidden;
      acting.idle += ((waiting && !motion.matches ? 1 : 0)-acting.idle)*(1-Math.exp(-dt*3));
      host.dataset.behavior = waiting ? "waiting" : acting.arrival > .05 ? "greeting" : "exploring";
      host.dataset.side = dockSide === 0 ? "left" : "right";
      const targetScale = 1 + (dockScale - 1) * follow;
      const dockX = dockSide === 0 ? (small ? 0 : 16) : viewportWidth-dockWidth-(small ? 0 : 16);
      const targetX = rect.left + (dockX - rect.left) * follow;
      const lift = motion.matches ? 0 : Math.sin(entryProgress*Math.PI)*(small ? 25 : 65);
      const targetY = rect.top + (viewportHeight - height * dockScale - 16 - rect.top) * follow - lift*follow;
      const ease = motion.matches || !initialized ? 1 : 1 - Math.exp(-dt * 3.5);
      x += (targetX-x)*ease; y += (targetY-y)*ease; scale += (targetScale-scale)*ease;
      initialized = true;
      host.style.transform = `translate3d(${x}px,${y - goodbye * 25}px,0) scale(${scale})`;
      const opacity = goodbye >= 1 ? 0 : 1 - Math.min(1, Math.max(0, (goodbye - .55) / .45));
      host.style.opacity = String(opacity);
      if (wasHidden && opacity > 0) surface.dispatchEvent(new Event("particle-state-change"));
      wasHidden = opacity === 0;
    };
    tick();
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick); resize.disconnect(); destroy();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [mounted]);

  return <>
    <div ref={slot} className="h-full w-full" aria-hidden="true" />
    {mounted && createPortal(
      <div ref={layer} data-following-companion className="pointer-events-none fixed left-0 top-0 z-30 origin-top-left" role="img" aria-label="A friendly particle companion that transforms as you explore, then waves goodbye.">
        <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 block size-full" />
      </div>, document.body,
    )}
  </>;
}
