"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

type Station = {
  name: string;
  era: string;
  color: string;
  src: string;
  track: string;
  artist: string;
  source: string;
};

const stations: Station[] = [
  {
    name: "Head Signal",
    era: "1997 · 2D city",
    color: "#dfff36",
    src: "/audio/head-signal.ogg",
    track: "Invincibility Loop",
    artist: "Zane Little Music",
    source: "https://opengameart.org/content/invincibility-loop",
  },
  {
    name: "Ocean Drive",
    era: "2002 · Vice",
    color: "#ff5db1",
    src: "/audio/ocean-drive.ogg",
    track: "Space City",
    artist: "MintoDog",
    source: "https://opengameart.org/content/space-city",
  },
  {
    name: "West Coast 92",
    era: "2004 · San Andreas",
    color: "#a6d263",
    src: "/audio/west-coast-92.ogg",
    track: "Lofi Hip Hop",
    artist: "omfgdude",
    source: "https://opengameart.org/content/lofi-hip-hop",
  },
  {
    name: "Liberty After Dark",
    era: "2001—2009 · Liberty",
    color: "#9fc7da",
    src: "/audio/liberty-after-dark.ogg",
    track: "Searching",
    artist: "yd",
    source: "https://opengameart.org/content/searching",
  },
  {
    name: "Non-Stop Future",
    era: "2013—2026 · HD",
    color: "#ff896c",
    src: "/audio/non-stop-future.ogg",
    track: "Empacotatron",
    artist: "Fupi",
    source: "https://opengameart.org/content/empacotatron",
  },
];

const stationForScroll = () => {
  const center = window.scrollY + window.innerHeight * 0.48;
  const passed = (id: string) => {
    const element = document.getElementById(id);
    return element ? element.getBoundingClientRect().top + window.scrollY <= center : false;
  };
  if (passed("future") || passed("gta-5")) return 4;
  if (passed("hd")) return 3;
  if (passed("san-andreas")) return 2;
  if (passed("vice-city")) return 1;
  if (passed("gta-3")) return 3;
  return 0;
};

const MAX_VOLUME = 0.42;

export function EraRadio() {
  const [powered, setPowered] = useState(false);
  const [stationIndex, setStationIndex] = useState(0);
  const [playbackError, setPlaybackError] = useState(false);
  const firstPlayer = useRef<HTMLAudioElement | null>(null);
  const secondPlayer = useRef<HTMLAudioElement | null>(null);
  const activePlayer = useRef(0);
  const poweredRef = useRef(false);
  const fadeFrame = useRef(0);
  const switchToken = useRef(0);
  const station = stations[stationIndex];

  const players = useCallback(
    () => [firstPlayer.current, secondPlayer.current] as const,
    [],
  );

  const stopFade = useCallback(() => {
    if (fadeFrame.current) window.cancelAnimationFrame(fadeFrame.current);
    fadeFrame.current = 0;
  }, []);

  const fade = useCallback((incoming: HTMLAudioElement | null, outgoing: HTMLAudioElement | null, duration: number, onDone?: () => void) => {
    stopFade();
    const started = performance.now();
    const incomingStart = incoming?.volume ?? 0;
    const outgoingStart = outgoing?.volume ?? 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      if (incoming) incoming.volume = incomingStart + (MAX_VOLUME - incomingStart) * eased;
      if (outgoing) outgoing.volume = Math.max(0, outgoingStart * (1 - eased));
      if (progress < 1) {
        fadeFrame.current = window.requestAnimationFrame(tick);
      } else {
        fadeFrame.current = 0;
        onDone?.();
      }
    };
    fadeFrame.current = window.requestAnimationFrame(tick);
  }, [stopFade]);

  const prepare = useCallback((audio: HTMLAudioElement, index: number) => {
    if (audio.dataset.station === String(index)) return;
    audio.pause();
    audio.src = stations[index].src;
    audio.dataset.station = String(index);
    audio.currentTime = 0;
    audio.volume = 0;
    audio.load();
  }, []);

  const startStation = useCallback(async (index: number, crossfade: boolean) => {
    const available = players();
    const current = available[activePlayer.current];
    const nextIndex = crossfade ? 1 - activePlayer.current : activePlayer.current;
    const next = available[nextIndex];
    if (!next) return false;
    const token = ++switchToken.current;
    prepare(next, index);
    try {
      await next.play();
      if (token !== switchToken.current || !poweredRef.current) {
        next.pause();
        return false;
      }
      setPlaybackError(false);
      activePlayer.current = nextIndex;
      fade(next, crossfade ? current : null, crossfade ? 900 : 420, () => {
        if (crossfade && current && current !== next) {
          current.pause();
          current.removeAttribute("src");
          delete current.dataset.station;
          current.load();
        }
      });
      return true;
    } catch {
      setPlaybackError(true);
      return false;
    }
  }, [fade, players, prepare]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setStationIndex(stationForScroll());
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
  }, []);

  useEffect(() => {
    if (!poweredRef.current) return;
    void startStation(stationIndex, true);
  }, [startStation, stationIndex]);

  useEffect(() => {
    const onVisibility = () => {
      if (!document.hidden || !poweredRef.current) return;
      poweredRef.current = false;
      setPowered(false);
      switchToken.current += 1;
      stopFade();
      players().forEach((audio) => {
        if (!audio) return;
        audio.pause();
        audio.volume = 0;
      });
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [players, stopFade]);

  useEffect(() => () => {
    switchToken.current += 1;
    stopFade();
    players().forEach((audio) => audio?.pause());
  }, [players, stopFade]);

  const togglePower = async () => {
    if (poweredRef.current) {
      poweredRef.current = false;
      setPowered(false);
      switchToken.current += 1;
      const current = players()[activePlayer.current];
      fade(null, current, 260, () => current?.pause());
      return;
    }

    poweredRef.current = true;
    setPlaybackError(false);
    const started = await startStation(stationIndex, false);
    if (!started) {
      poweredRef.current = false;
      setPowered(false);
      return;
    }
    setPowered(true);
  };

  return (
    <aside
      className="era-radio"
      data-powered={powered}
      data-error={playbackError}
      style={{ "--station-color": station.color } as CSSProperties}
    >
      <audio ref={firstPlayer} loop preload="none" playsInline />
      <audio ref={secondPlayer} loop preload="none" playsInline />
      <button
        className="radio-toggle"
        type="button"
        aria-label={powered ? `Mute archive radio. Playing ${station.name}` : "Play archive radio"}
        aria-pressed={powered}
        title={powered ? `Mute · ${station.name}` : "Play era radio"}
        onClick={togglePower}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 9v6h4l5 4V5L8 9H4Z" />
          {powered ? <><path d="M16 9c1.4 1.6 1.4 4.4 0 6" /><path d="M19 6c3.4 3.3 3.4 8.7 0 12" /></> : <path d="m16 9 5 6m0-6-5 6" />}
        </svg>
        <span>{powered ? station.name : "Sound off"}</span>
      </button>
      <small>
        {playbackError ? "Tap to retry" : powered ? `${station.name} · ${station.era}` : "CC0 era radio"}
      </small>
      <a className="radio-credit" href={station.source} target="_blank" rel="noreferrer" tabIndex={powered ? 0 : -1}>
        {station.track} · {station.artist} · CC0
      </a>
    </aside>
  );
}
