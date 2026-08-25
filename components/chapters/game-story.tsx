import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import type { GameEntry } from "@/content/games";

const storyImages: Partial<Record<GameEntry["id"], { src: string; alt: string }>> = {
  "gta-3": { src: "/liberty-city-original.jpg", alt: "Original illustration of a rain-soaked Liberty City-inspired street and raised bridge" },
  "vice-city": { src: "/vice-city-original.jpg", alt: "Original illustration of a neon tropical boulevard at sunset" },
  "san-andreas": { src: "/san-andreas-original.jpg", alt: "Original illustration of a golden-hour West Coast city expanding toward mountains" },
};

export function GameStory({ game, children }: { game: GameEntry; children?: ReactNode }) {
  const storyImage = storyImages[game.id];
  return (
    <article
      className={`game-story game-story--${game.era}`}
      data-game={game.id}
      data-story
      id={game.id}
      style={{ "--story-accent": game.accent } as CSSProperties}
    >
      <div className="story-world">
        {storyImage && <Image className="story-world-image" src={storyImage.src} alt={storyImage.alt} fill sizes="100vw" quality={82} />}
        <span className="story-year" aria-hidden="true">{game.year.replace("—", "")}</span>
        <span className="story-road" aria-hidden="true" />
        <span className="story-car" aria-hidden="true" />
        <span className="story-weather" aria-hidden="true" />
      </div>
      <div className="story-topline">
        <span>{game.index} / 18</span>
        <span>{game.city}</span>
        <time>{game.year}</time>
      </div>
      <div className="story-copy">
        <p className="story-kicker">{game.change}</p>
        <h3>{game.displayTitle}</h3>
        <p className="story-summary">{game.summary}</p>
        <div className="story-platform">Originally on <strong>{game.platform}</strong></div>
        {children}
      </div>
      <div className="story-scroll" aria-hidden="true"><span />Keep driving</div>
    </article>
  );
}

export function SideMissions({ games, label }: { games: GameEntry[]; label: string }) {
  return (
    <section className="side-missions" aria-label={label}>
      <header><span>Side missions / essential detours</span><h3>{label}</h3></header>
      <div className="artifact-desk">
        {games.map((game, position) => (
          <article
            className="release-artifact"
            data-game={game.id}
            id={game.id}
            key={game.id}
            style={{ "--artifact-accent": game.accent, "--artifact-rotate": `${position % 2 ? 2.5 : -2.5}deg` } as CSSProperties}
          >
            <span className="artifact-index">CASE {game.index}</span>
            <time>{game.year}</time>
            <h4>{game.displayTitle}</h4>
            <p>{game.summary}</p>
            <footer><span>{game.city}</span><span>{game.platform}</span></footer>
          </article>
        ))}
      </div>
    </section>
  );
}
