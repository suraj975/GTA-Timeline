"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { eraChapters } from "@/content/games";
import { EraRail } from "@/components/navigation/era-rail";
import { TopDownEra } from "@/components/chapters/top-down-era";
import { DimensionShift } from "@/components/chapters/dimension-shift";
import { EraPanels } from "@/components/chapters/era-panels";

export function HistoryExperience() {
  const [activeEra, setActiveEra] = useState("intro");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const triggers = gsap.utils.toArray<HTMLElement>("[data-era]").map((element) =>
      ScrollTrigger.create({
        trigger: element,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveEra(element.dataset.era ?? "intro"),
        onEnterBack: () => setActiveEra(element.dataset.era ?? "intro"),
      }),
    );
    return () => triggers.forEach((trigger) => trigger.kill());
  }, []);

  return (
    <div className="experience">
      <a className="skip-link" href="#gta-1997">Skip introduction</a>
      <div className="noise" aria-hidden="true" />
      <EraRail chapters={eraChapters} activeId={activeEra} />
      <main>
        <section className="chapter intro-chapter" id="intro" data-era="intro">
          <div className="hero-panorama" aria-hidden="true" />
          <div className="hero-topline"><span>GTH / 1997—2026</span><span>Independent digital archive</span></div>
          <div className="intro-copy">
            <div className="eyebrow">The evolution of an open-world icon</div>
            <h1 className="intro-title"><span>Grand Theft</span> History</h1>
            <p className="intro-subtitle">
              Eighteen releases. Four eras. One road from a pixel city in 1997 to the sun-bleached state of Leonida.
            </p>
            <div className="scroll-cue" aria-hidden="true">Scroll to drive</div>
          </div>
          <div className="hero-stats" aria-label="Timeline summary">
            <div><strong>18</strong><span>Releases</span></div>
            <div><strong>29</strong><span>Years</span></div>
            <div><strong>04</strong><span>Eras</span></div>
          </div>
        </section>
        <TopDownEra />
        <DimensionShift />
        <EraPanels />
      </main>
      <footer className="prototype-note">
        <strong>Independent digital archive.</strong> Not affiliated with or endorsed by Rockstar Games or
        Take-Two Interactive. Visual artwork is original and informational release details are presented for historical commentary.
      </footer>
    </div>
  );
}
