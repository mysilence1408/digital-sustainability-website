"use client";
import React, { useLayoutEffect, useRef } from "react";
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
      className=" h-screen px-5 sm:px-9 lg:px-12 py-10 lg:py-30"
    >
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em]">
          Your digital life, with a little more care
        </p>
        <SectionTitle
          id="solution-title"
          className="mt-6 text-[clamp(2.5rem,5.5vw,5rem)] font-medium leading-[1.05] tracking-[-0.055em]"
        >
          Small choices.
          <br />
          <span className="text-[#654912]">Meaningful change.</span>
        </SectionTitle>
        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-[#222222]/65">
          A companion to help you understand your impact and find a more mindful
          way forward.
        </p>
      </header>
    </section>
  );
};

export default Solution;
