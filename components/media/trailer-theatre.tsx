"use client";

import { useState } from "react";
import { trailers, type Trailer } from "@/content/trailers";

function TrailerCard({ trailer, onPlay }: { trailer: Trailer; onPlay: (trailer: Trailer) => void }) {
  return (
    <button className="trailer-card" onClick={() => onPlay(trailer)} type="button">
      <span className="trailer-thumb" style={{ backgroundImage: `url(https://i.ytimg.com/vi/${trailer.id}/hqdefault.jpg)` }}>
        <span className="trailer-play" aria-hidden="true">▶</span>
      </span>
      <span className="trailer-meta"><strong>{trailer.game}</strong><small>{trailer.year} · {trailer.label}</small></span>
    </button>
  );
}

export function TrailerTheatre() {
  const [active, setActive] = useState<Trailer | null>(null);

  return (
    <section className="trailer-theatre" aria-labelledby="trailer-heading" data-reveal>
      <header className="trailer-heading">
        <div><span className="era-count">ROCKSTAR ARCHIVE / OFFICIAL YOUTUBE</span><p className="eyebrow">Remember the first time?</p></div>
        <h2 id="trailer-heading">The<br />trailers</h2>
        <p>Five reveals that marked the jump from one generation to the next. Video loads only after you choose one.</p>
      </header>
      <div className="theatre-screen">
        {active ? (
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            src={`https://www.youtube-nocookie.com/embed/${active.id}?autoplay=1&rel=0`}
            title={`${active.game}: ${active.label}`}
          />
        ) : (
          <div className="theatre-idle">
            <span className="theatre-scan" aria-hidden="true" />
            <p>R★ ARCHIVE TRANSMISSION</p>
            <strong>Select a trailer</strong>
            <small>Playback supplied by official YouTube uploads</small>
          </div>
        )}
      </div>
      <div className="trailer-strip">
        {trailers.map((trailer) => <TrailerCard key={trailer.id} onPlay={setActive} trailer={trailer} />)}
      </div>
    </section>
  );
}
