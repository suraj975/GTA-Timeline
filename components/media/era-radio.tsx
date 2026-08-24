"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "@/lib/capability/use-reduced-motion";

type Station = { frequency: number; name: string; era: string; wave: OscillatorType; root: number; notes: number[]; color: string };

const stations: Station[] = [
  { frequency: 88.5, name: "Head Signal", era: "1997 · 2D city", wave: "square", root: 57, notes: [0, 7, 12, 7, 3, 10], color: "#dfff36" },
  { frequency: 92.7, name: "Ocean Drive", era: "2002 · Vice", wave: "sawtooth", root: 52, notes: [0, 3, 7, 10, 12, 10], color: "#ff5db1" },
  { frequency: 96.3, name: "West Coast 92", era: "2004 · San Andreas", wave: "triangle", root: 50, notes: [0, 12, 10, 7, 3, 7], color: "#a6d263" },
  { frequency: 101.1, name: "The Journey", era: "2008 · Liberty", wave: "sine", root: 53, notes: [0, 7, 12, 5, 10], color: "#9fc7da" },
  { frequency: 106.5, name: "Non-Stop Future", era: "2013—2026 · HD", wave: "sawtooth", root: 55, notes: [12, 12, 15, 19, 17, 15], color: "#ff896c" },
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function EraRadio() {
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [powered, setPowered] = useState(false);
  const [frequency, setFrequency] = useState(88.5);
  const [volume, setVolume] = useState(.48);
  const context = useRef<AudioContext | null>(null);
  const master = useRef<GainNode | null>(null);
  const hiss = useRef<GainNode | null>(null);
  const lastIdent = useRef("");

  const nearest = useMemo(() => stations.reduce((best, station) => Math.abs(station.frequency - frequency) < Math.abs(best.frequency - frequency) ? station : best), [frequency]);
  const strength = clamp(1 - Math.abs(nearest.frequency - frequency) / 1.45, 0, 1);

  useEffect(() => {
    const storedFrequency = Number(window.localStorage.getItem("gth-radio-frequency"));
    const storedVolume = Number(window.localStorage.getItem("gth-radio-volume"));
    const restore = window.setTimeout(() => {
      if (Number.isFinite(storedFrequency) && storedFrequency >= 87.5 && storedFrequency <= 108) setFrequency(storedFrequency);
      if (Number.isFinite(storedVolume) && storedVolume >= 0 && storedVolume <= 1) setVolume(storedVolume);
    }, 0);
    return () => {
      window.clearTimeout(restore);
      void context.current?.close();
    };
  }, []);

  useEffect(() => {
    if (!reducedMotion || !powered) return;
    void context.current?.suspend();
    const reset = window.setTimeout(() => setPowered(false), 0);
    return () => window.clearTimeout(reset);
  }, [powered, reducedMotion]);

  useEffect(() => {
    if (master.current) master.current.gain.setTargetAtTime(volume * .45, context.current?.currentTime ?? 0, .03);
    window.localStorage.setItem("gth-radio-volume", String(volume));
  }, [volume]);

  useEffect(() => {
    window.localStorage.setItem("gth-radio-frequency", String(frequency));
    if (hiss.current && context.current) hiss.current.gain.setTargetAtTime(powered ? (1 - strength) * .055 + .003 : 0, context.current.currentTime, .04);
  }, [frequency, powered, strength]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden && powered) {
        void context.current?.suspend();
        setPowered(false);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [powered]);

  const buildAudio = () => {
    const audio = new AudioContext();
    const output = audio.createGain();
    output.gain.value = volume * .45;
    output.connect(audio.destination);
    const length = audio.sampleRate * 2;
    const buffer = audio.createBuffer(1, length, audio.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let index = 0; index < length; index += 1) channel[index] = (Math.random() * 2 - 1) * .55;
    const source = audio.createBufferSource();
    const filter = audio.createBiquadFilter();
    const noiseGain = audio.createGain();
    source.buffer = buffer;
    source.loop = true;
    filter.type = "bandpass";
    filter.frequency.value = 2500;
    filter.Q.value = .8;
    noiseGain.gain.value = .01;
    source.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(output);
    source.start();
    context.current = audio;
    master.current = output;
    hiss.current = noiseGain;
    return audio;
  };

  const playIdent = (station: Station) => {
    const audio = context.current;
    const output = master.current;
    if (!audio || !output || audio.state !== "running" || strength < .5) return;
    const identKey = `${station.name}-${Math.round(performance.now() / 800)}`;
    if (lastIdent.current === identKey) return;
    lastIdent.current = identKey;
    station.notes.forEach((offset, index) => {
      const oscillator = audio.createOscillator();
      const filter = audio.createBiquadFilter();
      const gain = audio.createGain();
      const start = audio.currentTime + index * .115;
      oscillator.type = station.wave;
      oscillator.frequency.value = 440 * Math.pow(2, (station.root + offset - 69) / 12);
      filter.type = "lowpass";
      filter.frequency.value = 900 + strength * 1700;
      gain.gain.setValueAtTime(.0001, start);
      gain.gain.exponentialRampToValueAtTime(.07 * strength, start + .025);
      gain.gain.exponentialRampToValueAtTime(.0001, start + .105);
      oscillator.connect(filter);
      filter.connect(gain);
      gain.connect(output);
      oscillator.start(start);
      oscillator.stop(start + .12);
    });
  };

  const togglePower = async () => {
    if (reducedMotion) return;
    const audio = context.current ?? buildAudio();
    if (powered) {
      await audio.suspend();
      setPowered(false);
      return;
    }
    await audio.resume();
    setPowered(true);
    window.setTimeout(() => playIdent(nearest), 80);
  };

  const tune = (value: number, play = false) => {
    const next = clamp(value, 87.5, 108);
    setFrequency(next);
    if (play) {
      const station = stations.reduce((best, candidate) => Math.abs(candidate.frequency - next) < Math.abs(best.frequency - next) ? candidate : best);
      if (Math.abs(station.frequency - next) < .55) {
        setFrequency(station.frequency);
        window.setTimeout(() => playIdent(station), 30);
      }
    }
  };

  return (
    <aside className="era-radio" data-open={open} style={{ "--station-color": nearest.color } as CSSProperties}>
      <button className="radio-toggle" type="button" aria-expanded={open} aria-controls="era-radio-panel" onClick={() => setOpen((value) => !value)}><span aria-hidden="true">◉</span>Radio</button>
      <div className="radio-panel" id="era-radio-panel">
        <header><span>Original synthesized signal</span><button type="button" onClick={() => setOpen(false)} aria-label="Close radio">×</button></header>
        <div className="radio-frequency">{frequency.toFixed(1)}<small>FM</small></div>
        <strong>{strength > .35 ? nearest.name : "— static —"}</strong>
        <p aria-live="polite">{reducedMotion ? "Muted in calm mode" : strength > .35 ? nearest.era : "Tune to a marked frequency"}</p>
        <div className="radio-band-wrap">
          <input aria-label="Radio frequency" type="range" min="87.5" max="108" step="0.1" value={frequency} onChange={(event) => tune(Number(event.target.value))} onPointerUp={() => tune(frequency, true)} onKeyUp={() => tune(frequency, true)} />
          <div className="radio-stations" aria-hidden="true">{stations.map((station) => <i key={station.frequency} style={{ left: `${(station.frequency - 87.5) / 20.5 * 100}%` }} />)}</div>
        </div>
        <div className="radio-controls">
          <button type="button" className="radio-power" aria-pressed={powered} disabled={reducedMotion} onClick={togglePower}><i />{powered ? "Power off" : "Power on"}</button>
          <label>Volume<input type="range" min="0" max="1" step="0.01" value={volume} onChange={(event) => setVolume(Number(event.target.value))} /></label>
        </div>
        <small>No licensed music · no audio files · never autoplays</small>
      </div>
    </aside>
  );
}
