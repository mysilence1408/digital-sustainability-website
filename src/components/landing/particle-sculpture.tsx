"use client";
import { useEffect, useRef } from "react";
import { createParticleSculptureRenderer } from "./particle-renderer";

export default function ParticleSculpture({
  className = "",
  ready = true,
  theme = "dark",
}: {
  className?: string;
  ready?: boolean;
  theme?: "dark" | "light";
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const readyRef = useRef(ready);
  useEffect(() => {
    readyRef.current = ready;
  }, [ready]);
  useEffect(() => {
    if (ref.current)
      return createParticleSculptureRenderer(
        ref.current,
        () => readyRef.current,
        theme === "light",
      );
  }, [theme]);
  return (
    <div
      className={`relative ${className}`}
      role="img"
      aria-label="An organic infinity loop of fine particles with subtle sage highlights and a leaf-like fold at its crossing. Move your cursor across it to gently repel the particles; they return smoothly when it moves away."
    >
      <canvas
        className="absolute inset-0 block size-full"
        ref={ref}
        aria-hidden="true"
      />
    </div>
  );
}
