"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

type Station = {
  name: string;
  era: string;
  wave: OscillatorType;
  root: number;
  bass: number[];
  lead: number[];
  color: string;
  bpm: number;
  filter: number;
  swing: number;
};

const stations: Station[] = [
  { name: "Head Signal", era: "1997 · 2D city", wave: "square", root: 45, bass: [0, 0, 7, 3, 0, 10, 7, 3], lead: [12, 19, 15, 22], color: "#dfff36", bpm: 116, filter: 920, swing: .08 },
  { name: "Ocean Drive", era: "2002 · Vice", wave: "sawtooth", root: 40, bass: [0, 0, 3, 7, 10, 7, 3, 12], lead: [12, 15, 19, 22, 19, 15], color: "#ff5db1", bpm: 108, filter: 1480, swing: .13 },
  { name: "West Coast 92", era: "2004 · San Andreas", wave: "triangle", root: 38, bass: [0, 0, 12, 10, 7, 3, 7, 10], lead: [12, 10, 7, 15], color: "#a6d263", bpm: 94, filter: 1120, swing: .17 },
  { name: "The Journey", era: "2001—2009 · Liberty", wave: "sine", root: 41, bass: [0, 0, 7, 5, 0, 10, 5, 7], lead: [12, 19, 17, 22], color: "#9fc7da", bpm: 102, filter: 760, swing: .05 },
  { name: "Non-Stop Future", era: "2013—2026 · HD", wave: "sawtooth", root: 43, bass: [0, 0, 3, 7, 5, 3, 10, 7], lead: [12, 12, 15, 19, 17, 15], color: "#ff896c", bpm: 122, filter: 1720, swing: .06 },
];

