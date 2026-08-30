"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

type ViewMode = "world" | "scale" | "drive";
type MapRecord = {
  id: string;
  name: string;
  shortName: string;
  year: number;
  area: number | null;
  alternate?: number;
  color: string;
  accent: string;
  outline: string;
  character: string;
  region: string;
  confidence: string;
  core: [number, number];
  airport: [number, number];
};

const maps: MapRecord[] = [
  { id: "iii", name: "GTA III", shortName: "III", year: 2001, area: 8.1, color: "#9cbd79", accent: "#d9e9c4", outline: "M318 136L500 102 681 156 744 270 690 453 535 516 351 472 254 344 266 222Z", character: "Rain, bridges and compressed streets", region: "Liberty City", confidence: "Community estimate", core: [505, 310], airport: [350, 405] },
  { id: "vice", name: "Vice City", shortName: "VICE", year: 2002, area: 9.1, alternate: 4.25, color: "#ff77b9", accent: "#51d9df", outline: "M286 140L409 116 446 182 429 460 315 488 251 398 258 224ZM547 104L681 140 735 246 716 440 588 498 520 422 530 196Z", character: "Beachfront, islands and neon nights", region: "Vice City", confidence: "Contested estimate", core: [628, 302], airport: [342, 390] },
  { id: "sa", name: "San Andreas", shortName: "SA", year: 2004, area: 36, color: "#e2ad51", accent: "#86ad62", outline: "M217 142L375 82 516 116 656 76 773 174 746 314 802 419 693 524 526 493 385 538 225 451 174 316Z", character: "Three cities, desert and countryside", region: "The entire state", confidence: "Community estimate", core: [350, 383], airport: [296, 445] },
  { id: "iv", name: "GTA IV", shortName: "IV", year: 2008, area: 16.1, color: "#9bb7d3", accent: "#d9e1e7", outline: "M301 117L443 91 490 171 461 290 502 384 421 509 292 471 247 344ZM545 105L700 149 746 279 692 477 552 500 505 390 534 279ZM456 259L542 240 567 342 507 397 448 353Z", character: "Vertical, dense and steel-grey", region: "Liberty City", confidence: "Community estimate", core: [606, 304], airport: [358, 421] },
  { id: "v", name: "GTA V", shortName: "V", year: 2013, area: 75.8, alternate: 48, color: "#9aca64", accent: "#f2d479", outline: "M218 88L387 50 548 81 699 57 818 156 850 288 799 429 680 541 516 566 351 527 213 449 145 322 164 188Z", character: "City, mountains, desert and ocean", region: "Los Santos & Blaine County", confidence: "Land and water estimate", core: [414, 401], airport: [309, 476] },
  { id: "vi", name: "GTA VI", shortName: "VI", year: 2026, area: null, color: "#ff706d", accent: "#63d9d0", outline: "M206 95L419 57 605 85 761 63 838 168 804 291 855 407 713 536 526 559 357 529 216 447 153 306Z", character: "Leonida, wetlands and modern Vice City", region: "Leonida", confidence: "Official area undisclosed", core: [610, 370], airport: [406, 448] },
];

const gtaV = maps.find((map) => map.id === "v")!;

