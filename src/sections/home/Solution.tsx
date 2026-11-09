"use client";
import React, { useLayoutEffect, useRef } from "react";
import home from "@/content/home";
const copy = home.solution;

import CompanionStoryCard from "@/components/landing/companion-story-card";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionTitle, {
  notifySectionBackgroundReady,
  notifySectionBackgroundReset,
} from "@/components/landing/section-title";

const Solution = () => {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add(
      {
        reduce: "(prefers-reduced-motion: reduce)",
        motion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        gsap.fromTo(
          section,
          { backgroundColor: "#f8d0f5" },
          {
            backgroundColor: "#feebca",
            duration: context.conditions?.reduce ? 0 : 0.7,
            ease: "power1.inOut",
            onComplete: () => notifySectionBackgroundReady(section),
            onReverseComplete: () => notifySectionBackgroundReset(section),
            scrollTrigger: {
              trigger: section,
              // Switch when About's top reaches 20% down the viewport.
              start: "top 30%",
              end: "bottom top",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            },
          },
        );
      },
      section,
    );

    return () => media.revert();
  }, []);
  return (
    <section
      ref={root}
      data-companion-shape="3"
      className=" h-auto flex flex-col items-center justify-center gap-7 px-7 sm:px-9 lg:px-12 py-16 lg:py-30"
    >
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em]">
          {copy.eyebrow}</p>
        <SectionTitle
          id="solution-title"
          className="mt-6 text-[clamp(2.5rem,5.5vw,5rem)] font-medium leading-[1.05] tracking-[-0.055em]"
        >
          {copy.title}<br />
          <span className="text-[#654912]">{copy.accent}</span>
        </SectionTitle>
        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-[#222222]/65">
          {copy.description}</p>
      </header>
      <CompanionStoryCard kind="solution" />
      <p className="mx-auto max-w-2xl text-center text-base leading-relaxed text-[#222222]/75 sm:text-lg">
        {copy.caption}</p>
    </section>
  );
};

export default Solution;
