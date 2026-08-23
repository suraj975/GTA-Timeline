import type { CSSProperties } from "react";
import type { EraChapter } from "@/content/games";

type EraRailProps = {
  chapters: EraChapter[];
  activeId: string;
};

export function EraRail({ chapters, activeId }: EraRailProps) {
  return (
    <nav className="era-rail" aria-label="Timeline eras">
      {chapters.map((chapter) => (
        <a
          className="era-link"
          data-active={activeId === chapter.id}
          href={`#${chapter.id}`}
          key={chapter.id}
          style={{ "--era-accent": chapter.accent } as CSSProperties}
          aria-current={activeId === chapter.id ? "location" : undefined}
        >
          <span className="era-year">{chapter.year}</span>
          <span className="era-name">{chapter.navLabel}</span>
        </a>
      ))}
    </nav>
  );
}
