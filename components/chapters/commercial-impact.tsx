"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { commercialRecords, undisclosedTitles } from "@/content/commercial-impact";

type ScoreStyle = CSSProperties & {
  "--score-accent": string;
  "--vault-turn": string;
};

export function CommercialImpact() {
  const [activeIndex, setActiveIndex] = useState(4);
  const depositWall = useRef<HTMLDivElement>(null);
  const active = commercialRecords[activeIndex];
  const style: ScoreStyle = {
    "--score-accent": active.accent,
    "--vault-turn": `${activeIndex * 63 - 24}deg`,
  };

  useEffect(() => {
    const wall = depositWall.current;
    const selected = wall?.querySelector<HTMLElement>("[aria-selected='true']");
    if (!wall || !selected || wall.scrollWidth <= wall.clientWidth) return;
    wall.scrollTo({ left: selected.offsetLeft - wall.clientWidth / 2 + selected.clientWidth / 2, behavior: "smooth" });
  }, [activeIndex]);

  return (
    <section className="score-section" id="the-biggest-score" data-location="the-biggest-score" aria-labelledby="score-title" style={style}>
      <div className="score-security-light" aria-hidden="true" />
      <header className="score-heading">
        <div>
          <span className="era-count">INTELLIGENCE / PUBLIC RECORD</span>
          <p className="eyebrow">The commercial story</p>
        </div>
        <h2 id="score-title">The biggest<br /><em>score.</em></h2>
        <p>
          Not profit. Not internet guesses. These are the moments Take-Two put on the record—launch sales,
          shipped copies and the occasional number it chose not to reveal.
        </p>
      </header>

      <div className="score-vault">
        <div className="vault-room" aria-hidden="true">
          <div className="vault-shadow" />
          <div className="vault-door">
            <div className="vault-ring vault-ring--outer" />
            <div className="vault-ring vault-ring--inner" />
            <div className="vault-spokes">
              {Array.from({ length: 6 }, (_, index) => <i key={index} />)}
            </div>
            <div className="vault-hub"><span>GTH</span><small>PUBLIC<br />RECORD</small></div>
          </div>
          <div className="vault-floor" />
        </div>

        <div className="score-readout" aria-live="polite">
          <span>{active.period}</span>
          <strong>{active.metric}</strong>
          <small>{active.metricLabel}</small>
        </div>

        <div className="deposit-wall" ref={depositWall} role="tablist" aria-label="Choose a commercial milestone">
          {commercialRecords.map((record, index) => (
            <button
              key={record.id}
              id={`score-tab-${record.id}`}
              role="tab"
              aria-selected={index === activeIndex}
              aria-controls="score-record"
              style={{ "--deposit-accent": record.accent } as CSSProperties}
              onClick={() => setActiveIndex(index)}
              onPointerEnter={() => setActiveIndex(index)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{record.game}</strong>
              <small>{record.year}</small>
            </button>
          ))}
        </div>

        <article className="score-dossier" id="score-record" role="tabpanel" aria-labelledby={`score-tab-${active.id}`}>
          <header><span>FILE / {active.id.toUpperCase()}</span><b data-status={active.status}>{active.statusLabel}</b></header>
          <div className="score-dossier-number"><strong>{active.metric}</strong><span>{active.metricLabel}</span></div>
          <h3>{active.game}</h3>
          <p>{active.detail}</p>
          <dl>
            <div><dt>Recorded</dt><dd>{active.period}</dd></div>
            <div><dt>Measure</dt><dd>{active.status === "launch" ? "Retail sales" : active.metricLabel}</dd></div>
          </dl>
          <a href={active.sourceUrl} target="_blank" rel="noreferrer">
            Open original record <span aria-hidden="true">↗</span><small>{active.sourceLabel}</small>
          </a>
        </article>
      </div>

      <div className="score-ledger">
        <span>ARCHIVE NOTE / NO STANDALONE LIFETIME REVENUE DISCLOSED</span>
        <div>{undisclosedTitles.map((title) => <small key={title}>{title}</small>)}</div>
        <p>
          A blank record is not zero. It means no dependable standalone total was published, so this archive leaves
          the drawer closed instead of manufacturing a number.
        </p>
      </div>
    </section>
  );
}
