"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

type Confidence = "estimated" | "contested" | "unknown";
type MapRecord = {
  id: string;
  name: string;
  year: number;
  area: number | null;
  alternate?: number;
  confidence: Confidence;
  color: string;
  note: string;
  density: number;
  character: string;
};

const maps: MapRecord[] = [
  { id: "iii", name: "GTA III", year: 2001, area: 8.1, confidence: "estimated", color: "#7ed07a", note: "Community measurement; Rockstar has not published an official area.", density: 9, character: "Rain · bridges · dense streets" },
  { id: "vice", name: "Vice City", year: 2002, area: 9.1, alternate: 4.25, confidence: "contested", color: "#ff8ac4", note: "Published community estimates disagree substantially depending on the boundary used.", density: 7, character: "Neon · beachfront · low-rise" },
  { id: "sa", name: "San Andreas", year: 2004, area: 36, confidence: "estimated", color: "#f0a22e", note: "A widely used estimate, roughly four times GTA III's measured footprint.", density: 13, character: "Three cities · desert · country" },
  { id: "iv", name: "GTA IV", year: 2008, area: 16.1, confidence: "estimated", color: "#8fb8ff", note: "A community estimate; density makes simple area comparisons incomplete.", density: 16, character: "Vertical · heavy · compressed" },
  { id: "v", name: "GTA V", year: 2013, area: 75.8, alternate: 48, confidence: "contested", color: "#5ad2e8", note: "The larger number includes open water; land-only measurements are considerably smaller.", density: 20, character: "City · mountains · ocean" },
  { id: "vi", name: "GTA VI", year: 2026, area: null, confidence: "unknown", color: "#b79cff", note: "No official map area has been published.", density: 12, character: "Leonida · size undisclosed" },
];

const maxArea = Math.max(...maps.map((map) => map.area ?? 0));

export function MapComparator() {
  const [selected, setSelected] = useState(["iii", "sa"]);
  const [focused, setFocused] = useState<string | null>(null);

  useEffect(() => {
    const values = new URL(window.location.href).searchParams.get("compare")?.split(",").filter((id) => maps.some((map) => map.id === id));
    if (!values || values.length < 1) return;
    const restore = window.setTimeout(() => setSelected(values.slice(0, 4)), 0);
    return () => window.clearTimeout(restore);
  }, []);

  const toggle = (id: string) => {
    const next = selected.includes(id)
      ? selected.length > 1 ? selected.filter((entry) => entry !== id) : selected
      : [...selected.slice(-3), id];
    setSelected(next);
    const url = new URL(window.location.href);
    url.searchParams.set("compare", next.join(","));
    window.history.replaceState(null, "", `${url.pathname}${url.search}#compare`);
  };

  const chosen = maps.filter((map) => selected.includes(map.id));
  const knownChosen = useMemo(() => chosen.filter((map): map is MapRecord & { area: number } => map.area !== null).sort((a, b) => b.area - a.area), [chosen]);
  const comparison = knownChosen.length > 1
    ? `${knownChosen[0].name} is ${(knownChosen[0].area / knownChosen.at(-1)!.area).toFixed(1)}× the area of ${knownChosen.at(-1)!.name}`
    : knownChosen.length === 1 ? `${knownChosen[0].area} km² estimated footprint` : "Size remains undisclosed";

  return (
    <section className="map-comparator" id="compare" aria-labelledby="compare-title">
      <header>
        <div><span className="era-count">INTERACTION / TRUE RELATIVE AREA</span><p className="eyebrow">An honest comparison</p></div>
        <h2 id="compare-title">How big<br />was the leap?</h2>
        <p>Select up to four worlds. The ground platform represents area; the skyline shows each world&apos;s density and visual character.</p>
      </header>
      <div className="comparator-grid">
        <div className="comparator-stage" aria-label="Selected map footprints shown at relative scale">
          <div className="comparator-gridlines" aria-hidden="true" />
          <div className="map-stage-heading"><span>AREA SCAN / {chosen.length.toString().padStart(2, "0")} WORLDS</span><strong>{comparison}</strong></div>
          <div className="city-horizon" aria-hidden="true"><i /><b /></div>
          <div className="city-comparison">
            {chosen.map((map, index) => {
              const scale = map.area ? Math.sqrt(map.area / maxArea) : .44;
              return (
                <button
                  className="city-diorama"
                  data-city={map.id}
                  data-unknown={map.area === null}
                  data-muted={focused !== null && focused !== map.id}
                  key={map.id}
                  type="button"
                  onClick={() => toggle(map.id)}
                  onPointerEnter={() => setFocused(map.id)}
                  onPointerLeave={() => setFocused(null)}
                  onFocus={() => setFocused(map.id)}
                  onBlur={() => setFocused(null)}
                  style={{ "--city-scale": scale, "--city-width": `${8 + scale * 8}rem`, "--city-color": map.color } as CSSProperties}
                  aria-label={`${map.name}, ${map.area ? `approximately ${map.alternate ? `${map.alternate} to ${map.area}` : map.area} square kilometres` : "size not public"}. Remove from comparison.`}
                >
                  <span className="city-platform">
                    <span className="city-road city-road--a" /><span className="city-road city-road--b" />
                    <span className="city-buildings">
                      {Array.from({ length: map.density }, (_, building) => <i key={building} style={{ "--building-height": `${28 + ((building * 31 + map.year) % 62)}%`, "--building-delay": `${building * -.08}s` } as CSSProperties} />)}
                    </span>
                    <span className="city-landmark"><i /><b /></span>
                    {map.area === null && <span className="city-fog">?</span>}
                  </span>
                  <span className="city-label"><small>{(index + 1).toString().padStart(2, "0")} / {map.year}</small><strong>{map.name}</strong><em>{map.area ? `${map.area} km²` : "Size unknown"}</em><b>{map.character}</b></span>
                </button>
              );
            })}
          </div>
          <div className="city-key" aria-hidden="true"><i />GROUND AREA = RELATIVE WORLD SIZE</div>
        </div>
        <aside className="comparator-controls">
          <header><span>WORLD DATABASE</span><strong>{selected.length} / 4 ACTIVE</strong></header>
          <div className="map-chips">{maps.map((map) => <button key={map.id} type="button" aria-pressed={selected.includes(map.id)} onClick={() => toggle(map.id)} onPointerEnter={() => setFocused(map.id)} onPointerLeave={() => setFocused(null)} style={{ "--map-color": map.color } as CSSProperties}><i />{map.name}<small>{map.area ?? "?"}</small></button>)}</div>
          <div className="map-rows">{chosen.map((map, index) => {
            const high = map.area ? map.area / maxArea * 100 : 0;
            const low = map.alternate ? map.alternate / maxArea * 100 : high;
            return <article key={map.id} data-muted={focused !== null && focused !== map.id} style={{ "--map-color": map.color } as CSSProperties} onPointerEnter={() => setFocused(map.id)} onPointerLeave={() => setFocused(null)}>
              <header><i>{(index + 1).toString().padStart(2, "0")}</i><strong>{map.name}</strong><span data-confidence={map.confidence}>{map.confidence}</span></header>
              <div><i style={{ width: `${high}%` }} /><b style={{ width: `${low}%` }} /></div>
              <p>{map.area ? `${map.alternate ? `${map.alternate}–` : ""}${map.area} km²` : "Not public"} · {map.year}</p>
              <small>{map.note}</small>
            </article>;
          })}</div>
        </aside>
      </div>
    </section>
  );
}
