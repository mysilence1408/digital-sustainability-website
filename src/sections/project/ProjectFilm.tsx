"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePageEntranceReady } from "@/components/providers/page-entrance";
import { projectVideo } from "@/sections/project/project-content";

export default function ProjectFilm() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const ready = usePageEntranceReady();
  const [playing, setPlaying] = useState(false);
  const manualPause = useRef(false);

  useLayoutEffect(() => {
    if (!ready) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const timeline = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top bottom", end: "top top", scrub: true, invalidateOnRefresh: true } });
      // Width and bottom stay fixed. Only the top edge extends upward;
      // object-cover crops the video naturally rather than squashing it.
      timeline.fromTo(frame.current, { top: "32%" }, { top: "0%", ease: "none" });
      gsap.fromTo(copy.current, { yPercent: 30 }, { yPercent: -10, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
    }, root);
    return () => media.revert();
  }, [ready]);

  useEffect(() => {
    const surface = video.current!;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const sync = () => {
      if (visible && ready && !motion.matches && !manualPause.current && !document.hidden) void surface.play().catch(() => {});
      else surface.pause();
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: 0.1 });
    observer.observe(surface);
    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => { observer.disconnect(); motion.removeEventListener("change", sync); document.removeEventListener("visibilitychange", sync); surface.pause(); };
  }, [ready]);

  const toggle = () => {
    const surface = video.current!;
    manualPause.current = !surface.paused;
    if (surface.paused) void surface.play().catch(() => {});
    else surface.pause();
  };

  return <section ref={root} aria-labelledby="project-film-title" className="relative h-[115svh] min-h-[640px] bg-[#fdf8f4] md:h-[135svh]">
    <div className="sticky top-0 h-svh min-h-[560px] overflow-hidden">
      <div ref={frame} className="absolute inset-0 overflow-hidden bg-[#293c31]">
        <video ref={video} src={projectVideo.src} poster={projectVideo.poster} muted loop playsInline preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} aria-label="Project film placeholder" className="size-full object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
      </div>
      <div ref={copy} className="pointer-events-none absolute inset-x-4 bottom-[13%] text-center text-[#fdf8f4] sm:inset-x-9">
        <h2 id="project-film-title" className="font-serif text-[clamp(2.8rem,7vw,7.5rem)] font-normal uppercase leading-[0.95] tracking-[-0.05em]">{projectVideo.title[0]}<br />{projectVideo.title[1]}</h2>
        <p className="mx-auto mt-6 max-w-md text-xs uppercase tracking-[0.16em] sm:text-sm">{projectVideo.subtitle}</p>
      </div>
      <button type="button" onClick={toggle} aria-label={playing ? "Pause project film" : "Play project film"} className="absolute bottom-6 right-6 flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/60 bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
        {playing ? <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4 3h3v10H4zm5 0h3v10H9z" /></svg> : <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="m5 2 9 6-9 6z" /></svg>}
      </button>
    </div>
  </section>;
}
