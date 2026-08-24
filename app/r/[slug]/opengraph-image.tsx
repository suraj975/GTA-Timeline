import { ImageResponse } from "next/og";
import { games } from "@/content/games";

export const alt = "A Grand Theft History release";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return games.map((game) => ({ slug: game.id }));
}

export default async function ReleaseOpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = games.find((entry) => entry.id === slug) ?? games[0];
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "62px 68px", color: "#f8f5ec", background: `linear-gradient(135deg,#050706 0%,#101918 55%,${game.accent} 160%)` }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 4, color: game.accent }}>
        <span>GRAND THEFT HISTORY</span><span>{game.index} / 18</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: 32, color: game.accent, letterSpacing: 6 }}>{game.year} · {game.city}</span>
        <span style={{ maxWidth: 980, marginTop: 18, fontSize: 112, fontWeight: 900, lineHeight: .82, letterSpacing: -5, textTransform: "uppercase" }}>{game.displayTitle}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 23 }}>
        <span>{game.change.toUpperCase()}</span><span style={{ color: "#8e9994" }}>FROM ABOVE TO LEONIDA</span>
      </div>
    </div>,
    size,
  );
}
