"use client";

import { Children, cloneElement, isValidElement, useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function notifySectionBackgroundReady(section: HTMLElement) {
  section.dispatchEvent(new Event("section-background-ready"));
}

// Keep words together and preserve the heading's line breaks and color spans.
function splitLetters(children: ReactNode): ReactNode {
  return Children.map(children, (child) => {
    if (typeof child === "string") {
      return child.split(/(\s+)/).map((word, wordIndex) =>
        /^\s+$/.test(word) ? word : (
          <span key={wordIndex} className="inline-block whitespace-nowrap">
            {Array.from(word).map((letter, index) => (
              <span key={index} data-title-letter className="inline-block origin-[50%_75%]">{letter}</span>
            ))}
          </span>
        ),
      );
    }
    if (isValidElement<{ children?: ReactNode }>(child) && child.props.children) {
      return cloneElement(child, { children: splitLetters(child.props.children) });
    }
    return child;
  });
}

export default function SectionTitle({ children, id, className }: {
  children: ReactNode;
  id?: string;
  className?: string;
}) {
  const root = useRef<HTMLHeadingElement>(null);
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const section = root.current?.closest("section");
      const letters = root.current?.querySelectorAll("[data-title-letter]");
      if (!section || !letters?.length) return;
      const originalColors = Array.from(letters, (letter) => getComputedStyle(letter).color);
      const animation = gsap.to(letters, {
        paused: true,
        keyframes: [
          { color: "#71d75b", scale: 1.035, textShadow: "0 0 8px rgba(113,215,91,0.45)", duration: 0.09, ease: "power2.out" },
          { color: "#d3b947", scale: 1, textShadow: "0 0 5px rgba(211,185,71,0.2)", duration: 0.13, ease: "none" },
          { color: (index: number) => originalColors[index], textShadow: "0 0 0px rgba(211,185,71,0)", duration: 0.28, ease: "power2.out" },
        ],
        stagger: 0.022,
      });
      // Observe direction throughout the page, including while a color tween
      // finishes. Reversing the scroll immediately clears a running trail.
      const direction = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          if (self.direction < 0) animation.pause(0);
        },
      });
      const play = () => {
        if (direction.direction < 0) return;
        animation.restart();
      };
      section.addEventListener("section-background-ready", play);
      return () => section.removeEventListener("section-background-ready", play);
    }, root);
    return () => media.revert();
  }, []);

  return (
    <h2 ref={root} id={id} className={className}>
      <span className="sr-only">{children}</span>
      <span aria-hidden="true">{splitLetters(children)}</span>
    </h2>
  );
}
