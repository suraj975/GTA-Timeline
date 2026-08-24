type MemoryKind = "gta-3" | "vice-city" | "san-andreas";

const memoryCopy: Record<MemoryKind, { number: string; label: string; title: string; prompt: string }> = {
  "gta-3": { number: "01", label: "Liberty City memory", title: "The bridge opens. The rain begins.", prompt: "Keep scrolling to drop behind the wheel" },
  "vice-city": { number: "02", label: "Vice City memory", title: "Turn the dial. Own the night.", prompt: "Scroll tunes sunset into neon" },
  "san-andreas": { number: "03", label: "San Andreas memory", title: "One city becomes a state.", prompt: "Keep driving beyond Los Santos" },
};

export function MemoryMoment({ kind }: { kind: MemoryKind }) {
  const copy = memoryCopy[kind];
  return (
    <section className={`memory-moment memory-moment--${kind}`} data-memory={kind} aria-labelledby={`${kind}-memory-title`}>
      <div className="memory-sticky">
        <div className="memory-scene" aria-hidden="true">
          {kind === "gta-3" && <LibertyMemory />}
          {kind === "vice-city" && <ViceMemory />}
          {kind === "san-andreas" && <SanAndreasMemory />}
        </div>
        <header className="memory-caption">
          <span>{copy.number} / Memory stop</span>
          <p>{copy.label}</p>
          <h3 id={`${kind}-memory-title`}>{copy.title}</h3>
          <small>{copy.prompt}</small>
        </header>
        <div className="memory-progress" aria-hidden="true"><span /></div>
      </div>
    </section>
  );
}

function LibertyMemory() {
  return (
    <>
      <div className="liberty-depth liberty-depth--back" />
      <div className="liberty-depth liberty-depth--front" />
      <div className="liberty-bridge"><i /><i /></div>
      <div className="memory-road memory-road--liberty"><span /></div>
      <div className="memory-car memory-car--liberty"><i /><b /></div>
      <div className="memory-rain" />
      <div className="memory-wanted"><span>★</span><span>★</span><span>★</span><i>WANTED</i></div>
    </>
  );
}

function ViceMemory() {
  return (
    <>
      <div className="vice-sun" />
      <div className="vice-night" />
      <div className="vice-skyline" />
      <div className="vice-radio">
        <span>FLASH FM</span>
        <div className="vice-frequency"><i /></div>
        <div className="vice-dial"><b /></div>
        <small>88&nbsp;&nbsp;92&nbsp;&nbsp;96&nbsp;&nbsp;100&nbsp;&nbsp;104&nbsp;&nbsp;108</small>
      </div>
      <div className="vice-neon">VICE</div>
    </>
  );
}

function SanAndreasMemory() {
  return (
    <>
      <div className="state-map">
        <div className="map-sheet map-sheet--one" />
        <div className="map-sheet map-sheet--two" />
        <div className="map-sheet map-sheet--three" />
        <svg viewBox="0 0 700 420" role="presentation">
          <path d="M118 322 C190 259 190 190 285 181 S405 258 459 184 S548 83 613 103" />
          <circle cx="118" cy="322" r="8" /><circle cx="342" cy="210" r="8" /><circle cx="613" cy="103" r="8" />
        </svg>
        <span className="state-city state-city--ls">Los Santos</span>
        <span className="state-city state-city--sf">San Fierro</span>
        <span className="state-city state-city--lv">Las Venturas</span>
        <div className="state-car" />
      </div>
      <div className="state-stamp">STATE<br />UNLOCKED</div>
    </>
  );
}
