"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { eraChapters } from "@/content/games";
import { EraDial, EraRail } from "@/components/navigation/era-rail";
import { TopDownEra } from "@/components/chapters/top-down-era";
import { DimensionShift } from "@/components/chapters/dimension-shift";
import { EraPanels } from "@/components/chapters/era-panels";
import { setReducedMotionPreference, useReducedMotion } from "@/lib/capability/use-reduced-motion";
import { EraRadio } from "@/components/media/era-radio";

function updateShareableLocation(slug?: string) {
  if (!slug) return;
  const url = new URL(window.location.href);
  if (url.searchParams.get("at") === slug) return;
  url.searchParams.set("at", slug);
  window.history.replaceState(null, "", `${url.pathname}${url.search}`);
}

export function HistoryExperience({ initialTarget }: { initialTarget?: string }) {
  const [activeEra, setActiveEra] = useState("intro");
  const progressBar = useRef<HTMLSpanElement>(null);
  const locationTarget = useRef<string | null | undefined>(initialTarget);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (locationTarget.current === undefined) {
      const url = new URL(window.location.href);
      locationTarget.current = url.hash.slice(1) || url.searchParams.get("at");
    }
    const target = locationTarget.current;
    if (!target) return;
    let secondFrame = 0;
    let settleTimer = 0;
    const alignTarget = () => {
      ScrollTrigger.refresh();
      document.getElementById(target)?.scrollIntoView({ behavior: "auto", block: "start" });
    };
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        alignTarget();
        settleTimer = window.setTimeout(alignTarget, 420);
      });
    });
    return () => {
      window.cancelAnimationFrame(firstFrame);
      if (secondFrame) window.cancelAnimationFrame(secondFrame);
      if (settleTimer) window.clearTimeout(settleTimer);
    };
  }, [initialTarget, reducedMotion]);

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
    const gameTriggers = gsap.utils.toArray<HTMLElement>("[data-game]").map((element) =>
      ScrollTrigger.create({
        trigger: element,
        start: "top center",
        end: "bottom center",
        onEnter: () => updateShareableLocation(element.dataset.game),
        onEnterBack: () => updateShareableLocation(element.dataset.game),
      }),
    );
    const storyAnimations = reducedMotion
      ? []
      : gsap.utils.toArray<HTMLElement>("[data-story]").map((story) => {
          const world = story.querySelector<HTMLElement>(".story-world");
          const copy = story.querySelector<HTMLElement>(".story-copy");
          const car = story.querySelector<HTMLElement>(".story-car");
          return gsap.timeline({
            scrollTrigger: { trigger: story, start: "top bottom", end: "bottom top", scrub: .8 },
          })
            .fromTo(world, { scale: 1.14, yPercent: -3 }, { scale: 1.02, yPercent: 3, ease: "none" }, 0)
            .fromTo(copy, { y: 100 }, { y: -45, ease: "none" }, 0)
            .fromTo(car, { y: 130 }, { y: -85, ease: "none" }, 0);
        });
    const memoryAnimations = reducedMotion
      ? []
      : gsap.utils.toArray<HTMLElement>("[data-memory]").map((memory) =>
          ScrollTrigger.create({
            trigger: memory,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            onUpdate: ({ progress: value }) => memory.style.setProperty("--memory-progress", value.toFixed(4)),
          }),
        );
    const progress = ScrollTrigger.create({
      start: 0,
      end: () => ScrollTrigger.maxScroll(window),
      onUpdate: ({ progress: value }) => gsap.set(progressBar.current, { scaleX: value }),
    });
    return () => {
      triggers.forEach((trigger) => trigger.kill());
      gameTriggers.forEach((trigger) => trigger.kill());
      storyAnimations.forEach((animation) => animation.kill());
      memoryAnimations.forEach((animation) => animation.kill());
      progress.kill();
    };
  }, [reducedMotion]);

  return (
    <div className="experience" data-active-era={activeEra} data-reduced-motion={reducedMotion}>
      <a className="skip-link" href="#2d">Skip introduction</a>
      <button className="motion-toggle" type="button" aria-pressed={reducedMotion} onClick={() => setReducedMotionPreference(!reducedMotion)}>
        <span aria-hidden="true">{reducedMotion ? "◇" : "◈"}</span>{reducedMotion ? "Calm mode" : "Full motion"}
      </button>
      <div className="noise" aria-hidden="true" />
      <div className="era-ambient" aria-hidden="true" />
      <div className="global-progress" aria-hidden="true"><span ref={progressBar} /></div>
      <EraRail chapters={eraChapters} activeId={activeEra} />
      <EraDial />
      <EraRadio />
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
