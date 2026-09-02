"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { commercialRecords, undisclosedTitles } from "@/content/commercial-impact";

type ScoreStyle = CSSProperties & {
  "--score-accent": string;
  "--vault-turn": string;
};

export function CommercialImpact() {
  const [activeIndex, setActiveIndex] = useState(4);
  const [vaultTurn, setVaultTurn] = useState(4 * 63 - 24);
  const [isTurning, setIsTurning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const depositWall = useRef<HTMLDivElement>(null);
  const drag = useRef({ pointerId: -1, lastAngle: 0, accumulated: 0, startTurn: 0, currentTurn: 0 });
  const turnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const active = commercialRecords[activeIndex];
  const style: ScoreStyle = {
    "--score-accent": active.accent,
    "--vault-turn": `${vaultTurn}deg`,
  };

  const stopTurningSoon = () => {
    if (turnTimer.current) clearTimeout(turnTimer.current);
    turnTimer.current = setTimeout(() => setIsTurning(false), 520);
  };

  const selectRecord = (index: number) => {
    const nextIndex = Math.max(0, Math.min(commercialRecords.length - 1, index));
    setActiveIndex(nextIndex);
    setVaultTurn(nextIndex * 63 - 24);
    setIsTurning(true);
    stopTurningSoon();
  };

  const pointerAngle = (event: PointerEvent<HTMLButtonElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    return Math.atan2(event.clientY - (bounds.top + bounds.height / 2), event.clientX - (bounds.left + bounds.width / 2)) * 180 / Math.PI;
  };

  const beginDialTurn = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { pointerId: event.pointerId, lastAngle: pointerAngle(event), accumulated: 0, startTurn: vaultTurn, currentTurn: vaultTurn };
    setIsDragging(true);
    setIsTurning(true);
  };

  const turnDial = (event: PointerEvent<HTMLButtonElement>) => {
    if (drag.current.pointerId !== event.pointerId) return;
    const angle = pointerAngle(event);
    let delta = angle - drag.current.lastAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    drag.current.lastAngle = angle;
    drag.current.accumulated += delta;

    const minimum = -24;
    const maximum = (commercialRecords.length - 1) * 63 - 24;
    const nextTurn = Math.max(minimum, Math.min(maximum, drag.current.startTurn + drag.current.accumulated));
    const nextIndex = Math.round((nextTurn + 24) / 63);
    drag.current.currentTurn = nextTurn;
    setVaultTurn(nextTurn);
    setActiveIndex(nextIndex);
  };

  const endDialTurn = (event: PointerEvent<HTMLButtonElement>) => {
    if (drag.current.pointerId !== event.pointerId) return;
    drag.current.pointerId = -1;
    const snappedIndex = Math.round((drag.current.currentTurn + 24) / 63);
    setActiveIndex(snappedIndex);
    setVaultTurn(snappedIndex * 63 - 24);
    setIsDragging(false);
    stopTurningSoon();
  };

  const useDialKeys = (event: KeyboardEvent<HTMLButtonElement>) => {
    const direction = event.key === "ArrowRight" || event.key === "ArrowUp" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowDown" ? -1 : 0;
    if (direction) {
      event.preventDefault();
      selectRecord(activeIndex + direction);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      selectRecord(event.key === "Home" ? 0 : commercialRecords.length - 1);
    }
  };

  useEffect(() => {
    const wall = depositWall.current;
    const selected = wall?.querySelector<HTMLElement>("[aria-selected='true']");
    if (!wall || !selected || wall.scrollWidth <= wall.clientWidth) return;
    wall.scrollTo({ left: selected.offsetLeft - wall.clientWidth / 2 + selected.clientWidth / 2, behavior: "smooth" });
  }, [activeIndex]);

  useEffect(() => () => {
    if (turnTimer.current) clearTimeout(turnTimer.current);
  }, []);

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

      <div className="score-vault" data-turning={isTurning}>
        <div className="vault-room">
          <div className="vault-shadow" aria-hidden="true" />
          <button
            className="vault-door"
            type="button"
            role="slider"
            aria-label="Commercial record vault dial"
            aria-valuemin={1}
            aria-valuemax={commercialRecords.length}
            aria-valuenow={activeIndex + 1}
            aria-valuetext={`${active.game}: ${active.metric} ${active.metricLabel}`}
            aria-describedby="vault-instructions"
            data-dragging={isDragging}
            onPointerDown={beginDialTurn}
            onPointerMove={turnDial}
            onPointerUp={endDialTurn}
            onPointerCancel={endDialTurn}
            onKeyDown={useDialKeys}
          >
            <div className="vault-ring vault-ring--outer" aria-hidden="true" />
            <div className="vault-ring vault-ring--energy" aria-hidden="true" />
            <div className="vault-ring vault-ring--inner" aria-hidden="true" />
            <div className="vault-spokes" aria-hidden="true">
              {Array.from({ length: 6 }, (_, index) => <i key={index} />)}
            </div>
            <div className="vault-hub" aria-hidden="true"><span>GTH</span><small>PUBLIC<br />RECORD</small></div>
          </button>
          <p className="vault-instructions" id="vault-instructions"><b>Drag to turn</b><span>or use arrow keys</span></p>
          <div className="vault-floor" aria-hidden="true" />
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
              onClick={() => selectRecord(index)}
              onPointerEnter={() => selectRecord(index)}
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
