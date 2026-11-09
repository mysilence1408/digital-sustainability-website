"use client";
import { useLayoutEffect, useRef } from "react";
import { usePageEntranceReady } from "@/components/providers/page-entrance";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import home from "@/content/home";
const hero = home.hero;

import LetterReveal from "@/components/landing/letter-reveal";
import FollowingCompanion from "@/components/landing/following-companion";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const formationReady = useRef(false);
  const entranceReady = usePageEntranceReady();
  useLayoutEffect(() => {
    if (!entranceReady) {
      formationReady.current = false;
      return;
    }
    const section = root.current;
    if (!section) return;
    formationReady.current = false;
    gsap.registerPlugin(CustomEase);
    const ease = CustomEase.create("companion-reveal", "0.16,1,0.3,1");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    const gradients = section.querySelectorAll<HTMLElement>(
      "[data-gradient-word]",
    );
    const letterLayers = section.querySelectorAll<HTMLElement>(
      "[data-letter-layer]",
    );
    const staticGradient = () => {
      gsap.set(gradients, { opacity: 1, backgroundPosition: "0% 50%" });
      gsap.set(letterLayers, { opacity: 0 });
    };
    const context = gsap.context(() => {
      if (motion.matches) {
        staticGradient();
        formationReady.current = true;
        return;
      }
      // Keep the previous per-letter delays and exact cubic-bezier easing.
      const title = gsap.timeline({
        onComplete: () => {
          if (!disposed) formationReady.current = true;
        },
      });
      section
        .querySelectorAll<HTMLElement>("[data-letter]")
        .forEach((letter) => {
          title.fromTo(
            letter,
            { yPercent: 115, rotation: 3, opacity: 0 },
            {
              yPercent: 0,
              rotation: 0,
              opacity: 1,
              duration: 1,
              ease,
              clearProps: "transform,opacity",
            },
            0.22 + Number(letter.dataset.letter) * 0.022,
          );
        });
      const letterIndices = Array.from(
        section.querySelectorAll<HTMLElement>("[data-letter]"),
        (letter) => Number(letter.dataset.letter),
      );
      const titleEnd = 0.22 + Math.max(0, ...letterIndices) * 0.022 + 1;
      // Separate gradient layers preserve a continuous color field across each word.
      // The existing letter masks and descender clearance remain unchanged.
      const color = gsap.timeline();
      color.to(
        letterLayers,
        { opacity: 0, duration: 0.55, ease: "power1.inOut" },
        titleEnd,
      );
      color.to(
        gradients,
        { opacity: 1, duration: 0.55, ease: "power1.inOut" },
        titleEnd,
      );
      gsap.fromTo(
        gradients,
        { backgroundPosition: "0% 50%" },
        {
          backgroundPosition: "100% 50%",
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: titleEnd,
        },
      );
      const supporting = gsap.timeline();
      section
        .querySelectorAll<HTMLElement>("[data-enter]")
        .forEach((element) => {
          supporting.fromTo(
            element,
            { y: 18, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.1,
              ease,
              clearProps: "transform,opacity",
            },
            Number(element.dataset.enter) / 1000,
          );
        });
    }, section);
    const finish = () => {
      context.revert();
      context.add(staticGradient);
      if (!disposed) formationReady.current = true;
    };
    motion.addEventListener("change", finish);
    return () => {
      disposed = true;
      formationReady.current = false;
      context.revert();
      motion.removeEventListener("change", finish);
    };
  }, [entranceReady]);

  return (
    <section
      ref={root}
      id="companion"
      aria-labelledby="companion-title"
      className="relative isolate min-h-svh w-full overflow-hidden bg-[#fdf8f4] font-sans text-[#222222] selection:bg-[#f4d7bf] selection:text-[#222222] [font-family:var(--font-geist-sans),Arial,sans-serif] [&_button]:cursor-pointer [&_:is(a,button):focus-visible]:outline-2 [&_:is(a,button):focus-visible]:outline-offset-4 [&_:is(a,button):focus-visible]:outline-[#38754b]"
    >
      <div className="mx-auto flex min-h-svh max-w-[1800px] flex-col px-5 sm:px-9 lg:px-12">
        {/* Reserved for the navbar you will add later. */}
        <div
          aria-hidden="true"
          data-navbar-space
          className="h-20 shrink-0 sm:h-24"
        />

        <div className="relative z-20 mt-8 sm:mt-9 lg:mt-7">
          <div
            data-enter="100"
            className="pointer-events-none absolute top-1 right-0 hidden max-w-[190px] text-[11px] leading-[1.7] text-[#746a61] lg:block"
          >
            <span className="mb-2 block font-mono text-[9px] tracking-[0.14em] text-[#367348] uppercase">
              {hero.researchLabel}</span>
            {hero.researchSummary}</div>
          <h1
            id="companion-title"
            aria-label={hero.titleLines.join(" ")}
            className="font-normal tracking-[-0.075em]"
          >
            <span className="block text-[clamp(3.5rem,7.65vw,8.6rem)] leading-[1.06]">
              <LetterReveal text={hero.titleLines[0]} />
            </span>
            <span className="mt-1 block text-[clamp(2.3rem,11.65vw,13rem)] leading-[0.98] sm:-mt-1">
              <LetterReveal text={hero.titleLines[1]} start={Array.from(hero.titleLines[0]).length} gradient />
            </span>
            <span className="mt-1 block text-right text-[clamp(3rem,8.55vw,9.5rem)] leading-[1]">
              <LetterReveal text={hero.titleLines[2]} start={Array.from(hero.titleLines[0]).length + Array.from(hero.titleLines[1]).length + 1} />
            </span>
          </h1>
        </div>

        <div className="relative grid flex-1 lg:grid-cols-[1.55fr_1fr] lg:gap-14 xl:gap-24">
          <figure className="relative -mx-5 h-[300px] sm:-mx-9 sm:h-[380px] lg:mx-0 lg:h-auto lg:min-h-[420px] xl:min-h-[450px]">
            <div className="absolute inset-x-[-8%] inset-y-[-18%] sm:inset-x-[-14%] lg:inset-y-[-22%]">
              <FollowingCompanion formationReady={formationReady} />
            </div>
            <figcaption
              data-enter="1250"
              className="pointer-events-none absolute inset-x-5 bottom-3 flex justify-between gap-3 font-mono text-[8px] tracking-[0.08em] text-[#746e65] uppercase sm:inset-x-9 lg:inset-x-0 lg:bottom-7"
            >
              <span>{hero.particleCaption}</span>
            </figcaption>
          </figure>

          <div className="relative z-20 flex flex-col justify-center pb-8 lg:pt-8 lg:pb-9">
            <p
              data-enter="850"
              className="mb-4 flex items-center gap-3 font-mono text-[9px] tracking-[0.16em] text-[#367348] uppercase"
            >
              <span className="h-px w-7 bg-[#367348]" /> {hero.eyebrow}</p>
            <h2
              data-enter="1000"
              className="max-w-[400px] text-[clamp(1.65rem,2.3vw,2.5rem)] leading-[1.16] tracking-[-0.045em]"
            >
              {hero.heading}</h2>
            <p
              data-enter="1100"
              className="mt-4 max-w-[380px] text-[13px] leading-[1.85] text-[#73675e]"
            >
              {hero.description}
            </p>
            <div
              data-enter="1250"
              className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4"
            >
              <button
                type="button"
                disabled
                aria-label={hero.buttonAccessibleLabel}
                className="flex items-center gap-8 rounded-full border border-[#222222] bg-[#222222] px-5 py-3.5 text-xs font-medium text-white disabled:cursor-not-allowed"
              >
                <span>{hero.buttonLabel}</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="8.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 7v5l3 2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <p
              data-enter="1400"
              className="mt-5 font-mono text-[9px] tracking-[0.03em] text-[#817368]"
            >
              {hero.researchLabel}</p>
          </div>
        </div>

        <div
          data-enter="1550"
          className="relative z-20 border-t border-[#baa58f]/20 pt-5 pb-5 sm:pb-6"
        >
          <div className="grid gap-4 sm:grid-cols-3 sm:gap-8">
            {hero.highlights.map(({number, title, description}) => (
              <div key={number} className="flex items-baseline gap-3">
                <span className="font-mono text-[8px] text-[#9b8068]">
                  {number}
                </span>
                <h2 className="text-xs text-[#3e5141]">{title}</h2>
                <span className="text-[11px] text-[#786b60]">
                  {description}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 font-mono text-[8px] tracking-[0.08em] text-[#8a7a6d] uppercase">
            <span>{hero.bottomLeft}</span>
            <span>{hero.bottomRight}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
