"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { salesDistricts } from "@/content/commercial-impact";

const buildingHeights = [
  29, 43, 35, 57, 25, 69, 39, 51, 32, 78, 46, 62, 34, 88, 55, 72, 41,
  64, 31, 82, 48, 70, 37, 92, 53, 75, 44, 84, 58, 67, 35, 80, 49, 96,
];

type CityStyle = CSSProperties & {
  "--city-accent": string;
  "--city-scale": string;
  "--city-density": string;
};

export function CopiesOnStreet() {
  const [activeIndex, setActiveIndex] = useState(salesDistricts.length - 1);
  const route = useRef<HTMLDivElement>(null);
  const active = salesDistricts[activeIndex];
  const style: CityStyle = {
    "--city-accent": active.accent,
    "--city-scale": String(.76 + activeIndex * .055),
    "--city-density": String((activeIndex + 1) / salesDistricts.length),
  };

  useEffect(() => {
    const track = route.current;
    const selected = track?.querySelector<HTMLElement>("[aria-selected='true']");
    if (!track || !selected || track.scrollWidth <= track.clientWidth) return;
    track.scrollTo({ left: selected.offsetLeft - track.clientWidth / 2 + selected.clientWidth / 2, behavior: "smooth" });
  }, [activeIndex]);

  return (
    <section className="sales-section" id="copies-on-the-street" data-location="copies-on-the-street" aria-labelledby="sales-title" style={style}>
      <header className="sales-heading">
        <div><span className="era-count">AUDIENCE / REPORTED UNITS</span><p className="eyebrow">Every copy leaves a light on</p></div>
        <h2 id="sales-title">Copies on<br /><em>the street.</em></h2>
        <p>Follow the disclosed milestones. The road grows, the city wakes up and a console hit becomes a global skyline.</p>
      </header>

      <div className="sales-city-shell" id="sales-city-model" data-franchise={active.id === "district-franchise"}>
        <div className="city-hud city-hud--top"><span>LIVE CITY MODEL</span><b>{active.year} / {active.game}</b><small>Representation, not geographic scale</small></div>
        <div className="sales-city" aria-hidden="true">
          <div className="city-stars" />
          <div className="city-moon"><i /></div>
          <div className="city-haze city-haze--one" />
          <div className="city-haze city-haze--two" />
          <div className="city-mountains" />
          <div className="city-skyline city-skyline--far" />
          <div className="city-skyline city-skyline--near" />
          <div className="city-ground-grid" />
          <div className="city-road">
            <div className="road-lane road-lane--left" />
            <div className="road-lane road-lane--right" />
            <div className="traffic-stream traffic-stream--out" />
            <div className="traffic-stream traffic-stream--in" />
            <div className="road-cars">
              {Array.from({ length: 6 }, (_, index) => <i key={index} />)}
            </div>
          </div>
          <div className="city-buildings">
            {buildingHeights.map((height, index) => (
              <span
                className="street-building"
                data-visible={index < active.buildingCount}
                data-side={index % 2 === 0 ? "left" : "right"}
                key={`${height}-${index}`}
                style={{
                  "--building-height": `${Math.round(height * .84)}%`,
                  "--building-row": Math.floor(index / 2),
                  "--building-order": index,
                  "--building-width": `${2.4 + (index % 5) * .42}rem`,
                  "--building-scale": String(1 - Math.floor(index / 2) * .025),
                } as CSSProperties}
              ><i /><b /><em /></span>
            ))}
          </div>
          <div className="city-centerpiece">
            <b>PUBLIC RECORD / {active.year}</b>
            <span>{active.metric}</span>
            <small>{active.unitLabel}</small>
            <i>Every copy leaves a light on</i>
          </div>
        </div>

        <article className="city-record" id="sales-city-record" aria-live="polite">
          <span>DISTRICT {String(activeIndex + 1).padStart(2, "0")} / {String(salesDistricts.length).padStart(2, "0")}</span>
          <h3>{active.game}</h3>
          <div><strong>{active.metric}</strong><small>{active.unitLabel}</small></div>
          <p>{active.detail}</p>
          <a href={active.sourceUrl} target="_blank" rel="noreferrer">Verify the record <span aria-hidden="true">↗</span><small>{active.sourceLabel}</small></a>
        </article>
      </div>

      <div className="sales-route" ref={route} role="tablist" aria-label="Choose a reported sales milestone">
        <div className="sales-route-line" aria-hidden="true"><i style={{ width: `${(activeIndex / (salesDistricts.length - 1)) * 100}%` }} /></div>
        {salesDistricts.map((district, index) => (
          <button
            key={district.id}
            role="tab"
            aria-selected={index === activeIndex}
            style={{ "--district-accent": district.accent } as CSSProperties}
            onClick={() => setActiveIndex(index)}
          >
            <i aria-hidden="true" />
            <span>{district.year}</span>
            <strong>{district.game}</strong>
            <small>{district.metric}</small>
          </button>
        ))}
      </div>
      <p className="sales-method">Figures are snapshots from the date shown, not like-for-like lifetime totals. “Sold-in” means units delivered into retail channels.</p>
    </section>
  );
}
