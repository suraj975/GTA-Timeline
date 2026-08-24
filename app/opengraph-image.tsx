import { ImageResponse } from "next/og";

export const alt = "Grand Theft History — From Above to Leonida";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 70px", color: "#f5f2e9", background: "radial-gradient(circle at 80% 20%,#23494b 0,#070b0b 42%,#030504 100%)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 4, color: "#dfff36" }}>
        <span>1997 — 2026</span><span>INTERACTIVE DIGITAL ARCHIVE</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: 98, fontWeight: 900, lineHeight: .82, letterSpacing: -5 }}>GRAND THEFT</span>
        <span style={{ fontSize: 150, fontWeight: 900, lineHeight: .82, letterSpacing: -7, color: "#dfff36" }}>HISTORY</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 24 }}>
        <span>FROM ABOVE TO LEONIDA</span><span style={{ color: "#94a09a" }}>18 RELEASES · 4 ERAS · ONE ROAD</span>
      </div>
    </div>,
    size,
  );
}
