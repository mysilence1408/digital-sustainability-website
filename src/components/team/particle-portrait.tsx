"use client";

import { useEffect, useRef } from "react";
import { createFaceCloud } from "./face-cloud-renderer";

const sources = ["/images/team/head-01.png", "/images/team/head-02.png"];

export default function ParticlePortrait({ member }: { member: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const codes = useRef<HTMLCanvasElement>(null);
  const active = useRef(member);
  useEffect(() => { active.current = member; }, [member]);
  useEffect(() => {
    const surface = canvas.current!;
    const backdrop = codes.current!;
    const ctx = backdrop.getContext("2d")!;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false, frame = 0, visible = true, width = 1, height = 1, last = 0, time = 0;
    let destroy = () => {};
    let images: HTMLImageElement[] = [];
    const resize = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width; height = entry.contentRect.height;
      backdrop.width = Math.round(width); backdrop.height = Math.round(height);
    }); resize.observe(backdrop);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; last = 0; }); observer.observe(backdrop);
    const start = () => { destroy(); if (!disposed && images.length) destroy = createFaceCloud(surface, images, () => active.current); };
    const lost = (event: Event) => { event.preventDefault(); destroy(); surface.dataset.renderer = "lost"; };
    surface.addEventListener("webglcontextlost", lost);
    surface.addEventListener("webglcontextrestored", start);
    Promise.all(sources.map(src => new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = src;
    }))).then(loaded => { if (!disposed) { images = loaded; start(); } }).catch(() => { surface.dataset.renderer = "unavailable"; });
    const render = (stamp: number) => {
      if (disposed) return; frame = requestAnimationFrame(render);
      if (!visible || document.hidden || stamp - last < 1000 / 24) return;
      if (!motion.matches) time += last ? Math.min(.1, (stamp - last) / 1000) : 1 / 24; last = stamp;
      ctx.clearRect(0, 0, width, height); ctx.font = "9px monospace";
      for (let column = 0; column < 18; column++) {
        const x = width * column / 17;
        if (x > width * .30 && x < width * .72) continue;
        for (let row = 0; row < 19; row++) {
          const y = ((row * 43 + time * (12 + column % 4 * 6) + column * 31) % (height + 60)) - 30;
          ctx.fillStyle = `rgba(119,180,190,${.045 + ((column * 7 + row * 3) % 9) * .008})`;
          ctx.fillText(((column * 7919 + row * 127) % 65535).toString(16).padStart(4, "0").toUpperCase(), x, y);
        }
      }
    };
    frame = requestAnimationFrame(render);
    return () => {
      disposed = true; cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect(); destroy();
      surface.removeEventListener("webglcontextlost", lost); surface.removeEventListener("webglcontextrestored", start);
    };
  }, []);
  return <>
    <canvas ref={codes} aria-hidden="true" className="absolute inset-0 size-full" />
    <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 size-full" />
  </>;
}
