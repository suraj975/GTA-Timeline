"use client";

import { useEffect, useState, type CSSProperties } from "react";

type Confidence = "estimated" | "contested" | "unknown";
type MapRecord = { id: string; name: string; year: number; area: number | null; alternate?: number; confidence: Confidence; color: string; note: string };

const maps: MapRecord[] = [
  { id: "iii", name: "GTA III", year: 2001, area: 8.1, confidence: "estimated", color: "#7ed07a", note: "Community measurement; Rockstar has not published an official area." },
  { id: "vice", name: "Vice City", year: 2002, area: 9.1, alternate: 4.25, confidence: "contested", color: "#ff8ac4", note: "Published community estimates disagree substantially depending on the boundary used." },
  { id: "sa", name: "San Andreas", year: 2004, area: 36, confidence: "estimated", color: "#f0a22e", note: "A widely used estimate, roughly four times GTA III's measured footprint." },
  { id: "iv", name: "GTA IV", year: 2008, area: 16.1, confidence: "estimated", color: "#8fb8ff", note: "A community estimate; density makes simple area comparisons incomplete." },
  { id: "v", name: "GTA V", year: 2013, area: 75.8, alternate: 48, confidence: "contested", color: "#5ad2e8", note: "The larger number includes open water; land-only measurements are considerably smaller." },
  { id: "vi", name: "GTA VI", year: 2026, area: null, confidence: "unknown", color: "#b79cff", note: "No official map area has been published." },
];

const maxArea = Math.max(...maps.map((map) => map.area ?? 0));

export function MapComparator() {
  const [selected, setSelected] = useState(["iii", "sa"]);

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
  return (
    <section className="map-comparator" id="compare" aria-labelledby="compare-title">
      <header>
        <div><span className="era-count">INTERACTION / TRUE RELATIVE AREA</span><p className="eyebrow">An honest comparison</p></div>
        <h2 id="compare-title">How big<br />was the leap?</h2>
        <p>Select up to four worlds. The outlines are schematic; their relative areas are not. Uncertain figures remain visibly uncertain.</p>
      </header>
      <div className="comparator-grid">
        <div className="comparator-stage" aria-label="Selected map footprints shown at relative scale">
          <div className="comparator-gridlines" aria-hidden="true" />
          {chosen.map((map, index) => {
            const scale = map.area ? Math.sqrt(map.area / maxArea) * 82 : 38;
            return map.area ? (
              <svg className="map-footprint" key={map.id} viewBox="0 0 100 100" style={{ width: `${scale}%`, color: map.color, "--map-order": index } as CSSProperties} role="img" aria-label={`${map.name}, approximately ${map.alternate ? `${map.alternate} to ${map.area}` : map.area} square kilometres`}>
                <path d="M48 4 C67 7 84 20 88 38 C94 55 82 73 68 85 C54 97 33 96 18 83 C4 70 8 53 13 38 C18 22 29 7 48 4Z" />
                <text x="50" y="54" textAnchor="middle">{map.name}</text>
              </svg>
            ) : <div className="map-unknown" key={map.id} style={{ color: map.color }}><strong>{map.name}</strong><span>SIZE NOT PUBLIC</span></div>;
          })}
          <div className="map-scale" aria-hidden="true"><i />5 KM</div>
        </div>
        <aside className="comparator-controls">
          <div className="map-chips">{maps.map((map) => <button key={map.id} type="button" aria-pressed={selected.includes(map.id)} onClick={() => toggle(map.id)} style={{ "--map-color": map.color } as CSSProperties}><i />{map.name}</button>)}</div>
          <div className="map-rows">{chosen.map((map) => {
            const high = map.area ? map.area / maxArea * 100 : 0;
            const low = map.alternate ? map.alternate / maxArea * 100 : high;
            return <article key={map.id} style={{ "--map-color": map.color } as CSSProperties}>
              <header><strong>{map.name}</strong><span data-confidence={map.confidence}>{map.confidence}</span></header>
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
