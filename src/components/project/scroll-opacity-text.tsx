"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePageEntranceReady } from "@/components/providers/page-entrance";

export default function ScrollOpacityText({ paragraphs }: { paragraphs: string[] }) {
  const root = useRef<HTMLDivElement>(null);
  const ready = usePageEntranceReady();
  useLayoutEffect(() => {
    if (!ready) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      let disposed = false;
      let refreshFrame = 0;
      const triggers: ScrollTrigger[] = [];
      const words: HTMLElement[] = [];
      root.current!.querySelectorAll<HTMLElement>("[data-story-paragraph]").forEach(paragraph => {
        const paragraphWords = Array.from(paragraph.querySelectorAll<HTMLElement>("[data-story-word]"));
        words.push(...paragraphWords);
        const setters = paragraphWords.map(word => gsap.quickSetter(word, "opacity"));
        const paint = (progress: number) => {
          const position = progress * paragraphWords.length;
          setters.forEach((set, index) => set(0.5 + 0.5 * Math.max(0, Math.min(1, position - index))));
        };
        paint(0);
        const trigger = ScrollTrigger.create({
          trigger: paragraph, start: "top 75%", end: "bottom 75%",
          onUpdate: self => paint(self.progress),
          onRefresh: self => paint(self.progress),
        });
        triggers.push(trigger);
        paint(trigger.progress);
      });
      const refresh = () => {
        if (disposed) return;
        cancelAnimationFrame(refreshFrame);
        refreshFrame = requestAnimationFrame(() => { if (!disposed) ScrollTrigger.refresh(); });
      };
      // First-pass measurements must use the settled font and text wrapping.
      void document.fonts.ready.then(refresh);
      const observer = new ResizeObserver(refresh);
      observer.observe(root.current!);
      refresh();
      return () => {
        disposed = true;
        cancelAnimationFrame(refreshFrame);
        observer.disconnect();
        triggers.forEach(trigger => trigger.kill());
        words.forEach(word => word.style.removeProperty("opacity"));
      };
    }, root);
    return () => media.revert();
  }, [ready, paragraphs]);
  return <div ref={root} className="space-y-16 md:space-y-24">
    {paragraphs.map((paragraph, index) => <p key={index} data-story-paragraph className="font-serif text-[clamp(2.5rem,6.8vw,7rem)] font-normal leading-[1.04] tracking-[-0.055em]">
      {paragraph.split(/\s+/).map((word, i) => <span key={i}><span data-story-word>{word}</span>{" "}</span>)}
    </p>)}
  </div>;
}
