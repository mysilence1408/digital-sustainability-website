"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionTitle, {
  notifySectionBackgroundReady,
} from "@/components/landing/section-title";
import Image from "next/image";
import aboutLeaf from "../../../public/images/about_leaf.gif";

const About = () => {
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
          { backgroundColor: "#fdf8f4" },
          {
            backgroundColor: "#c8fad4",
            duration: context.conditions?.reduce ? 0 : 0.7,
            ease: "power1.inOut",
            onComplete: () => notifySectionBackgroundReady(section),
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
      data-companion-shape="1"
      id="about"
      className="h-auto flex flex-col items-center justify-center text-[#2b4836] gap-7 px-5 sm:px-9 lg:px-12 py-10 lg:py-30"
    >
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em]">
          Your digital life, with a little more care
        </p>
        <SectionTitle
          id="about-title"
          className="mt-6 text-[clamp(2.5rem,5.5vw,5rem)] font-medium leading-[1.05] tracking-[-0.055em]"
        >
          Small choices.
          <br />
          <span className="text-[#34824f]">Meaningful change.</span>
        </SectionTitle>
        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-[#222222]/65">
          A companion to help you understand your impact and find a more mindful
          way forward.
        </p>
      </header>

      <Image
        src={aboutLeaf}
        alt="AboutImg"
        className=" rounded-2xl w-200 h-200 object-cover object-center"
      />
      <p className=" max-w-xl mx-auto text-center text-3xl">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Accusantium
        quis aut, quia deserunt ducimus vel nihil corrupti quam eaque maxime
        iure aliquid atque fuga voluptate dolorem ipsum provident ut. Nobis?
      </p>
    </section>
  );
};

export default About;
