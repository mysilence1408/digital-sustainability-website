"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import home from "@/content/home";
import CompanionCardArt, { type CompanionCardKind } from "./companion-card-art";

const palettes = {
  "about": {
    "background": "#3ace67",
    "ink": "#2a4935",
    "pale": "#c8fbd4",
    "border": "#94ffb4"
  },
  "challenge": {
    "background": "#d464dc",
    "ink": "#552858",
    "pale": "#f8d0f6",
    "border": "#f3a9f9"
  },
  "solution": {
    "background": "#ffb627",
    "ink": "#664910",
    "pale": "#feebc9",
    "border": "#ffdfa0"
  }
};

export default function CompanionStoryCard({ kind }: { kind: CompanionCardKind }) {
  const root = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLHeadingElement>(null);
  const [active, setActive] = useState(0);
  const visible = useRef(false);
  const data = { ...palettes[kind], ...home[kind].card };


  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { visible.current = entry.isIntersecting; }, { threshold: .3 });
    observer.observe(root.current!);
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const timer = setInterval(() => {
      if (visible.current && !document.hidden && !motion.matches && document.documentElement.dataset.pageTransition !== "active" && !root.current?.contains(document.activeElement)) setActive(value => (value + 1) % 3);
    }, 5000);
    return () => { observer.disconnect(); clearInterval(timer); };
  }, []);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const card = root.current!;
      gsap.fromTo(card, { y: 38, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 90%", toggleActions: "play none none none" } });
      gsap.to(card.querySelector("[data-card-photo]"), { yPercent: -18, rotation: 7, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 1 } });
      const loop = gsap.timeline({ repeat: -1, yoyo: true, paused: true });
      const animateArt = (selector: string, vars: gsap.TweenVars) => {
        const targets = card.querySelectorAll(selector);
        if (targets.length) loop.to(targets, vars, 0);
      };
      animateArt("[data-art-float]", { y: (i: number) => i % 2 ? "-=12" : "+=12", duration: 2.7, stagger: .12, ease: "sine.inOut" });
      animateArt("[data-art-rotate]", { rotation: 10, duration: 2.7, transformOrigin: "50% 50%", ease: "sine.inOut" });
      animateArt("[data-art-pulse]", { scale: .7, duration: 2.7, transformOrigin: "50% 50%", ease: "sine.inOut" });
      animateArt("[data-art-line]", { strokeDashoffset: -28, duration: 2.7, ease: "none" });
      animateArt("[data-art-hand]", { rotation: 50, svgOrigin: "0 0", duration: 2.7, ease: "sine.inOut" });
      const sync = () => { if (visible.current && !document.hidden) loop.resume(); else loop.pause(); };
      const activity = new IntersectionObserver(([entry]) => { visible.current = entry.isIntersecting; sync(); }, { threshold: .1 });
      activity.observe(card);
      document.addEventListener("visibilitychange", sync);
      return () => { activity.disconnect(); document.removeEventListener("visibilitychange", sync); };
    }, root);
    return () => media.revert();
  }, []);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(content.current, { opacity: 0, y: 9 }, { opacity: 1, y: 0, duration: .5, ease: "power2.out" });
      const bars = root.current!.querySelectorAll("[data-art-bar]");
      if (bars.length) gsap.fromTo(bars, { scaleX: .6 }, { scaleX: 1, transformOrigin: "left center", duration: .8, stagger: .1, ease: "power3.out" });
    }, root);
    return () => media.revert();
  }, [active]);

  const style = { "--card-pale": data.pale, backgroundColor: data.background, color: data.ink, borderColor: data.border, boxShadow: `0 16px 32px -18px ${data.ink}55` } as CSSProperties;
  return <div ref={root} style={style} data-companion-card={kind} className="relative mx-auto my-5 aspect-square w-full max-w-[800px] rounded-[24px] border-[3px] sm:my-8 md:w-[76%] lg:w-[60%]">
    <div className="absolute inset-x-0 top-[6%] text-center">
      <p className="text-[8px] font-medium uppercase tracking-[.18em] sm:text-[10px]">{data.tag}</p>
      <div role="group" aria-label={`${kind} illustration steps`} className="mt-[4%] flex justify-center gap-[2%]">
        {data.steps.map((step, i) => <button key={step.label} type="button" aria-label={`${i + 1}. ${step.label}`} aria-pressed={active === i} onClick={() => setActive(i)} className="group flex w-[11%] cursor-pointer flex-col items-center gap-1 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current">
          <span className="flex aspect-square w-full items-center justify-center text-[clamp(1rem,2vw,1.6rem)] font-bold transition-colors [clip-path:polygon(30%_0,70%_0,100%_30%,100%_70%,70%_100%,30%_100%,0_70%,0_30%)]" style={{ backgroundColor: active === i ? data.ink : `${data.ink}18`, color: active === i ? data.pale : data.ink }}>{i + 1}</span>
          <span className="text-[8px] font-medium sm:text-[10px]">{step.label}</span>
        </button>)}
      </div>
      <h3 ref={content} className="mx-auto mt-[4%] max-w-[82%] text-[clamp(1rem,2.6vw,2.25rem)] font-semibold leading-[1.12] tracking-[-.045em]">{data.steps[active].line1}<br />{data.steps[active].line2}</h3>
    </div>
    <CompanionCardArt kind={kind} active={active} />
    <div data-card-photo className="pointer-events-none absolute -left-[12%] top-[27%] aspect-square w-[30%] -rotate-12 [clip-path:polygon(30%_0,70%_0,100%_30%,100%_70%,70%_100%,30%_100%,0_70%,0_30%)] max-sm:-left-[5%] max-sm:w-[22%]">
      <Image src={data.image.src} alt={data.image.alt} fill sizes="(min-width: 1024px) 200px, 22vw" className="object-cover" />
    </div>
    <span className="absolute bottom-[3%] left-[4%] text-[7px] uppercase tracking-[.12em] opacity-60 sm:text-[9px]">{home.cardNote}</span>
  </div>;
}
