"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePageEntranceReady } from "@/components/providers/page-entrance";
import project from "@/content/project";
import ProjectImage from "@/components/project/project-image";
import { projectImages } from "./project-content";

export default function ProjectGallery() {
  const root = useRef<HTMLElement>(null);
  const ready = usePageEntranceReady();
  useLayoutEffect(() => {
    if (!ready) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        desktop: "(min-width: 768px)",
      },
      (context) => {
        if (!context.conditions?.motion) return;
        const desktop = context.conditions.desktop;
        const section = root.current!;
        const gallery = section.querySelector<HTMLElement>("[data-gallery]")!;
        let disposed = false;
        let refresh = 0;
        const images = Array.from(gallery.querySelectorAll("img"));
        // Keep the initial CSS mask until real image pixels and fonts are ready.
        // Register asynchronous tweens with the matchMedia context for cleanup.
        void Promise.all([
          document.fonts.ready,
          ...images.map((image) => image.decode().catch(() => {})),
        ]).then(() => {
          if (disposed) return;
          context.add(() => {
            const opening = gsap.timeline();
            opening.to(section.querySelectorAll("[data-opening-copy]"), {
              y: 0,
              opacity: 1,
              duration: 1.1,
              stagger: 0.1,
              ease: "power3.out",
            });
            opening.to(
              gallery.querySelectorAll("[data-image-clip]"),
              {
                clipPath: "inset(0% 0 0 0)",
                duration: 1.35,
                stagger: { each: 0.12, from: "center" },
                ease: "power3.inOut",
              },
              0.15,
            );
            const travel = gsap.timeline({
              scrollTrigger: {
                trigger: gallery,
                start: "top 60%",
                end: "bottom 15%",
                scrub: true,
              },
            });
            travel.fromTo(
              gallery.querySelector("[data-gallery-center]"),
              { scale: 1, yPercent: 0 },
              { scale: desktop ? 1.14 : 1.08, yPercent: -4, ease: "none" },
              0,
            );
            gallery
              .querySelectorAll<HTMLElement>("[data-gallery-side]")
              .forEach((image, index) => {
                travel.fromTo(
                  image,
                  { yPercent: 0, xPercent: 0, scale: 1 },
                  {
                    yPercent: -12,
                    xPercent: index ? 10 : -10,
                    scale: 0.97,
                    ease: "none",
                  },
                  0,
                );
                gsap.fromTo(
                  image.querySelector("[data-image-drift]"),
                  { yPercent: -3 },
                  {
                    yPercent: 3,
                    ease: "none",
                    scrollTrigger: {
                      trigger: gallery,
                      start: "top bottom",
                      end: "bottom top",
                      scrub: true,
                    },
                  },
                );
              });
            refresh = requestAnimationFrame(() => ScrollTrigger.refresh());
          });
        });
        return () => {
          disposed = true;
          cancelAnimationFrame(refresh);
        };
      },
      root,
    );
    return () => media.revert();
  }, [ready]);

  return (
    <section
      ref={root}
      aria-labelledby="project-title"
      className="overflow-hidden pb-14 pt-32 sm:pb-24 sm:pt-40"
    >
      <h1
        id="project-title"
        data-enter
        data-opening-copy
        className="text-center font-serif text-[clamp(4rem,8.5vw,9rem)] font-normal leading-none tracking-[-0.055em] motion-safe:[transform:translateY(32px)] motion-safe:opacity-0"
      >
        {project.title}
      </h1>
      <p
        data-enter
        data-opening-copy
        className="mb-14 mt-6 text-center text-xs uppercase tracking-[0.2em] sm:mb-20 sm:text-sm lg:text-base motion-safe:[transform:translateY(32px)] motion-safe:opacity-0"
      >
        {project.subtitle}
      </p>
      <div
        data-gallery
        className="mx-auto grid w-[135%] -translate-x-[13%] grid-cols-[1fr_1.47fr_1fr] items-center gap-2 md:w-full md:translate-x-0 md:gap-[10px]"
      >
        <figure
          data-gallery-side
          data-enter
          className="relative m-0 aspect-[3/4.1]"
        >
          <ProjectImage
            {...projectImages.forest}
            reveal
            priority
            sizes="(min-width: 768px) 25vw, 34vw"
          />
        </figure>
        <figure
          data-gallery-center
          data-enter
          className="relative m-0 aspect-[4.4/6.3]"
        >
          <ProjectImage
            {...projectImages.lake}
            reveal
            priority
            sizes="(min-width: 768px) 40vw, 50vw"
          />
        </figure>
        <figure
          data-gallery-side
          data-enter
          className="relative m-0 aspect-[3/4.1]"
        >
          <ProjectImage
            {...projectImages.energy}
            reveal
            priority
            sizes="(min-width: 768px) 25vw, 34vw"
          />
        </figure>
      </div>
    </section>
  );
}
