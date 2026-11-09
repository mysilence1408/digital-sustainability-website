"use client";

import { useLayoutEffect, useRef, useState } from "react";
import site from "@/content/site";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

const links = site.navigation;

function Menu({ pathname }: { pathname: string }) {
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const animation = useRef<gsap.core.Timeline | null>(null);
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add(
      {
        reduce: "(prefers-reduced-motion: reduce)",
        motion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        animation.current = gsap
          .timeline({ paused: true })
          .fromTo(
            panel.current,
            { autoAlpha: 0, y: -12, rotationX: -55, scaleY: 0.82 },
            {
              autoAlpha: 1,
              y: 0,
              rotationX: 0,
              scaleY: 1,
              duration: context.conditions?.reduce ? 0 : 0.5,
              ease: "power3.out",
            },
          )
          .fromTo(
            root.current!.querySelectorAll("[data-menu-link]"),
            { opacity: 0, y: -12 },
            {
              opacity: 1,
              y: 0,
              duration: context.conditions?.reduce ? 0 : 0.3,
              stagger: context.conditions?.reduce ? 0 : 0.045,
              ease: "power2.out",
            },
            context.conditions?.reduce ? 0 : 0.12,
          );
      },
      root,
    );
    return () => {
      media.revert();
      animation.current = null;
    };
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      animation.current?.timeScale(1.6).reverse();
      return;
    }
    animation.current?.timeScale(1).play();
    const html = document.documentElement;
    const body = document.body;
    const htmlOverflow = html.style.overflow;
    const bodyOverflow = body.style.overflow;
    html.dataset.navigationOpen = "true";
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    window.dispatchEvent(new Event("navigation-lock-change"));
    const outside: HTMLElement[] = [];
    // Include siblings inside the route-transition wrapper and body-level portals.
    for (
      let branch: HTMLElement | null = root.current;
      branch?.parentElement;
      branch = branch.parentElement
    ) {
      const parent = branch.parentElement;
      for (const child of Array.from(parent.children)) {
        if (
          child !== branch &&
          child instanceof HTMLElement &&
          !["SCRIPT", "STYLE", "LINK"].includes(child.tagName)
        )
          outside.push(child);
      }
      if (parent === body) break;
    }
    const siblings = outside.map((element) => ({
      element,
      inert: element.inert,
    }));
    siblings.forEach(({ element }) => {
      element.inert = true;
    });
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
      if (event.key !== "Tab") return;
      const items = Array.from(
        root.current!.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])",
        ),
      );
      const first = items[0],
        last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      document.removeEventListener("keydown", keydown);
      siblings.forEach(({ element, inert }) => {
        element.inert = inert;
      });
      delete html.dataset.navigationOpen;
      html.style.overflow = htmlOverflow;
      body.style.overflow = bodyOverflow;
      window.dispatchEvent(new Event("navigation-lock-change"));
    };
  }, [open]);

  return (
    <header
      ref={root}
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] px-5 pt-5 text-white sm:px-9 sm:pt-7 lg:px-12"
    >
      {open && (
        <div
          aria-hidden="true"
          className="pointer-events-auto fixed inset-0 bg-[#222222]/5"
          onClick={() => {
            setOpen(false);
            button.current?.focus();
          }}
        />
      )}
      <div className="flex justify-end">
        <button
          ref={button}
          type="button"
          aria-expanded={open}
          aria-controls="primary-navigation"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
          className="group pointer-events-auto flex h-12 min-w-28 cursor-pointer items-center justify-between gap-5 rounded-full bg-[#222222] px-5 text-xs font-bold uppercase shadow-[0_2px_20px_#22222208] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8374be]"
        >
          <span className="relative h-4 overflow-hidden">
            <span
              className={`block transition-transform duration-300 motion-reduce:transition-none ${open ? "-translate-y-1/2" : "translate-y-0"}`}
            >
              <span className="block h-4">{site.menuLabel}</span>
              <span className="block h-4">{site.closeLabel}</span>
            </span>
          </span>
          <span
            aria-hidden="true"
            className={`flex h-4 w-4 items-center justify-center gap-[3px] transition-transform duration-300 motion-reduce:transition-none ${open ? "rotate-90" : "group-hover:rotate-90 group-focus-visible:rotate-90"}`}
          >
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className="size-[3px] shrink-0 rounded-full bg-current"
              />
            ))}
          </span>
        </button>
      </div>
      <div
        ref={panel}
        id="primary-navigation"
        role="dialog"
        aria-label="Navigation menu"
        aria-modal={open || undefined}
        inert={!open}
        className={`absolute right-5 top-[5rem] w-[min(22rem,calc(100vw-2.5rem))] origin-top rounded-2xl bg-[#222222] p-2 shadow-[0_16px_60px_#22222212] [perspective:800px] sm:right-9 sm:top-[5.75rem] lg:right-12 ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        style={{ visibility: "hidden" }}
      >
        <nav aria-label="Main navigation">
          {links.map(({ label, href }) => {
            const active =
              href === "/"
                ? pathname === "/"
                : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                data-menu-link
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className="group/link relative flex min-h-16 items-center justify-between overflow-hidden rounded-xl px-5 py-4 text-xl font-medium tracking-tight transition-colors duration-200 hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none motion-reduce:transition-none"
              >
                <span className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="-ml-7 inline-block w-4 -translate-x-2 opacity-0 transition-all duration-300 group-hover/link:ml-0 group-hover/link:translate-x-0 group-hover/link:opacity-100 group-focus-visible/link:ml-0 group-focus-visible/link:translate-x-0 group-focus-visible/link:opacity-100 motion-reduce:transition-none"
                  >
                    &#8594;
                  </span>
                  {label}
                </span>
                {active && (
                  <span
                    aria-hidden="true"
                    className="size-1.5 shrink-0 rounded-full bg-current"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  return <Menu key={pathname} pathname={pathname} />;
}
