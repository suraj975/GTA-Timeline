import type { CSSProperties } from "react";
import type { GameEntry } from "@/content/games";

export function GameCard({ game }: { game: GameEntry }) {
  return (
    <article
      className={`game-card game-card--${game.era}${game.featured ? " game-card--featured" : ""}`}
      id={game.id}
      data-game={game.id}
      style={{ "--card-accent": game.accent } as CSSProperties}
      data-reveal
    >
      <div className="game-art" aria-hidden="true">
        <span className="art-sun" />
        <span className="art-skyline art-skyline--back" />
        <span className="art-skyline art-skyline--front" />
        <span className="art-road" />
        <span className="art-number">{game.index}</span>
      </div>
      <div className="game-copy">
        <div className="game-meta"><span>{game.index} / 18</span><time>{game.year}</time></div>
        <p className="game-change">{game.change}</p>
        <h3>{game.displayTitle}</h3>
        <p className="game-summary">{game.summary}</p>
        <dl className="game-details">
          <div><dt>World</dt><dd>{game.city}</dd></div>
          <div><dt>Released on</dt><dd>{game.platform}</dd></div>
        </dl>
      </div>
    </article>
  );
}
