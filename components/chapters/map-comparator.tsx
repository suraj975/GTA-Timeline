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
  shapes: string[];
};

const maps: MapRecord[] = [
  { id: "iii", name: "GTA III", year: 2001, area: 8.1, confidence: "estimated", color: "#7ed07a", note: "Community measurement; Rockstar has not published an official area.", shapes: ["M23 12 45 6 65 13 82 31 76 47 88 61 73 83 51 92 28 83 14 64 21 45 12 29Z"] },
  { id: "vice", name: "Vice City", year: 2002, area: 9.1, alternate: 4.25, confidence: "contested", color: "#ff8ac4", note: "Published community estimates disagree substantially depending on the boundary used.", shapes: ["M25 9 42 7 49 20 45 39 34 53 19 43 14 25Z", "M59 18 79 12 89 27 86 48 74 57 81 77 67 91 53 75 57 55 51 36Z"] },
  { id: "sa", name: "San Andreas", year: 2004, area: 36, confidence: "estimated", color: "#f0a22e", note: "A widely used estimate, roughly four times GTA III's measured footprint.", shapes: ["M17 20 37 6 55 13 70 8 87 24 82 43 92 61 77 88 52 94 35 84 16 89 7 68 16 50 8 35Z"] },
  { id: "iv", name: "GTA IV", year: 2008, area: 16.1, confidence: "estimated", color: "#8fb8ff", note: "A community estimate; density makes simple area comparisons incomplete.", shapes: ["M21 11 41 8 48 28 41 48 20 43 12 28Z", "M56 8 77 14 85 34 76 51 55 44 49 26Z", "M31 59 51 49 65 59 61 83 40 93 22 77Z", "M72 61 89 55 94 72 83 88 67 79Z"] },
  { id: "v", name: "GTA V", year: 2013, area: 75.8, alternate: 48, confidence: "contested", color: "#5ad2e8", note: "The larger number includes open water; land-only measurements are considerably smaller.", shapes: ["M9 28 23 9 47 5 69 13 88 29 94 51 84 74 64 91 41 94 17 83 5 62 13 47Z"] },
  { id: "vi", name: "GTA VI", year: 2026, area: null, confidence: "unknown", color: "#b79cff", note: "No official map area has been published.", shapes: [] },
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
        <p>Select up to four worlds. Hover or tap a footprint to isolate it. The silhouettes are schematic; their relative areas are not.</p>
      </header>
      <div className="comparator-grid">
        <div className="comparator-stage" aria-label="Selected map footprints shown at relative scale">
          <div className="comparator-gridlines" aria-hidden="true" />
          <div className="map-stage-heading"><span>AREA SCAN / {chosen.length.toString().padStart(2, "0")} WORLDS</span><strong>{comparison}</strong></div>
          <div className="map-crosshair" aria-hidden="true"><i /><b /></div>
          <div className="map-plot">
            {chosen.map((map, index) => {
              const scale = map.area ? Math.sqrt(map.area / maxArea) * 82 : 38;
              return map.area ? (
                <button
                  className="map-footprint"
                  data-muted={focused !== null && focused !== map.id}
                  key={map.id}
                  type="button"
                  onClick={() => toggle(map.id)}
                  onPointerEnter={() => setFocused(map.id)}
                  onPointerLeave={() => setFocused(null)}
                  onFocus={() => setFocused(map.id)}
                  onBlur={() => setFocused(null)}
                  style={{ width: `${scale}%`, color: map.color, "--map-order": index } as CSSProperties}
                  aria-label={`${map.name}, approximately ${map.alternate ? `${map.alternate} to ${map.area}` : map.area} square kilometres. Remove from comparison.`}
                >
                  <svg viewBox="0 0 100 100" aria-hidden="true">
                    <defs><pattern id={`hatch-${map.id}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="6" /></pattern></defs>
                    {map.shapes.map((shape) => <path d={shape} key={shape} fill={`url(#hatch-${map.id})`} />)}
                  </svg>
                  <span>{(index + 1).toString().padStart(2, "0")}</span>
                </button>
              ) : (
                <button className="map-unknown" data-muted={focused !== null && focused !== map.id} key={map.id} type="button" style={{ color: map.color }} onClick={() => toggle(map.id)} onPointerEnter={() => setFocused(map.id)} onPointerLeave={() => setFocused(null)} onFocus={() => setFocused(map.id)} onBlur={() => setFocused(null)}>
                  <strong>?</strong><span>{map.name}<br />SIZE NOT PUBLIC</span>
                </button>
              );
            })}
          </div>
          <div className="map-stage-legend">
            {chosen.map((map, index) => <button key={map.id} type="button" style={{ "--map-color": map.color } as CSSProperties} onClick={() => toggle(map.id)} onPointerEnter={() => setFocused(map.id)} onPointerLeave={() => setFocused(null)}><i>{(index + 1).toString().padStart(2, "0")}</i><span>{map.name}</span><small>{map.area ? `${map.area} km²` : "Unknown"}</small></button>)}
          </div>
          <div className="map-scale" aria-hidden="true"><i />5 KM</div>
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
