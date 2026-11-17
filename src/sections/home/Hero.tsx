"use client";
import SiteIcon from "@/components/ui/site-icon";
import site from "@/content/site";
import { useLayoutEffect, useRef } from "react";
import { usePageEntranceReady } from "@/components/providers/page-entrance";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import home from "@/content/home";
const hero = home.hero;

import LetterReveal from "@/components/landing/letter-reveal";
import HeroLeaf from "@/components/landing/hero-leaf";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const entranceReady = usePageEntranceReady();
  useLayoutEffect(() => {
    if (!entranceReady) return;
    const section = root.current;
    if (!section) return;
    gsap.registerPlugin(CustomEase);
    const ease = CustomEase.create("companion-reveal", "0.16,1,0.3,1");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
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
        return;
      }

      const title = gsap.timeline();
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
      const leaf = section.querySelector<HTMLElement>("[data-hero-leaf]");
      if (leaf) {
        gsap.fromTo(
          leaf,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.6,
            delay: title.duration(),
            ease: "power1.out",
            clearProps: "opacity,visibility",
          },
        );
      }
    }, section);
    const finish = () => {
      context.revert();
      context.add(staticGradient);
    };
    motion.addEventListener("change", finish);
    return () => {
        context.revert();
      motion.removeEventListener("change", finish);
    };
  }, [entranceReady]);

  return (
    <section
      ref={root}
      id="companion"
      aria-labelledby="companion-title"
      className="relative isolate min-h-svh w-full overflow-hidden bg-[var(--page)] font-sans text-[var(--ink)] [&_button]:cursor-pointer [&_:is(a,button):focus-visible]:outline-2 [&_:is(a,button):focus-visible]:outline-offset-4 [&_:is(a,button):focus-visible]:outline-[var(--accent)]"
    >
      <div className="mx-auto flex min-h-svh max-w-[1800px] flex-col px-5 sm:px-9 lg:px-12">

        <div
          aria-hidden="true"
          data-navbar-space
          className="h-20 shrink-0 sm:h-24"
        />

        <div className="relative z-20 mt-8 sm:mt-9 lg:mt-7">
          <div
            data-enter="100"
            className="pointer-events-none absolute top-1 right-0 hidden max-w-[190px] text-body leading-[1.7] text-[var(--copy)] lg:block"
          >
            <span className="mb-2 block font-sans text-body tracking-[0.14em] text-[var(--accent)] uppercase">
              {hero.researchLabel}
            </span>
            {hero.researchSummary}
          </div>
          <h1
            id="companion-title"
            aria-label={hero.titleLines.join(" ")}
            className="font-normal tracking-[-0.075em]"
          >
            <span className="block text-[clamp(3.5rem,7.65vw,8.6rem)] leading-[1.06]">
              <LetterReveal text={hero.titleLines[0]} />
            </span>
            <span className="mt-1 block text-[clamp(2.3rem,11.65vw,13rem)] leading-[0.98] sm:-mt-1">
              <LetterReveal
                text={hero.titleLines[1]}
                start={Array.from(hero.titleLines[0]).length}
                gradient
              />
            </span>
            <span className="mt-1 block text-right text-[clamp(3rem,8.55vw,9.5rem)] leading-[1]">
              <LetterReveal
                text={hero.titleLines[2]}
                start={
                  Array.from(hero.titleLines[0]).length +
                  Array.from(hero.titleLines[1]).length +
                  1
                }
              />
            </span>
          </h1>
        </div>

        <div className="relative grid flex-1 lg:grid-cols-[1.55fr_1fr] lg:gap-14 xl:gap-24">
          <figure className="relative -mx-5 sm:-mx-9 lg:mx-0 lg:min-h-[420px] xl:min-h-[450px]">
            <div className="relative h-[300px] sm:h-[380px] lg:absolute lg:inset-0 lg:h-auto">
              <div className="absolute inset-x-[-8%] inset-y-[-18%] sm:inset-x-[-14%] lg:inset-y-[-22%]">
                <HeroLeaf />
              </div>
            </div>
            <figcaption
              data-enter="1250"
              className="pointer-events-none relative z-10 mt-8 flex justify-between gap-3 px-5 pb-8 font-sans text-body tracking-[0.08em] text-[var(--copy)] uppercase sm:px-9 lg:absolute lg:inset-x-0 lg:bottom-7 lg:mt-0 lg:px-0 lg:pb-0 lg:text-[#fffdf5] lg:[text-shadow:0_1px_3px_#191714,0_0_5px_#191714]"
            >
              <span>{hero.particleCaption}</span>
            </figcaption>
          </figure>

          <div className="relative z-20 flex flex-col justify-center pb-8 lg:pt-8 lg:pb-9">
            <p
              data-enter="850"
              className="mb-4 flex items-center gap-3 font-sans text-body tracking-[0.16em] text-[var(--accent)] uppercase"
            >
              <span className="h-px w-7 bg-[var(--accent)]" /> {hero.eyebrow}
            </p>
            <h2
              data-enter="1000"
              className="max-w-[400px] text-heading leading-[1.16] tracking-[-0.045em]"
            >
              {hero.heading}
            </h2>
            <p
              data-enter="1100"
              className="mt-4 max-w-[380px] text-body leading-[1.7] text-[var(--copy)]"
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
                className="flex items-center gap-8 rounded-full border border-[var(--accent)] bg-[var(--accent)] px-5 py-3.5 text-body font-medium text-[var(--on-accent)] disabled:cursor-not-allowed"
              >
                <span>{hero.buttonLabel}</span>
                <SiteIcon name={site.icons.comingSoon} className="size-4" />
              </button>
            </div>
            <p
              data-enter="1400"
              className="mt-5 font-sans text-body tracking-[0.03em] text-[var(--copy)]"
            >
              {hero.researchLabel}
            </p>
          </div>
        </div>

        <div
          data-enter="1550"
          className="relative z-20 border-t border-[var(--line)]/20 pt-5 pb-5 sm:pb-6"
        >
          <div className="grid gap-4 sm:grid-cols-3 sm:gap-8">
            {hero.highlights.map(({ number, title, description }) => (
              <div
                key={number}
                className="grid grid-cols-[auto_1fr] items-baseline gap-x-3 gap-y-1"
              >
                <span className="font-sans text-body text-[var(--copy)]">
                  {number}
                </span>
                <h2 className="text-body text-[var(--accent)]">{title}</h2>
                <span className="col-start-2 text-body leading-relaxed text-[var(--copy)]">
                  {description}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 font-sans text-body tracking-[0.08em] text-[var(--copy)] uppercase">
            <span>{hero.bottomLeft}</span>
            <span>{hero.bottomRight}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
