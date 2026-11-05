"use client";
import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Challenge = () => {
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
          { backgroundColor: "#c8fad4" },
          {
            backgroundColor: "#f8d0f5",
            duration: context.conditions?.reduce ? 0 : 0.7,
            ease: "power1.inOut",
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
    <section ref={root} className=" h-screen">
      Challenge
    </section>
  );
};

export default Challenge;
