"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type Station = {
  name: string;
  era: string;
  wave: OscillatorType;
  root: number;
  notes: number[];
  color: string;
  tempo: number;
};

const stations: Station[] = [
  { name: "Head Signal", era: "1997 · 2D city", wave: "square", root: 45, notes: [0, 7, 12, 7, 3, 10], color: "#dfff36", tempo: 360 },
  { name: "Ocean Drive", era: "2002 · Vice", wave: "sawtooth", root: 40, notes: [0, 3, 7, 10, 12, 10], color: "#ff5db1", tempo: 410 },
  { name: "West Coast 92", era: "2004 · San Andreas", wave: "triangle", root: 38, notes: [0, 12, 10, 7, 3, 7], color: "#a6d263", tempo: 430 },
  { name: "The Journey", era: "2008 · Liberty", wave: "sine", root: 41, notes: [0, 7, 12, 5, 10], color: "#9fc7da", tempo: 520 },
  { name: "Non-Stop Future", era: "2013—2026 · HD", wave: "sawtooth", root: 43, notes: [12, 12, 15, 19, 17, 15], color: "#ff896c", tempo: 390 },
];

const stationForScroll = () => {
  const center = window.scrollY + window.innerHeight * .48;
  const passed = (id: string) => {
    const element = document.getElementById(id);
    return element ? element.getBoundingClientRect().top + window.scrollY <= center : false;
  };
  if (passed("future")) return 4;
  if (passed("hd")) return 3;
  if (passed("san-andreas")) return 2;
  if (passed("vice-city")) return 1;
  if (passed("gta-3")) return 3;
  return 0;
};

export function EraRadio() {
  const [powered, setPowered] = useState(false);
  const [stationIndex, setStationIndex] = useState(0);
  const context = useRef<AudioContext | null>(null);
  const master = useRef<GainNode | null>(null);
  const hiss = useRef<GainNode | null>(null);
  const step = useRef(0);
  const station = stations[stationIndex];

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setStationIndex(stationForScroll());
    };
    const requestUpdate = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    const timer = window.setInterval(update, 450);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.clearInterval(timer);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      void context.current?.close();
    };
  }, []);

  useEffect(() => {
    const onVisibility = () => {
      if (!document.hidden || !powered) return;
      void context.current?.suspend();
      setPowered(false);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [powered]);

  const buildAudio = () => {
    const AudioConstructor = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioConstructor) return null;
    const audio = new AudioConstructor();
    const output = audio.createGain();
    output.gain.value = .34;
    output.connect(audio.destination);

    const buffer = audio.createBuffer(1, audio.sampleRate * 2, audio.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let index = 0; index < channel.length; index += 1) channel[index] = Math.random() * 2 - 1;
    const noise = audio.createBufferSource();
    const filter = audio.createBiquadFilter();
    const noiseGain = audio.createGain();
    noise.buffer = buffer;
    noise.loop = true;
    filter.type = "bandpass";
    filter.frequency.value = 1800;
    filter.Q.value = .6;
    noiseGain.gain.value = .006;
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(output);
    noise.start();

    context.current = audio;
    master.current = output;
    hiss.current = noiseGain;
    return audio;
  };

  const playTone = (active: Station, noteIndex: number, ident = false) => {
    const audio = context.current;
    const output = master.current;
    if (!audio || !output || audio.state !== "running") return;
    const offset = active.notes[noteIndex % active.notes.length];
    const start = audio.currentTime + .015;
    const duration = ident ? .22 : Math.min(.7, active.tempo / 1000 * 1.45);
    const oscillator = audio.createOscillator();
    const filter = audio.createBiquadFilter();
    const gain = audio.createGain();
    oscillator.type = active.wave;
    oscillator.frequency.value = 440 * Math.pow(2, (active.root + offset - 69) / 12);
    filter.type = "lowpass";
    filter.frequency.value = ident ? 1900 : 780;
    filter.Q.value = .7;
    gain.gain.setValueAtTime(.0001, start);
    gain.gain.exponentialRampToValueAtTime(ident ? .045 : .026, start + .035);
    gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(output);
    oscillator.start(start);
    oscillator.stop(start + duration + .03);
  };

  useEffect(() => {
    if (!powered || context.current?.state !== "running") return;
    step.current = 0;
    playTone(station, 0, true);
    const timer = window.setInterval(() => {
      playTone(station, step.current);
      step.current += 1;
    }, station.tempo);
    return () => window.clearInterval(timer);
  }, [powered, station]);

  useEffect(() => {
    if (!hiss.current || !context.current) return;
    hiss.current.gain.setTargetAtTime(powered ? .006 : 0, context.current.currentTime, .04);
  }, [powered]);

  const togglePower = async () => {
    const audio = context.current ?? buildAudio();
    if (!audio) return;
    if (powered) {
      await audio.suspend();
      setPowered(false);
      return;
    }
    await audio.resume();
    setPowered(true);
  };

  return (
    <aside className="era-radio" data-powered={powered} style={{ "--station-color": station.color } as CSSProperties}>
      <button
        className="radio-toggle"
        type="button"
        aria-label={powered ? `Mute soundtrack. Playing ${station.name}` : "Play original era soundtrack"}
        aria-pressed={powered}
        title={powered ? `Mute · ${station.name}` : "Play soundtrack"}
        onClick={togglePower}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 9v6h4l5 4V5L8 9H4Z" />
          {powered ? <><path d="M16 9c1.4 1.6 1.4 4.4 0 6" /><path d="M19 6c3.4 3.3 3.4 8.7 0 12" /></> : <path d="m16 9 5 6m0-6-5 6" />}
        </svg>
        <span>{powered ? station.name : "Sound off"}</span>
      </button>
      <small>{powered ? station.era : "Original soundtrack"}</small>
    </aside>
  );
}
