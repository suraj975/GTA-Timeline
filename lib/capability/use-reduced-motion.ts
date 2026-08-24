"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "gth-reduce-motion";
const EVENT_NAME = "gth-motion-preference";

function readPreference(query: MediaQueryList) {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "true" || (stored !== "false" && query.matches);
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(readPreference(query));
    update();
    query.addEventListener("change", update);
    window.addEventListener(EVENT_NAME, update);
    return () => {
      query.removeEventListener("change", update);
      window.removeEventListener(EVENT_NAME, update);
    };
  }, []);

  return reduced;
}

export function setReducedMotionPreference(reduced: boolean) {
  window.localStorage.setItem(STORAGE_KEY, String(reduced));
  window.dispatchEvent(new Event(EVENT_NAME));
}
