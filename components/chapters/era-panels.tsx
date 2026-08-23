import { GameCard } from "@/components/chapters/game-card";
import { MemoryDisplay } from "@/components/chapters/memory-display";
import { TrailerTheatre } from "@/components/media/trailer-theatre";
import { gamesByEra } from "@/content/games";

const threeDGames = gamesByEra("3d");
const hdGames = gamesByEra("hd");
const futureGame = gamesByEra("future")[0];

export function EraPanels() {
  return (
    <>
      <section className="era-section three-d-era" id="3d" data-era="3d">
        <div className="city-silhouette" aria-hidden="true" />
        <header className="era-heading era-heading--split">
          <div><span className="era-count">ERA 02 / 04</span><p className="eyebrow">The camera hits the street</p></div>
          <h2>The<br /><em>3D</em> era</h2>
          <p>Six worlds in six years. Liberty City supplied the depth, Vice City the style, and San Andreas the scale.</p>
        </header>
        <MemoryDisplay era="3d" />
        <div className="game-grid game-grid--3d">
          {threeDGames.map((game) => <GameCard game={game} key={game.id} />)}
        </div>
      </section>

      <section className="era-section hd-era" id="hd" data-era="hd">
        <header className="era-heading era-heading--editorial">
          <div><span className="era-count">ERA 03 / 04</span><p className="eyebrow">Physics · performance · persistence</p></div>
          <h2>High<br /><em>definition</em></h2>
          <p>The cities become denser, their stories overlap, and one Los Santos grows into a living service spanning generations.</p>
        </header>
        <div className="game-grid game-grid--hd">
          {hdGames.map((game) => <GameCard game={game} key={game.id} />)}
        </div>
      </section>

      <TrailerTheatre />

      <section className="wait-section" aria-labelledby="wait-title">
        <p className="eyebrow">The longest road</p>
        <h2 id="wait-title">Twelve years<br />in Los Santos</h2>
        <div className="wait-years" aria-label="Years between GTA V and GTA VI">
          {[2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026].map((year) => (
            <span className={year === 2013 || year === 2026 ? "wait-year wait-year--edge" : "wait-year"} key={year}>{year}</span>
          ))}
        </div>
      </section>

      <section className="future-era" id="future" data-era="future">
        <div className="future-glow" aria-hidden="true" />
        <div className="future-palm future-palm--one" aria-hidden="true">✦</div>
        <div className="future-palm future-palm--two" aria-hidden="true">✦</div>
        <div className="future-copy">
          <span className="era-count">ERA 04 / 04 · NOVEMBER 19, 2026</span>
          <p className="future-pretitle">The road returns to</p>
          <h2>Leonida</h2>
          <p>{futureGame.summary}</p>
          <div className="future-stamp"><span>{futureGame.index} / 18</span><strong>{futureGame.displayTitle}</strong><small>{futureGame.city}</small></div>
        </div>
      </section>

      <section className="finale" aria-labelledby="finale-title">
        <p className="eyebrow">The complete route · 1997—2026</p>
        <h2 id="finale-title">From above<br /><span>to Leonida.</span></h2>
        <a href="#intro">Drive it again <span aria-hidden="true">↑</span></a>
      </section>
    </>
  );
}
