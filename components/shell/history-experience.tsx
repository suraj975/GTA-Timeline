"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { eraChapters } from "@/content/games";
import { EraRail } from "@/components/navigation/era-rail";
import { TopDownEra } from "@/components/chapters/top-down-era";
import { DimensionShift } from "@/components/chapters/dimension-shift";
import { EraPanels } from "@/components/chapters/era-panels";

export function HistoryExperience() {
  const [activeEra, setActiveEra] = useState("intro");
  const progressBar = useRef<HTMLSpanElement>(null);

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
    const reveals = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? []
      : gsap.utils.toArray<HTMLElement>("[data-reveal]").map((element) =>
          gsap.from(element, {
            y: 90,
            opacity: 0,
            scale: .97,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 88%", once: true },
          }),
        );
    const progress = ScrollTrigger.create({
      start: 0,
      end: () => ScrollTrigger.maxScroll(window),
      onUpdate: ({ progress: value }) => gsap.set(progressBar.current, { scaleX: value }),
    });
    return () => {
      triggers.forEach((trigger) => trigger.kill());
      reveals.forEach((animation) => animation.kill());
      progress.kill();
    };
  }, []);

  return (
    <div className="experience" data-active-era={activeEra}>
      <a className="skip-link" href="#2d">Skip introduction</a>
      <div className="noise" aria-hidden="true" />
      <div className="era-ambient" aria-hidden="true" />
      <div className="global-progress" aria-hidden="true"><span ref={progressBar} /></div>
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
