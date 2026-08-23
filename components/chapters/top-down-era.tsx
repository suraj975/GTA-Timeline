"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gamesByEra } from "@/content/games";
import { GameStory, SideMissions } from "@/components/chapters/game-story";
import { MemoryDisplay } from "@/components/chapters/memory-display";
import { useReducedMotion } from "@/lib/capability/use-reduced-motion";

const games = gamesByEra("2d");
const firstGame = games.find((game) => game.id === "grand-theft-auto")!;
const gtaTwo = games.find((game) => game.id === "gta-2")!;
const londonGames = games.filter((game) => game.id.startsWith("gta-london"));

export function TopDownEra() {
  const section = useRef<HTMLElement>(null);
  const car = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion || !section.current || !car.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.fromTo(car.current, { top: "7%" }, {
        top: "89%", rotation: 180, ease: "none",
        scrollTrigger: { trigger: section.current, start: "top 70%", end: "bottom 75%", scrub: 0.4 },
      });
    }, section);
    return () => context.revert();
  }, [reducedMotion]);

  return (
    <section className="era-section two-d-era" id="2d" data-era="2d" ref={section}>
      <div className="map-grid" aria-hidden="true"><span className="map-route" /><div className="road-car" ref={car} /></div>
      <header className="era-heading">
        <div><span className="era-count">ERA 01 / 04</span><p className="eyebrow">Pixels · payphones · overhead chaos</p></div>
        <h2>The<br /><em>2D</em> world</h2>
        <p>Before the cinematic camera, the city was a moving map. Four releases established the freedom, satire and geography that everything else would build on.</p>
      </header>
      <MemoryDisplay era="2d" />
      <div className="story-route">
        <GameStory game={firstGame} />
        <SideMissions games={londonGames} label="London calling" />
        <GameStory game={gtaTwo} />
      </div>
    </section>
  );
}
