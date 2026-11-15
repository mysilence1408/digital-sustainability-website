"use client";

import { useEffect, useRef, type RefObject } from "react";
import { createParticleSculptureRenderer, type CompanionActing } from "./particle-renderer";

export default function HeroLeaf({ formationReady }: { formationReady: RefObject<boolean> }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvas.current) return;
    let light = true;
    const appearance: CompanionActing = { idle: 0, arrival: 0 };
    const update = () => {
      light = getComputedStyle(document.documentElement).colorScheme === "light";
      appearance.color = light ? [83 / 255, 100 / 255, 61 / 255] : [181 / 255, 197 / 255, 155 / 255];
      canvas.current?.dispatchEvent(new Event("particle-state-change"));
    };
    update();
    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    scheme.addEventListener("change", update);
    window.addEventListener("colour-theme-change", update);

    const destroy = createParticleSculptureRenderer(canvas.current, () => formationReady.current, () => light, () => 0, () => appearance);
    return () => {
      destroy();
      scheme.removeEventListener("change", update);
      window.removeEventListener("colour-theme-change", update);
    };
  }, [formationReady]);

  return (
    <div className="relative h-full w-full" role="img" aria-label="A leaf formed from fine particles. Move your cursor across it to gently repel the particles; they return when it moves away.">
      <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 block size-full" />
    </div>
  );
}
