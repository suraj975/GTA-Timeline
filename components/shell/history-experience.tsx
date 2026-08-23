"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prototypeChapters } from "@/content/games";
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
      <EraRail chapters={prototypeChapters} activeId={activeEra} />
      <main>
        <section className="chapter intro-chapter" id="intro" data-era="intro">
          <div className="intro-copy">
            <div className="eyebrow">An independent interactive history prototype</div>
            <div className="intro-year">1997</div>
            <h1 className="intro-title">From above <span>to Leonida</span></h1>
            <p className="intro-subtitle">
              Travel through the moment open-world crime games changed dimension. This first vertical
              slice proves the road, camera and visual-language transitions before the full timeline is built.
            </p>
            <div className="scroll-cue" aria-hidden="true">Scroll to drive</div>
          </div>
        </section>
        <TopDownEra />
        <DimensionShift />
        <EraPanels />
      </main>
      <footer className="prototype-note">
        <strong>Prototype build.</strong> This independent historical experience is not affiliated with or
        endorsed by Rockstar Games or Take-Two Interactive. All current visuals are original procedural
        placeholders; production media requires source, ownership and usage review.
      </footer>
    </div>
  );
}
