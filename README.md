# Grand Theft History

**From Above to Leonida** is an independent interactive timeline following 18 Grand Theft Auto releases across four visual eras—from the overhead streets of 1997 to Leonida in 2026.

## The experience

- A cinematic original panorama introduces the full 1997—2026 journey.
- Every main game, expansion, portable story, GTA Online, and the Definitive Trilogy has a timeline entry.
- Major releases are full-screen cinematic environments; smaller releases appear as overlapping physical case-file artifacts instead of repeated cards.
- Each era has its own art direction: pixel-map 2D, neon/cinematic 3D, editorial HD, and tropical Leonida.
- A scroll-driven Three.js sequence transforms the camera from overhead to street level.
- Era memory displays recreate the mood of a late-1990s CRT map and an early-2000s 3D night drive.
- A privacy-enhanced trailer theatre lazily opens five verified Rockstar Games YouTube releases.
- “The Biggest Score” turns sourced commercial milestones into an interactive bank-vault record without presenting estimates as fact.
- “Copies on the Street” grows an original night city from six million copies to the latest reported franchise milestone.
- An optional GTA-inspired side mission links to a single Buy Me a Coffee page; no cryptocurrency or wallet solicitation is included.
- GSAP reveals, parallax atmosphere, hover depth, HUD motion, and a global route indicator respond to scrolling.
- The responsive layout includes reduced-motion behavior and semantic HTML content outside the canvas.

No copied game art, music, trailers, or game assets are included. The site is an independent historical commentary project and is not affiliated with Rockstar Games or Take-Two Interactive.

## Project research

- [Buy Me a Coffee viability and analytics plan](docs/buy-me-a-coffee-analysis.md)

## Development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

To activate the support mission destination, copy `.env.example` to `.env.local` and replace the sample URL with your public Buy Me a Coffee page. Without it, the briefing remains visible but clearly says that its destination has not been configured.

## Verification

```bash
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

## Deploy

Import the GitHub repository into Vercel. The framework and build settings are detected automatically. Add `NEXT_PUBLIC_SUPPORT_URL` only when the real Buy Me a Coffee profile is ready.
