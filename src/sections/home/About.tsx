"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
      id="about"
      className="h-auto flex flex-col items-center justify-center text-[#2b4836] gap-7 px-5 sm:px-9 lg:px-12 py-10"
    >
      <h3 className=" text-9xl font-bold">title</h3>

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
