"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionTitle, {
  notifySectionBackgroundReady,
  notifySectionBackgroundReset,
} from "@/components/landing/section-title";
import home from "@/content/home";
const copy = home.features;

import FeatureCard from "@/components/landing/feature-card";

const features = [
  {
    color: "#ff584b",
    borderColor: "#ffc6b3",
  },
  {
    color: "#ffc820",
    borderColor: "#ffde92",
  },
  {
    color: "#2ef34e",
    borderColor: "#a3f8bd",
  },
  {
    color: "#00cba9",
    borderColor: "#a5ded4",
  },
];

export default function Features() {
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
        desktop: "(min-width: 768px)",
      },
      (context) => {
        const reduced = context.conditions?.reduce;
        const desktop = context.conditions?.desktop;
        gsap.fromTo(
          section,
          { backgroundColor: "#feebca" },
          {
            backgroundColor: "#F3F6F4",
            duration: reduced ? 0 : 0.7,
            ease: "power1.inOut",
            onComplete: () => notifySectionBackgroundReady(section),
            onReverseComplete: () => notifySectionBackgroundReset(section),
            scrollTrigger: {
              trigger: section,
              start: "top 30%",
              toggleActions: "play none none reverse",
            },
          },
        );
        if (reduced) return;
        const cards = gsap.utils.toArray<HTMLElement>(
          "[data-feature-card]",
          section,
        );
        // Set the starting layout once, before paint. A scrubbed fromTo with
        // invalidation can reapply its starting values during a trigger refresh.
        gsap.set(cards, {
          y: (index) => (desktop ? 70 + index * 48 : (index % 2) * 32 + 30),
        });
        gsap.to(cards, {
          y: (index) => (desktop ? -35 + index * 13 : (index % 2) * 12 - 12),
          ease: "none",
          stagger: desktop ? 0.07 : 0.035,
          scrollTrigger: {
            trigger: section.querySelector("[data-feature-grid]"),
            start: "top bottom",
            end: "bottom 25%",
            scrub: 0.6,
          },
        });
      },
      section,
    );
    return () => media.revert();
  }, []);

  return (
    <section
      ref={root}
      data-companion-shape="4"
      aria-labelledby="features-title"
      className="h-auto gap-7 px-5 sm:px-9 lg:px-12 py-10 lg:py-30"
    >
      <div className="mx-auto max-w-[120rem]">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em]">
            {copy.eyebrow}
          </p>
          <SectionTitle
            id="features-title"
            className="mt-6 text-[clamp(2.5rem,5.5vw,5rem)] font-medium leading-[1.05] tracking-[-0.055em]"
          >
            {copy.title}
            <br />
            <span className="text-[#686D76]">{copy.accent}</span>
          </SectionTitle>
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-[#222222]/65">
            {copy.description}
          </p>
        </header>
        <div
          data-feature-grid
          className="mt-14 grid grid-cols-2 gap-x-4 gap-y-14 pb-12 sm:gap-x-6 md:mt-20 md:grid-cols-4 md:gap-x-5 lg:gap-x-7"
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              index={index}
              {...feature}
              title={copy.items[index].title}
              description={copy.items[index].description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
