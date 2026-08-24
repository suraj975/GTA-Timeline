import type { Metadata } from "next";
import type { ReactNode } from "react";
import { games } from "@/content/games";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gta-timeline.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "From Above to Leonida — Grand Theft History", template: "%s — Grand Theft History" },
  description:
    "An interactive timeline covering 18 Grand Theft Auto releases—from the top-down streets of 1997 to Leonida in 2026.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Grand Theft History",
    title: "From Above to Leonida — Grand Theft History",
    description: "Drive through 29 years of Grand Theft Auto history, from the overhead cities of 1997 to Leonida.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Grand Theft History — From Above to Leonida" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "From Above to Leonida — Grand Theft History",
    description: "Drive through 29 years of Grand Theft Auto history.",
    images: ["/opengraph-image"],
  },
};

const seriesJsonLd = {
  "@context": "https://schema.org",
  "@type": "VideoGameSeries",
  name: "Grand Theft Auto",
  url: siteUrl,
  description: metadata.description,
  hasPart: games.map((game) => ({
    "@type": "VideoGame",
    name: game.title,
    datePublished: game.year.slice(0, 4),
    gamePlatform: game.platform.split(" · "),
    url: `${siteUrl}/r/${game.id}`,
  })),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(seriesJsonLd).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