const stationForScroll = () => {
  const center = window.scrollY + window.innerHeight * .48;
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

const midiToFrequency = (note: number) => 440 * Math.pow(2, (note - 69) / 12);

export function EraRadio() {
  const [powered, setPowered] = useState(false);
  const [stationIndex, setStationIndex] = useState(0);
  const context = useRef<AudioContext | null>(null);
  const master = useRef<GainNode | null>(null);
  const hiss = useRef<GainNode | null>(null);
  const noiseBuffer = useRef<AudioBuffer | null>(null);
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

  const buildAudio = useCallback(() => {
    const AudioConstructor = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioConstructor) return null;
    const audio = new AudioConstructor({ latencyHint: "interactive" });
    const output = audio.createGain();
    const compressor = audio.createDynamicsCompressor();
    output.gain.value = .72;
    compressor.threshold.value = -18;
    compressor.knee.value = 18;
    compressor.ratio.value = 6;
    compressor.attack.value = .008;
    compressor.release.value = .22;
    output.connect(compressor);
    compressor.connect(audio.destination);

    const buffer = audio.createBuffer(1, audio.sampleRate, audio.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let index = 0; index < channel.length; index += 1) channel[index] = Math.random() * 2 - 1;
    noiseBuffer.current = buffer;

    const noise = audio.createBufferSource();
    const filter = audio.createBiquadFilter();
    const noiseGain = audio.createGain();
    noise.buffer = buffer;
    noise.loop = true;
    filter.type = "bandpass";
    filter.frequency.value = 2200;
    filter.Q.value = .7;
    noiseGain.gain.value = 0;
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(output);
    noise.start();

    context.current = audio;
    master.current = output;
    hiss.current = noiseGain;
    return audio;
  }, []);

  const synth = useCallback((time: number, frequency: number, duration: number, wave: OscillatorType, level: number, cutoff: number, detune = 0) => {
    const audio = context.current;
    const output = master.current;
    if (!audio || !output || audio.state !== "running") return;
    const oscillator = audio.createOscillator();
    const filter = audio.createBiquadFilter();
    const gain = audio.createGain();
    oscillator.type = wave;
    oscillator.frequency.setValueAtTime(frequency, time);
    oscillator.detune.value = detune;
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(cutoff, time);
    filter.Q.value = .8;
    gain.gain.setValueAtTime(.0001, time);
    gain.gain.exponentialRampToValueAtTime(level, time + .012);
    gain.gain.exponentialRampToValueAtTime(.0001, time + duration);
    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(output);
    oscillator.start(time);
    oscillator.stop(time + duration + .025);
  }, []);

  const hitKick = useCallback((time: number, level = .24) => {
    const audio = context.current;
    const output = master.current;
    if (!audio || !output || audio.state !== "running") return;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(132, time);
    oscillator.frequency.exponentialRampToValueAtTime(46, time + .12);
    gain.gain.setValueAtTime(level, time);
    gain.gain.exponentialRampToValueAtTime(.0001, time + .2);
    oscillator.connect(gain);
    gain.connect(output);
    oscillator.start(time);
    oscillator.stop(time + .22);
  }, []);

  const hitNoise = useCallback((time: number, duration: number, frequency: number, level: number) => {
    const audio = context.current;
    const output = master.current;
    const buffer = noiseBuffer.current;
    if (!audio || !output || !buffer || audio.state !== "running") return;
    const source = audio.createBufferSource();
    const filter = audio.createBiquadFilter();
    const gain = audio.createGain();
    source.buffer = buffer;
    filter.type = "highpass";
    filter.frequency.value = frequency;
    gain.gain.setValueAtTime(level, time);
    gain.gain.exponentialRampToValueAtTime(.0001, time + duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(output);
    source.start(time);
    source.stop(time + duration + .02);
  }, []);

  const playStep = useCallback((active: Station, index: number, ident = false) => {
    const audio = context.current;
    if (!audio || audio.state !== "running") return;
    const position = index % 16;
    const sixteenth = 60 / active.bpm / 4;
    const time = audio.currentTime + .018 + (position % 2 ? sixteenth * active.swing : 0);
    if (ident) {
      [0, 7, 12].forEach((offset, chordIndex) => synth(time, midiToFrequency(active.root + offset + 12), .48, active.wave, .028, active.filter * 1.5, chordIndex * 4 - 4));
      return;
    }
    if ([0, 4, 8, 11].includes(position)) hitKick(time, position === 0 ? .3 : .22);
    if ([4, 12].includes(position)) hitNoise(time, .14, 1150, .11);
    if (position % 2 === 0) hitNoise(time, .045, 5200, position % 4 === 0 ? .036 : .024);

    if (position % 2 === 0) {
      const bassOffset = active.bass[(position / 2) % active.bass.length];
      synth(time, midiToFrequency(active.root + bassOffset), sixteenth * 1.72, active.wave === "sine" ? "triangle" : active.wave, .07, active.filter * .58);
    }
    if ([2, 6, 10, 14].includes(position)) {
      const leadOffset = active.lead[((position - 2) / 4 + Math.floor(index / 16)) % active.lead.length];
      synth(time, midiToFrequency(active.root + leadOffset), sixteenth * 2.35, active.wave, .03, active.filter, 5);
    }
    if (position === 0 || position === 8) {
      const chordRoot = active.root + (position === 8 ? active.bass[4] : 0) + 12;
      [0, 3, 7].forEach((offset, chordIndex) => synth(time, midiToFrequency(chordRoot + offset), sixteenth * 7.4, "sine", .012, active.filter * 1.2, chordIndex * 3 - 3));
    }
  }, [hitKick, hitNoise, synth]);

  useEffect(() => {
    if (!powered || context.current?.state !== "running") return;
    step.current = 0;
    playStep(station, 0, true);
    const interval = 60_000 / station.bpm / 4;
    const timer = window.setInterval(() => {
      playStep(station, step.current);
      step.current += 1;
    }, interval);
    return () => window.clearInterval(timer);
  }, [playStep, powered, station]);

  useEffect(() => {
    if (!hiss.current || !context.current) return;
    hiss.current.gain.setTargetAtTime(powered ? .0025 : 0, context.current.currentTime, .04);
  }, [powered]);

  const togglePower = async () => {
    const audio = context.current ?? buildAudio();
    if (!audio) return;
    if (powered) {
      await audio.suspend();
      setPowered(false);
      return;
    }
    try {
      await audio.resume();
      setPowered(audio.state === "running");
    } catch {
      setPowered(false);
    }
  };

  return (
    <aside className="era-radio" data-powered={powered} style={{ "--station-color": station.color } as CSSProperties}>
      <button
        className="radio-toggle"
        type="button"
        aria-label={powered ? `Mute original soundtrack. Playing ${station.name}` : "Play original era soundtrack"}
        aria-pressed={powered}
        title={powered ? `Mute · ${station.name}` : "Play original era beats"}
        onClick={togglePower}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 9v6h4l5 4V5L8 9H4Z" />
          {powered ? <><path d="M16 9c1.4 1.6 1.4 4.4 0 6" /><path d="M19 6c3.4 3.3 3.4 8.7 0 12" /></> : <path d="m16 9 5 6m0-6-5 6" />}
        </svg>
        <span>{powered ? station.name : "Sound off"}</span>
      </button>
      <small>{powered ? station.era : "Original era beats"}</small>
    </aside>
  );
}