function Terrain({ map, comparison = false, scale = 1 }: { map: MapRecord; comparison?: boolean; scale?: number }) {
  const clipId = `terrain-${map.id}-${comparison ? "comparison" : "primary"}`;
  const transform = comparison ? `translate(500 310) scale(${scale}) translate(-500 -310)` : undefined;
  return (
    <g className={`world-terrain ${comparison ? "world-terrain--comparison" : "world-terrain--primary"}`} data-world={map.id} style={{ "--world-color": map.color, "--world-accent": map.accent } as CSSProperties} transform={transform}>
      <defs><clipPath id={clipId}><path d={map.outline} /></clipPath></defs>
      <path className="world-island-depth" d={map.outline} transform="translate(0 18)" />
      <path className="world-island" d={map.outline} />
      <g clipPath={`url(#${clipId})`}>
        <path className="terrain-shade" d="M100 440C260 328 351 367 464 260S711 113 910 171V610H100Z" />
        <g className="terrain-contours">
          <path d="M130 205C250 126 341 157 405 215S554 260 646 185 814 121 902 197" />
          <path d="M113 244C244 167 331 196 406 253S554 293 666 221 824 176 919 248" />
          <path d="M105 284C225 221 326 229 409 286S577 330 687 268 828 230 925 297" />
          <path d="M121 330C244 270 330 276 429 332S592 369 716 314 845 287 924 344" />
        </g>
        <g className="terrain-roads">
          <path d="M169 427C276 395 327 312 409 287S553 280 626 197 768 148 838 186" />
          <path d="M227 505C310 445 395 437 469 371S609 296 747 312 808 401 776 483" />
          <path d="M250 149C310 213 374 235 447 226S603 175 716 110" />
          <path d="M337 92C370 177 385 265 356 347S358 465 442 535" />
          <path d="M584 87C559 177 577 250 640 317S714 432 672 521" />
        </g>
        <g className="city-grid" transform={`translate(${map.core[0] - 74} ${map.core[1] - 52})`}>
          {Array.from({ length: 18 }, (_, index) => <rect key={index} x={(index % 6) * 25} y={Math.floor(index / 6) * 35} width="17" height="25" rx="2" />)}
        </g>
        <g className="airport" transform={`translate(${map.airport[0]} ${map.airport[1]}) rotate(-14)`}>
          <rect x="-58" y="-8" width="116" height="16" rx="2" /><path d="M-48 0H48" />
        </g>
        <g className="world-blips">
          <circle cx={map.core[0]} cy={map.core[1]} r="8" /><circle cx={map.airport[0]} cy={map.airport[1]} r="5" />
          <circle cx="676" cy="191" r="4" /><circle cx="745" cy="377" r="4" /><circle cx="340" cy="222" r="4" />
        </g>
        <g className="traffic-stream"><path d="M178 426C287 393 325 311 411 286S558 277 628 197 770 149 837 185" /><circle r="4"><animateMotion dur="7s" repeatCount="indefinite" path="M178 426C287 393 325 311 411 286S558 277 628 197 770 149 837 185" /></circle></g>
      </g>
      <path className="world-coastline" d={map.outline} />
      {map.id === "vi" && <g className="undisclosed"><text x="500" y="310">?</text><text x="500" y="352">SURVEY INCOMPLETE</text></g>}
    </g>
  );
}

