import type { CSSProperties } from "react";
import type { GameChapter } from "@/content/games";

type EraRailProps = {
  chapters: GameChapter[];
  activeId: string;
};

export function EraRail({ chapters, activeId }: EraRailProps) {
  return (
    <nav className="era-rail" aria-label="Prototype chapters">
      {chapters.map((chapter) => (
        <a
          className="era-link"
          data-active={activeId === chapter.id}
          href={`#${chapter.id}`}
          key={chapter.id}
          style={{ "--era-accent": chapter.accent } as CSSProperties}
          aria-current={activeId === chapter.id ? "location" : undefined}
        >
          <span>{chapter.year}</span>
          {chapter.navLabel}
        </a>
      ))}
    </nav>
  );
}
