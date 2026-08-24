import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HistoryExperience } from "@/components/shell/history-experience";
import { games } from "@/content/games";

type ReleasePageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return games.map((game) => ({ slug: game.id }));
}

export async function generateMetadata({ params }: ReleasePageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = games.find((entry) => entry.id === slug);
  if (!game) return {};
  const title = `${game.title} (${game.year})`;
  return {
    title,
    description: game.summary,
    alternates: { canonical: `/r/${game.id}` },
    openGraph: {
      type: "article",
      url: `/r/${game.id}`,
      title: `${title} — Grand Theft History`,
      description: game.summary,
      images: [{ url: `/r/${game.id}/opengraph-image`, width: 1200, height: 630, alt: `${game.title} in Grand Theft History` }],
    },
    twitter: { card: "summary_large_image", title, description: game.summary, images: [`/r/${game.id}/opengraph-image`] },
  };
}

export default async function ReleasePage({ params }: ReleasePageProps) {
  const { slug } = await params;
  const game = games.find((entry) => entry.id === slug);
  if (!game) notFound();
  return <HistoryExperience initialTarget={game.id} />;
}
