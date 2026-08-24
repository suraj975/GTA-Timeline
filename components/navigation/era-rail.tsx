"use client";

import { useEffect, useMemo, useState, type CSSProperties, type MouseEvent } from "react";
import type { EraChapter } from "@/content/games";

type EraRailProps = { chapters: EraChapter[]; activeId: string };

const routeStops = [
  { id: "intro", label: "Start", year: "1997", accent: "#eaff3d" },
  { id: "grand-theft-auto", label: "GTA", year: "1997", accent: "#eaff3d" },
  { id: "gta-2", label: "GTA 2", year: "1999", accent: "#6de0b0" },
  { id: "gta-3", label: "III", year: "2001", accent: "#79c8ec" },
  { id: "vice-city", label: "Vice", year: "2002", accent: "#ff5db1" },
  { id: "san-andreas", label: "SA", year: "2004", accent: "#85c65c" },
  { id: "gta-4", label: "IV", year: "2008", accent: "#a8c1cf" },
  { id: "gta-5", label: "V", year: "2013", accent: "#91c959" },
  { id: "gta-online", label: "Online", year: "2013—", accent: "#5bd7ff" },
  { id: "future", label: "VI", year: "2026", accent: "#ff896c" },
] as const;

export function EraRail({ chapters }: EraRailProps) {
  const [progress, setProgress] = useState(0);
  const [activeStop, setActiveStop] = useState(0);
  const [distance, setDistance] = useState("0.0");
  const [expanded, setExpanded] = useState(false);
  const [travelling, setTravelling] = useState(false);
  const stopIds = useMemo(() => routeStops.map((stop) => stop.id), []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const value = Math.min(1, Math.max(0, window.scrollY / max));
      const center = window.scrollY + window.innerHeight * .48;
      const elements = stopIds.map((id) => document.getElementById(id));
      let current = 0;
      elements.forEach((element, index) => {
        const documentTop = element ? element.getBoundingClientRect().top + window.scrollY : Number.POSITIVE_INFINITY;
        if (documentTop <= center) current = index;
      });
      const next = elements[Math.min(current + 1, elements.length - 1)];
      const nextTop = next ? next.getBoundingClientRect().top + window.scrollY : center;
      const remaining = Math.max(0, nextTop - center);
      setProgress(value);
      setActiveStop(current);
      setDistance((remaining / window.innerHeight * .62).toFixed(1));
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [stopIds]);

  const fastTravel = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const destination = document.getElementById(id);
    if (!destination) return;
    setTravelling(true);
    window.setTimeout(() => destination.scrollIntoView({ behavior: "smooth", block: "start" }), 180);
    window.setTimeout(() => setTravelling(false), 900);
  };

  const current = routeStops[activeStop];
  const next = routeStops[Math.min(activeStop + 1, routeStops.length - 1)];

  return (
    <>
      <button className="route-toggle" type="button" aria-expanded={expanded} aria-controls="journey-map" onClick={() => setExpanded((value) => !value)}>
        <span className="route-toggle-car" aria-hidden="true" /><span>{current.label}</span><small>{expanded ? "Close map" : "Route map"}</small>
      </button>
      <nav className="era-rail journey-map" data-expanded={expanded} id="journey-map" aria-label="Grand Theft History route" style={{ "--route-progress": progress } as CSSProperties}>
        <header className="route-status"><span>Now driving</span><strong>{current.label}</strong><time>{current.year}</time></header>
        <div className="route-canvas" aria-hidden="true">
          <svg viewBox="0 0 80 280" preserveAspectRatio="none">
            <path className="route-road" d="M40 4 C40 35 12 36 14 70 S69 101 62 132 S15 166 23 199 S66 227 40 276" />
            <path className="route-road route-road--complete" d="M40 4 C40 35 12 36 14 70 S69 101 62 132 S15 166 23 199 S66 227 40 276" pathLength="100" />
            <path className="route-branch route-branch--one" d="M15 70 C4 75 4 91 13 98" />
            <path className="route-branch route-branch--two" d="M62 132 C77 140 76 154 66 160" />
            <path className="route-branch route-branch--three" d="M23 199 C5 205 4 220 14 226" />
          </svg>
          <span className="route-car-marker" />
          {routeStops.map((stop, index) => <span className="route-stop-dot" data-active={index === activeStop} key={stop.id} style={{ top: `${4 + index * (272 / (routeStops.length - 1))}px`, "--stop-accent": stop.accent } as CSSProperties} />)}
        </div>
        <div className="route-links">
          {routeStops.map((stop, index) => (
            <a href={`#${stop.id}`} key={stop.id} data-active={index === activeStop} onClick={(event) => fastTravel(event, stop.id)} style={{ "--era-accent": stop.accent } as CSSProperties} aria-current={index === activeStop ? "location" : undefined}>
              <span>{stop.label}</span><small>{stop.year}</small>
            </a>
          ))}
        </div>
        <footer className="route-next"><span>Next · {next.label}</span><strong>{distance} MI</strong></footer>
        <div className="route-era-legend" aria-label="Timeline eras">{chapters.slice(1).map((chapter) => <i key={chapter.id} title={chapter.navLabel} style={{ background: chapter.accent }} />)}</div>
      </nav>
      <div className="journey-warp" data-active={travelling} aria-hidden="true"><span>FAST TRAVEL</span></div>
    </>
  );
}
