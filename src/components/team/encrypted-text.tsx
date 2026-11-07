"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

/** A landing-only decode, with the final text reserving its original layout. */
export default function EncryptedText({ text, delay = 0 }: { text: string; delay?: number }) {
  const display = useRef<HTMLSpanElement>(null);
  const initialText = useRef(text);
  const memberChanged = useRef(false);
  useLayoutEffect(() => {
    const element = display.current!;
    if (text !== initialText.current) memberChanged.current = true;
    if (memberChanged.current) { element.textContent = text; return; }
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const state = { progress: 0 };
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%/+";
      const letters = Array.from(text);
      const paint = () => {
        const resolved = Math.floor(state.progress * letters.length);
        const tick = Math.floor(state.progress * 24);
        element.textContent = letters.map((letter, index) => /\s/.test(letter) || index < resolved ? letter : chars[(index * 17 + tick * 11) % chars.length]).join("");
      };
      paint();
      gsap.to(state, { progress: 1, delay, duration: 1.15, ease: "none", onUpdate: paint, onComplete: () => { element.textContent = text; } });
      return () => { element.textContent = text; };
    });
    return () => { media.revert(); element.textContent = text; };
  }, [text, delay]);

  return <span className="relative inline-grid max-w-full align-baseline">
    <span className="col-start-1 row-start-1 opacity-0">{text}</span>
    <span ref={display} aria-hidden="true" className="col-start-1 row-start-1">{text}</span>
  </span>;
}


