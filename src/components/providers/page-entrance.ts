"use client";

import { useSyncExternalStore } from "react";

let ready = true;
const listeners = new Set<() => void>();
export function setPageEntranceReady(value: boolean) {
  ready = value;
  document.documentElement.dataset.pageTransition = value ? "ready" : "active";
  listeners.forEach(notify => notify());
  window.dispatchEvent(new Event("page-entrance-change"));
  window.dispatchEvent(new Event("navigation-lock-change"));
}
export const isPageEntranceReady = () => ready;
const subscribe = (notify: () => void) => {
  listeners.add(notify);
  return () => { listeners.delete(notify); };
};
export function usePageEntranceReady() {
  return useSyncExternalStore(subscribe, isPageEntranceReady, () => true);
}
