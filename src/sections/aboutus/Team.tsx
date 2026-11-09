"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { usePageEntranceReady } from "@/components/providers/page-entrance";
import { gsap } from "gsap";
import about from "@/content/about";
import ParticlePortrait from "@/components/team/particle-portrait";
import EncryptedText from "@/components/team/encrypted-text";

const members = about.members;

export default function Team() {
  const entranceReady = usePageEntranceReady();
  const root = useRef<HTMLElement>(null);
  const text = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLSpanElement>(null);
  const [member, setMember] = useState(0);
  const [paused, setPaused] = useState(false);
  const next = useCallback(
    () => setMember((value) => (value + 1) % members.length),
    [],
  );
  const current = members[member];

  useLayoutEffect(() => {
    // Next.js can restore this section with its previous state. Its layout
    // effects reconnect on re-entry; reset before the restored page paints.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMember(0);
    const restore = () => setMember(0);
    window.addEventListener("pageshow", restore);
    return () => window.removeEventListener("pageshow", restore);
  }, []);

  useEffect(() => {
    let visible = false;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.3 },
    );
    observer.observe(root.current!);
    const timer = setInterval(() => {
      if (
        entranceReady &&
        !paused &&
        visible &&
        !document.hidden &&
        !motion.matches &&
        document.documentElement.dataset.navigationOpen !== "true"
      )
        next();
    }, 8000);
    return () => {
      clearInterval(timer);
      observer.disconnect();
    };
  }, [member, next, paused, entranceReady]);

  useLayoutEffect(() => {
    if (!entranceReady) return;
    const media = gsap.matchMedia();
    media.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        gsap.fromTo(
          root.current!.querySelectorAll("[data-member-copy]"),
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.09,
            ease: "power3.out",
          },
        );
      },
      root,
    );
    return () => media.revert();
  }, [member, entranceReady]);

  return (
    <section
      ref={root}
      aria-labelledby="team-title"
      className="relative isolate min-h-svh overflow-hidden bg-[#020c0f] px-5 pb-8 pt-28 text-[#d8e9e9] sm:px-9 lg:h-svh lg:min-h-[720px] lg:px-12 lg:pt-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_48%_60%,#12323a55,transparent_65%)]"
      />
      <div className="relative z-10 flex items-start justify-between gap-6">
        <p className="pt-2 font-mono text-[9px] uppercase tracking-[.2em] text-[#829b9f]">
          <EncryptedText text={about.eyebrowLine1} delay={.1} />
          <br />
          <span className="mt-2 block"><EncryptedText text={about.eyebrowLine2} delay={.2} /></span>
        </p>
        <h1
          id="team-title"
          className="text-[clamp(2.8rem,5vw,5.5rem)] font-light leading-none tracking-[.28em]"
        >
          <EncryptedText text={about.title} delay={.1} />
        </h1>
      </div>

      <div className="relative mt-8 h-[55svh] min-h-[360px] lg:absolute lg:inset-y-10 lg:left-[8%] lg:mt-0 lg:h-auto lg:w-[70%]">
        <ParticlePortrait member={member} />
        <button
          type="button"
          onClick={next}
          aria-label="Show next team member"
          onPointerMove={(event) => {
            if (event.pointerType === "touch") return;
            const rect = event.currentTarget.getBoundingClientRect();
            if (cursor.current) {
              cursor.current.style.left = `${event.clientX - rect.left}px`;
              cursor.current.style.top = `${event.clientY - rect.top}px`;
            }
          }}
          className="group absolute inset-0 z-20 cursor-pointer touch-pan-y focus-visible:outline-1 focus-visible:outline-offset-[-8px] focus-visible:outline-[#4a46ff]"
        >
          <span
            ref={cursor}
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 flex size-[76px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-[#3530ff] text-white opacity-0 shadow-[0_0_40px_#3530ff30] transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
          >
            <svg
              viewBox="0 0 32 24"
              className="h-6 w-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path d="M3 12h24M19 4l8 8-8 8" />
            </svg>
            <span className="mt-1 font-mono text-[8px] uppercase tracking-widest">
              {about.nextLabel}</span>
          </span>
        </button>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 flex justify-between text-xs font-light text-[#8eaaae]/50"
        >
          {Array.from({ length: 6 }, (_, index) => (
            <span key={index}>+</span>
          ))}
        </div>
      </div>

      <div
        ref={text}
        className="pointer-events-none relative z-10 mt-5 grid gap-8 lg:absolute lg:inset-x-12 lg:bottom-24 lg:mt-0 lg:grid-cols-[1fr_280px] lg:items-end"
      >
        <div>
          <p
            data-member-copy
            className="mb-5 font-mono text-[10px] tracking-[.18em] text-[#6a9aab]"
          >
            <EncryptedText text={`[[ ${String(member + 1).padStart(3, "0")} ]]`} delay={.3} />
          </p>
          <h2
            data-member-copy
            className="text-2xl font-light tracking-tight sm:text-3xl"
          >
            <EncryptedText text={current.name} delay={.35} />
          </h2>
          <p
            data-member-copy
            className="mt-2 text-xs leading-relaxed text-[#a2b6ba]"
          >
            <EncryptedText text={current.role} delay={.45} />
          </p>
        </div>
        <p
          data-member-copy
          className="max-w-sm text-[13px] leading-[1.85] text-[#acbfc2]"
        >
          <EncryptedText text={current.description} delay={.5} />
        </p>
      </div>

      <div className="relative z-30 mt-10 flex flex-wrap items-center justify-between gap-5 border-t border-[#8eaaae]/15 pt-5 font-mono text-[9px] uppercase tracking-[.14em] text-[#8eaaae] lg:absolute lg:inset-x-12 lg:bottom-7 lg:mt-0">
        <span>
          {about.scanLabel + " / "}{" "}
          <span className="text-[#d8e9e9]">
            {String(member + 1).padStart(2, "0")}
          </span>{" "}
          - {String(members.length).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-5">
          <button
            type="button"
            aria-pressed={paused}
            onClick={() => setPaused((value) => !value)}
            className="cursor-pointer py-2 hover:text-white focus-visible:outline focus-visible:outline-[#4a46ff]"
          >
            {paused ? about.resumeLabel : about.pauseLabel} {about.autoplayLabel}
          </button>
          <button
            type="button"
            onClick={next}
            className="flex cursor-pointer items-center gap-3 py-2 text-[#d8e9e9] hover:text-[#8e88ff] focus-visible:outline focus-visible:outline-[#4a46ff]"
          >
            {about.nextMemberLabel}<span aria-hidden="true">&#8594;</span>
          </button>
        </div>
      </div>
    </section>
  );
}



