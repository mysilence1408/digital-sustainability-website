"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { LuMoon, LuSun, LuX } from "react-icons/lu";

const subscribe = (notify: () => void) => {
  window.addEventListener("theme-change", notify);
  return () => window.removeEventListener("theme-change", notify);
};
const snapshot = () => document.documentElement.dataset.theme !== "light";

export default function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, snapshot, () => true);
  const [notice, setNotice] = useState<string | null>(null);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const update = () => {
      for (const [name, content] of [["theme-color", dark ? "#17251A" : "#E2E9DC"], ["color-scheme", dark ? "dark" : "light"]]) {
        const meta = document.querySelector(`meta[name="${name}"]`);
        if (meta && meta.getAttribute("content") !== content) meta.setAttribute("content", content);
      }
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.head, { childList: true, subtree: true, attributes: true, attributeFilter: ["content"] });
    return () => observer.disconnect();
  }, [dark]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 9000);
    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(() => () => {
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    delete document.documentElement.dataset.themeChanging;
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    root.dataset.themeChanging = "true";
    root.dataset.theme = dark ? "light" : "dark";
    window.dispatchEvent(new Event("theme-change"));
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    transitionTimer.current = setTimeout(() => {
      delete root.dataset.themeChanging;
      window.dispatchEvent(new Event("theme-change"));
    }, 400);
    setNotice(dark
      ? "Light mode is on. On OLED screens, brighter colours can use more display energy than dark mode, especially at higher brightness."
      : "Thanks for choosing dark mode. On OLED screens, darker colours can reduce display energy use. The saving depends on your screen and brightness.");
  };

  return (
    <>
      <button type="button" role="switch" aria-checked={dark} aria-label="Dark mode" onClick={toggle}
        className="pointer-events-auto relative flex h-9 w-[4.25rem] shrink-0 cursor-pointer items-center justify-between rounded-full border border-[var(--line)] bg-[var(--panel)] px-2 text-[var(--copy)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]">
        <span aria-hidden="true" className={`absolute left-1 top-1 size-[1.625rem] rounded-full bg-[var(--accent)] transition-transform duration-300 motion-reduce:transition-none ${dark ? "translate-x-8" : "translate-x-0"}`} />
        <LuSun aria-hidden="true" className={`relative size-4 ${dark ? "" : "text-[var(--on-accent)]"}`} />
        <LuMoon aria-hidden="true" className={`relative size-4 ${dark ? "text-[var(--on-accent)]" : ""}`} />
      </button>
      <div role="status" aria-live="polite" aria-atomic="true" className="pointer-events-none fixed inset-x-5 bottom-5 z-[110] sm:left-auto sm:right-9 sm:w-[26rem]">
        {notice && <div className="pointer-events-auto flex gap-4 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5 text-body leading-relaxed text-[var(--ink)] shadow-xl">
          <p>{notice}</p>
          <button type="button" aria-label="Dismiss theme notification" onClick={() => setNotice(null)} className="size-8 shrink-0 cursor-pointer rounded-full p-1 focus-visible:outline-2 focus-visible:outline-[var(--accent)]"><LuX aria-hidden="true" className="size-6" /></button>
        </div>}
      </div>
    </>
  );
}
