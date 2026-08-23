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
    <section className="chapter transform-chapter" id="evolution" data-era="evolution" ref={section}>
      <div className="sticky-stage webgl-stage">
        <EvolutionScene progress={progress} />
        <div className="transition-copy">
          <div className="transition-kicker">2001 · {progressLabel(progress)}</div>
          <h2 className="transition-title">A city gains <span>depth</span></h2>
          <div className="transition-meter" style={{ "--transition-progress": progress } as CSSProperties} aria-hidden="true">
            <span />
          </div>
        </div>
      </div>
    </section>
  );
}
