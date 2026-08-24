"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";
import { games, type EraChapter } from "@/content/games";

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
  const toggle = useRef<HTMLButtonElement>(null);
  const map = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeStop, setActiveStop] = useState(0);
  const [distance, setDistance] = useState("0.0");
  const [expanded, setExpanded] = useState(false);
  const [travelling, setTravelling] = useState(false);
  const stopIds = useMemo(() => routeStops.map((stop) => stop.id), []);

  useEffect(() => {
    if (!expanded || !map.current) return;
    const links = Array.from(map.current.querySelectorAll<HTMLAnchorElement>("a[href]"));
    links[0]?.focus();
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpanded(false);
        toggle.current?.focus();
        return;
      }
      if (event.key !== "Tab" || links.length === 0) return;
      const first = links[0];
      const last = links[links.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [expanded]);

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
    window.setTimeout(() => destination.scrollIntoView({ behavior: "auto", block: "start" }), 150);
    window.setTimeout(() => setTravelling(false), 520);
  };

  const current = routeStops[activeStop];
  const next = routeStops[Math.min(activeStop + 1, routeStops.length - 1)];

  return (
    <>
      <button className="route-toggle" ref={toggle} type="button" aria-expanded={expanded} aria-controls="journey-map" onClick={() => setExpanded((value) => !value)}>
        <span className="route-toggle-car" aria-hidden="true" /><span>{current.label}</span><small>{expanded ? "Close map" : "Route map"}</small>
      </button>
      <nav className="era-rail journey-map" ref={map} data-expanded={expanded} id="journey-map" aria-label="Grand Theft History route" style={{ "--route-progress": progress } as CSSProperties}>
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

export function EraDial() {
  const dial = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [position, setPosition] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const elementTops = () => games.map((game) => {
    const element = document.getElementById(game.id);
    return element ? element.getBoundingClientRect().top + window.scrollY : 0;
  });

  const scrollToPosition = (nextPosition: number) => {
    const bounded = Math.min(games.length - 1, Math.max(0, nextPosition));
    const lower = Math.floor(bounded);
    const upper = Math.min(games.length - 1, lower + 1);
    const fraction = bounded - lower;
    const tops = elementTops();
    const top = tops[lower] + (tops[upper] - tops[lower]) * fraction;
    window.scrollTo({ top, behavior: "auto" });
  };

  const jumpTo = (index: number) => {
    const bounded = Math.min(games.length - 1, Math.max(0, index));
    document.getElementById(games[bounded].id)?.scrollIntoView({ behavior: "auto", block: "start" });
    setPosition(bounded);
    setActiveIndex(bounded);
  };

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (dragging.current) return;
      const tops = elementTops();
      const center = window.scrollY + window.innerHeight * .42;
      let lower = 0;
      for (let index = 0; index < tops.length; index += 1) if (tops[index] <= center) lower = index;
      const upper = Math.min(tops.length - 1, lower + 1);
      const span = Math.max(1, tops[upper] - tops[lower]);
      const fraction = upper === lower ? 0 : Math.min(1, Math.max(0, (center - tops[lower]) / span));
      setPosition(lower + fraction);
      setActiveIndex(lower);
    };
    const requestUpdate = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  const positionFromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = dial.current?.getBoundingClientRect();
    if (!bounds) return 0;
    return Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width)) * (games.length - 1);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    const next = positionFromPointer(event);
    setPosition(next);
    setActiveIndex(Math.round(next));
    scrollToPosition(next);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const next = positionFromPointer(event);
    setPosition(next);
    setActiveIndex(Math.round(next));
    scrollToPosition(next);
  };
  const onPointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    try { event.currentTarget.releasePointerCapture(event.pointerId); } catch { /* pointer already released */ }
    jumpTo(Math.round(position));
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    let next: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") next = activeIndex + 1;
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") next = activeIndex - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = games.length - 1;
    if (event.key === "PageUp") next = activeIndex + 3;
    if (event.key === "PageDown") next = activeIndex - 3;
    if (next === null) return;
    event.preventDefault();
    jumpTo(next);
  };

  const percent = position / (games.length - 1) * 100;
  const active = games[activeIndex];
  return (
    <div className="era-dial-shell">
      <div className="era-dial-readout"><span>{active.year}</span><strong>{active.displayTitle}</strong><small>{activeIndex + 1} / {games.length}</small></div>
      <div
        className="era-dial"
        ref={dial}
        role="slider"
        tabIndex={0}
        aria-label="Release timeline, 1997 to 2026"
        aria-valuemin={0}
        aria-valuemax={games.length - 1}
        aria-valuenow={activeIndex}
        aria-valuetext={`${active.title}, ${active.year}`}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
      >
        <span className="era-dial-rail" /><span className="era-dial-fill" style={{ width: `${percent}%` }} /><span className="era-dial-needle" style={{ left: `${percent}%` }} />
        {games.map((game, index) => (
          <button key={game.id} type="button" className="era-dial-stop" data-active={index === activeIndex} style={{ left: `${index / (games.length - 1) * 100}%`, "--dial-accent": game.accent } as CSSProperties} onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); jumpTo(index); }} aria-label={`Jump to ${game.title}, ${game.year}`}><i /><span>{game.year.slice(-2)}</span></button>
        ))}
      </div>
      <span className="era-dial-hint">Drag · arrows step · Home / End jump</span>
    </div>
  );
}
