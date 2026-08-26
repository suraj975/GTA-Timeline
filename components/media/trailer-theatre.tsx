"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { trailers, type Trailer } from "@/content/trailers";
import { useReducedMotion } from "@/lib/capability/use-reduced-motion";

function caseGeneration(game: string) {
  if (game === "GTA III" || game === "Vice City") return "classic";
  if (game === "GTA IV") return "hd";
  if (game === "GTA VI") return "future";
  return "modern";
}

function caseLabel(game: string) {
  if (game === "GTA III" || game === "Vice City") return "CLASSIC ARCHIVE";
  if (game === "GTA IV") return "HD GENERATION";
  if (game === "GTA VI") return "LEONIDA ARCHIVE";
  return "MODERN ARCHIVE";
}

function TrailerCase({ trailer, active, onSelect }: { trailer: Trailer; active: boolean; onSelect: (trailer: Trailer) => void }) {
  return (
    <button className="game-case" data-generation={caseGeneration(trailer.game)} aria-pressed={active} onClick={() => onSelect(trailer)} type="button">
      <span className="case-spine"><small>{trailer.year}</small><strong>{trailer.game}</strong></span>
      <span className="case-cover-art">
        <Image src={`https://i.ytimg.com/vi/${trailer.id}/hqdefault.jpg`} alt="" fill sizes="(max-width: 720px) 42vw, 14vw" />
        <span className="case-plastic" aria-hidden="true" />
        <small>{caseLabel(trailer.game)}</small>
        <strong>{trailer.game}</strong>
        <em>OFFICIAL TRAILER</em>
      </span>
      <span className="case-shadow" aria-hidden="true" />
    </button>
  );
}

export function TrailerTheatre() {
  const [active, setActive] = useState<Trailer | null>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const openTimer = useRef<number>(0);
  const reducedMotion = useReducedMotion();

  const selectTrailer = (trailer: Trailer) => {
    window.clearTimeout(openTimer.current);
    setPlayerReady(false);
    setActive(trailer);
    openTimer.current = window.setTimeout(() => setPlayerReady(true), reducedMotion ? 40 : 1050);
  };

  const closeCase = () => {
    window.clearTimeout(openTimer.current);
    setPlayerReady(false);
    setActive(null);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        window.clearTimeout(openTimer.current);
        setPlayerReady(false);
        setActive(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(openTimer.current);
    };
  }, []);

  return (
    <section className="trailer-theatre" id="trailers" aria-labelledby="trailer-heading">
      <header className="trailer-heading">
        <div><span className="era-count">ROCKSTAR ARCHIVE / OFFICIAL YOUTUBE</span><p className="eyebrow">Remember opening the case?</p></div>
        <h2 id="trailer-heading">The<br />trailers</h2>
        <p>Choose a case from the archive shelf. It opens into a private screening room and loads video only after selection.</p>
      </header>

      <div className="case-theatre" data-active={Boolean(active)} data-ready={playerReady}>
        <div className="archive-idle" aria-hidden={Boolean(active)}>
          <span>R★ / PHYSICAL MEDIA ARCHIVE</span>
          <strong>Choose a case</strong>
          <small>Five reveals · three console generations · one shelf</small>
        </div>

        {active && (
          <div className="open-case-scene" aria-live="polite">
            <div className="open-case" data-generation={caseGeneration(active.game)}>
              <div className="case-base">
                <div className="case-player">
                  {playerReady ? (
                    <div className="case-screening">
                      <Image src={`https://i.ytimg.com/vi/${active.id}/hqdefault.jpg`} alt="" fill sizes="48vw" />
                      <div className="screening-vignette" />
                      <div className="screening-copy">
                        <span>R★ OFFICIAL / {active.year}</span>
                        <strong>{active.label}</strong>
                        <a href={`https://www.youtube.com/watch?v=${active.id}`} target="_blank" rel="noreferrer">
                          <i aria-hidden="true" /> Watch official trailer
                        </a>
                        <small>Opens on YouTube so mature-content verification works correctly.</small>
                      </div>
                    </div>
                  ) : (
                    <div className="case-loading"><span /><p>OPENING ARCHIVE CASE</p><strong>{active.game}</strong></div>
                  )}
                </div>
                <span className="case-hinge" aria-hidden="true" />
              </div>

              <div className="case-door" aria-hidden="true">
                <div className="case-door-front">
                  <Image src={`https://i.ytimg.com/vi/${active.id}/hqdefault.jpg`} alt="" fill sizes="38vw" />
                  <span className="case-plastic" />
                  <strong>{active.game}</strong>
                </div>
                <div className="case-door-inside">
                  <span className="disc-clips" />
                  <span className="archive-disc" style={{ "--disc-art": `url(https://i.ytimg.com/vi/${active.id}/hqdefault.jpg)` } as CSSProperties}><i /><b>{active.game}</b><small>OFFICIAL TRAILER</small></span>
                  <em>{caseLabel(active.game)}</em>
                </div>
              </div>
            </div>
            <div className="case-now-playing"><span>{active.year}</span><strong>{active.game}</strong><small>{active.label}</small></div>
            <button className="case-close" type="button" onClick={closeCase} aria-label="Close trailer case">Close case <span aria-hidden="true">×</span></button>
          </div>
        )}
      </div>

      <div className="case-shelf" aria-label="Trailer case collection">
        <span className="shelf-label" aria-hidden="true">R★ VIDEO ARCHIVE · SELECT A CASE</span>
        <div className="case-collection">
          {trailers.map((trailer) => <TrailerCase key={trailer.id} active={active?.id === trailer.id} onSelect={selectTrailer} trailer={trailer} />)}
        </div>
        <span className="shelf-edge" aria-hidden="true" />
      </div>
    </section>
  );
}
