"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EvolutionScene } from "@/components/webgl/evolution-scene";
import { clampProgress, progressLabel } from "@/lib/animation/progress";
import { useReducedMotion } from "@/lib/capability/use-reduced-motion";

export function DimensionShift() {
  const section = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const reducedMotion = useReducedMotion();
  const headline = progress < .2
    ? ["The map", "wakes"]
    : progress < .5
      ? ["The city", "rises"]
      : progress < .72
        ? ["Above becomes", "behind"]
        : progress < .88
          ? ["Drive into", "the future"]
          : ["Welcome to", "Liberty"];

  useLayoutEffect(() => {
    if (reducedMotion || !section.current) {
      setProgress(1);
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({
      trigger: section.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: ({ progress: value }) => setProgress(clampProgress(value)),
    });
    return () => trigger.kill();
  }, [reducedMotion]);

  return (
    <section className="chapter transform-chapter" id="dimension-shift" ref={section}>
      <div className="sticky-stage webgl-stage">
        <EvolutionScene progress={progress} />
        <div className="transition-view" aria-hidden="true">
          <span data-active={progress < .58}>2D / OVERHEAD</span>
          <i><b style={{ transform: `scaleX(${progress})` }} /></i>
          <span data-active={progress >= .58}>3D / CHASE CAM</span>
        </div>
        <div className="transition-copy">
          <div className="transition-kicker">THE DEFINING JUMP · 2001 · {progressLabel(progress)}</div>
          <h2 className="transition-title" key={headline.join("-")}>{headline[0]} <span>{headline[1]}</span></h2>
          <div className="transition-meter" style={{ "--transition-progress": progress } as CSSProperties} aria-hidden="true">
            <span />
          </div>
        </div>
        <ol className="transition-phases" aria-label="Transformation progress">
          {["Map", "Rise", "Descend", "Tunnel", "Liberty"].map((phase, index) => (
            <li data-active={progress >= index * .2} key={phase}><span>0{index + 1}</span>{phase}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}
