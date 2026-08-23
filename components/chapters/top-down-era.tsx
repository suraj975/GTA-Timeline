"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/capability/use-reduced-motion";

export function TopDownEra() {
  const section = useRef<HTMLElement>(null);
  const car = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion || !section.current || !car.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.to(car.current, {
        top: "82%",
        rotation: 180,
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.35,
        },
      });
    }, section);
    return () => context.revert();
  }, [reducedMotion]);

  return (
    <section className="chapter topdown-chapter" id="gta-1997" data-era="gta-1997" ref={section}>
      <div className="sticky-stage map-stage">
        <div className="map-building building-one" data-label="Grand Theft Auto · 1997" />
        <div className="map-building building-two" data-label="Liberty City" />
        <div className="map-building building-three" data-label="London · 1969" />
        <div className="map-building building-four" data-label="Anywhere City · 1999" />
        <div className="road-car" ref={car} aria-hidden="true" />
        <div className="map-hud">
          <div className="map-year">MISSION 01 · THE 2D WORLD</div>
          <h2>Crime from above</h2>
          <p>
            Scroll drives the prototype vehicle through a compressed map of the first generation.
            Streets, buildings and signs carry the history instead of conventional cards.
          </p>
        </div>
      </div>
    </section>
  );
}