export function MapComparator() {
  const [activeId, setActiveId] = useState("v");
  const [mode, setMode] = useState<ViewMode>("world");
  const [switching, setSwitching] = useState(false);
  const timers = useRef<number[]>([]);
  const active = maps.find((map) => map.id === activeId) ?? gtaV;

  useEffect(() => {
    const timerList = timers.current;
    const url = new URL(window.location.href);
    const requested = url.searchParams.get("world") ?? url.searchParams.get("compare")?.split(",").at(-1);
    const requestedMode = url.searchParams.get("view") as ViewMode | null;
    timerList.push(window.setTimeout(() => {
      if (requested && maps.some((map) => map.id === requested)) setActiveId(requested);
      if (requestedMode && ["world", "scale", "drive"].includes(requestedMode)) setMode(requestedMode);
    }, 0));
    return () => timerList.forEach(window.clearTimeout);
  }, []);

  const selectWorld = (id: string) => {
    if (id === activeId || switching) return;
    setSwitching(true);
    timers.current.push(window.setTimeout(() => setActiveId(id), 240));
    timers.current.push(window.setTimeout(() => setSwitching(false), 820));
    const url = new URL(window.location.href);
    url.searchParams.delete("compare");
    url.searchParams.set("world", id);
    url.searchParams.set("view", mode);
    window.history.replaceState(null, "", `${url.pathname}${url.search}#compare`);
  };

  const changeMode = (next: ViewMode) => {
    setMode(next);
    const url = new URL(window.location.href);
    url.searchParams.set("world", active.id);
    url.searchParams.set("view", next);
    window.history.replaceState(null, "", `${url.pathname}${url.search}#compare`);
  };

  const scale = active.area ? Math.sqrt(active.area / gtaV.area!) : .72;
  const ratio = active.area && active.id !== "v" ? gtaV.area! / active.area : null;
  const distance = active.area ? Math.max(42, Math.round(Math.sqrt(active.area) * 17)) : null;
  const cameraLabel = useMemo(() => switching ? "ACQUIRING SATELLITE" : mode === "drive" ? "ROUTE LIVE" : mode === "scale" ? "TRUE-SCALE OVERLAY" : "AERIAL SURVEY", [mode, switching]);

  return (
    <section className="map-comparator world-switch" id="compare" aria-labelledby="compare-title">
      <header>
        <div><span className="era-count">INTERACTION / SATELLITE SURVEY</span><p className="eyebrow">The world switch</p></div>
        <h2 id="compare-title">How big<br />was the leap?</h2>
        <p>Leave the street. Climb through the clouds. Switch worlds and feel how the map expanded from one dense city into an entire state.</p>
      </header>

      <div className="world-switch-shell" data-switching={switching} data-mode={mode} data-world={active.id}>
        <div className="satellite-stage">
          <div className="ocean-field" aria-hidden="true"><i /><i /><i /></div>
          <svg className="terrain-map" viewBox="0 0 1000 620" role="img" aria-label={`${active.name} aerial terrain${mode === "scale" ? " compared at true scale with GTA V" : ""}`}>
            {mode === "scale" && active.id !== "v" ? <><Terrain map={gtaV} /><Terrain map={active} comparison scale={scale} /></> : <Terrain map={active} />}
            {mode === "drive" && <g className="drive-route"><path d="M217 445C307 390 354 334 430 309S557 287 634 220 751 181 816 229" /><circle className="route-car" r="7"><animateMotion dur={`${distance ? Math.min(12, distance / 8) : 9}s`} repeatCount="indefinite" path="M217 445C307 390 354 334 430 309S557 287 634 220 751 181 816 229" /></circle></g>}
          </svg>

          <div className="satellite-scan" aria-hidden="true" />
          <div className="camera-reticle" aria-hidden="true"><i /><b /></div>
          <div className="aerial-clouds" aria-hidden="true"><i /><i /><i /><i /></div>
          <div className="switch-flash" aria-hidden="true" />

          <div className="survey-status"><span>{active.id === "v" ? "STATE OF SAN ANDREAS" : active.region.toUpperCase()}</span><strong>{cameraLabel}</strong></div>
          <div className="world-readout"><span>{active.year} / WORLD {maps.indexOf(active) + 1}</span><strong>{active.name}</strong><p>{active.region}</p></div>
          <div className="world-stats">
            <div><span>FOOTPRINT</span><strong>{active.area ? `${active.alternate ? `${active.alternate}–` : ""}${active.area}` : "—"}</strong><small>KM² EST.</small></div>
            <div><span>CHARACTER</span><strong>{active.character}</strong><small>{active.confidence}</small></div>
          </div>

          {mode === "scale" && <div className="scale-callout"><span>ESTIMATED SCALE / GTA V BASELINE</span><strong>{ratio ? `${active.name} is estimated to fit ${ratio.toFixed(1)}× inside GTA V` : active.id === "v" ? "Choose another world to compare" : "Official area remains undisclosed"}</strong></div>}
          {mode === "drive" && <div className="drive-readout"><i /><span>COAST-TO-COUNTY ROUTE</span><strong>{distance ? `${distance} KM / RUNNING` : "ROUTE UNKNOWN"}</strong></div>}
        </div>

        <div className="world-switch-controls">
          <div className="view-modes" aria-label="Map view">
            {(["world", "scale", "drive"] as ViewMode[]).map((entry) => <button key={entry} type="button" aria-pressed={mode === entry} onClick={() => changeMode(entry)}><i />{entry}</button>)}
          </div>
          <div className="world-wheel" role="group" aria-label="World switch">
            <span>WORLD<br />SWITCH</span>
            {maps.map((map, index) => <button key={map.id} type="button" aria-pressed={active.id === map.id} onClick={() => selectWorld(map.id)} style={{ "--world-color": map.color } as CSSProperties}>
              <i>{map.shortName}</i><small>{map.year}</small><b>{(index + 1).toString().padStart(2, "0")}</b>
            </button>)}
          </div>
          <p>Choose a world · camera relocates</p>
        </div>
      </div>
    </section>
  );
}
