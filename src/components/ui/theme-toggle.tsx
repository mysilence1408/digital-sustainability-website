"use client";

import { useEffect, useSyncExternalStore } from "react";
import { browserThemeColors } from "@/lib/theme-colors";
import { LuMoon, LuSun } from "react-icons/lu";

const storageKey = "dsc-colour-theme";
function subscribe(notify: () => void) {
  const sync = () => {
    try {
      const value = localStorage.getItem(storageKey);
      document.documentElement.dataset.theme = value === "light" || value === "dark" ? value : "system";
    } catch {                                                            }
    window.dispatchEvent(new Event("colour-theme-change"));
  };
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  window.addEventListener("storage", sync);
  window.addEventListener("colour-theme-change", notify);
  media.addEventListener("change", notify);
  return () => {
    window.removeEventListener("storage", sync);
    window.removeEventListener("colour-theme-change", notify);
    media.removeEventListener("change", notify);
  };
}
function snapshot() {
  const preference = document.documentElement.dataset.theme;
  return preference === "dark" || (preference !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
}

export default function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, snapshot, () => false);
  useEffect(() => {
    const color = dark ? browserThemeColors.dark : browserThemeColors.light;
    document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach(meta => {
      meta.content = color;
    });
  }, [dark]);
  return (
    <button
      type="button"
      role="switch"
      aria-label="Dark mode"
      aria-checked={dark}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => {
        const value = dark ? "light" : "dark";
        document.documentElement.dataset.theme = value;
        try { localStorage.setItem(storageKey, value); } catch {                                       }
        window.dispatchEvent(new Event("colour-theme-change"));
      }}
      className="pointer-events-auto relative grid h-12 w-[5.5rem] shrink-0 cursor-pointer grid-cols-2 items-center rounded-full border border-[var(--line)] bg-[var(--panel)] p-1 text-[var(--copy)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
    >
      <span aria-hidden="true" className={`absolute inset-y-1 left-1 w-[calc((100%_-_0.5rem)/2)] rounded-full bg-[var(--accent)] transition-transform duration-[420ms] ease-in-out motion-reduce:transition-none ${dark ? "translate-x-full" : "translate-x-0"}`} />
      <LuSun aria-hidden="true" className={`relative mx-auto size-[18px] ${!dark ? "text-[var(--on-accent)]" : ""}`} />
      <LuMoon aria-hidden="true" className={`relative mx-auto size-[18px] ${dark ? "text-[var(--on-accent)]" : ""}`} />
    </button>
  );
}
