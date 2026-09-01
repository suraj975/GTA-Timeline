import { GameStory, SideMissions } from "@/components/chapters/game-story";
import { MemoryMoment } from "@/components/chapters/memory-moment";
import { TrailerTheatre } from "@/components/media/trailer-theatre";
import { MapComparator } from "@/components/chapters/map-comparator";
import { CommercialImpact } from "@/components/chapters/commercial-impact";
import { CopiesOnStreet } from "@/components/chapters/copies-on-street";
import { SupportArchive } from "@/components/support/support-archive";
import { gamesByEra } from "@/content/games";

const threeDGames = gamesByEra("3d");
const hdGames = gamesByEra("hd");
const futureGame = gamesByEra("future")[0];
const pick = (list: typeof threeDGames, id: string) => list.find((game) => game.id === id)!;
const threeDPortable = threeDGames.filter((game) => ["gta-advance", "liberty-city-stories", "vice-city-stories"].includes(game.id));
const libertyEpisodes = hdGames.filter((game) => ["lost-and-damned", "chinatown-wars", "ballad-of-gay-tony"].includes(game.id));
const definitive = hdGames.filter((game) => game.id === "trilogy-definitive");
const onlineMilestones = [
  { year: "2013", title: "The city opens", detail: "Los Santos becomes a shared world." },
  { year: "2015", title: "Heists", detail: "Four-player scores reshape the endgame." },
  { year: "2016", title: "CEO era", detail: "Organizations, warehouses and businesses arrive." },
  { year: "2017", title: "Gunrunning", detail: "Bunkers and a new underground economy." },
  { year: "2019", title: "The Diamond", detail: "A casino becomes the city's brightest landmark." },
  { year: "2020", title: "Cayo Perico", detail: "The first major island expands the map." },
  { year: "2022", title: "New generation", detail: "The city crosses into its third console era." },
  { year: "2023", title: "Ten years", detail: "A decade of players, crews and reinvention." },
  { year: "2025", title: "PC evolves", detail: "The enhanced edition brings the latest systems forward." },
  { year: "2026", title: "The road ahead", detail: "Los Santos finally points toward Leonida." },
];

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
        <div className="story-route">
          <GameStory game={pick(threeDGames, "gta-3")} />
          <MemoryMoment kind="gta-3" />
          <GameStory game={pick(threeDGames, "vice-city")} />
          <MemoryMoment kind="vice-city" />
          <GameStory game={pick(threeDGames, "san-andreas")} />
          <MemoryMoment kind="san-andreas" />
          <SideMissions games={threeDPortable} label="The portable cities" />
        </div>
      </section>

      <section className="era-section hd-era" id="hd" data-era="hd">
        <header className="era-heading era-heading--editorial">
          <div><span className="era-count">ERA 03 / 04</span><p className="eyebrow">Physics · performance · persistence</p></div>
          <h2>High<br /><em>definition</em></h2>
          <p>The cities become denser, their stories overlap, and one Los Santos grows into a living service spanning generations.</p>
        </header>
        <div className="story-route">
          <GameStory game={pick(hdGames, "gta-4")} />
          <SideMissions games={libertyEpisodes} label="One city, three more stories" />
          <GameStory game={pick(hdGames, "gta-5")} />
          <GameStory game={pick(hdGames, "gta-online")} />
          <SideMissions games={definitive} label="The past returns" />
        </div>
      </section>

      <MapComparator />

      <CommercialImpact />

      <CopiesOnStreet />

      <TrailerTheatre />

      <section className="wait-section" aria-labelledby="wait-title">
        <p className="eyebrow">The longest road</p>
        <h2 id="wait-title">Thirteen years<br />in Los Santos</h2>
        <p className="wait-intro">One city survived three console generations. Drive across the years to see what kept changing.</p>
        <div className="wait-years" aria-label="Major GTA Online milestones between GTA V and GTA VI">
          {onlineMilestones.map((milestone, index) => (
            <article className={index === 0 || index === onlineMilestones.length - 1 ? "wait-year wait-year--edge" : "wait-year"} key={milestone.year}>
              <time>{milestone.year}</time><strong>{milestone.title}</strong><p>{milestone.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="future-era" id="future" data-era="future" data-game="gta-6">
        <span className="release-anchor" id="gta-6" aria-hidden="true" />
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
        <div className="finale-actions"><a href="#intro">Drive it again <span aria-hidden="true">↑</span></a></div>
        <SupportArchive />
      </section>
    </>
  );
}
