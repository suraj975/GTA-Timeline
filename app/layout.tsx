import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "From Above to Leonida — Grand Theft History",
  description:
    "An original interactive prototype tracing the evolution of open-world crime games from top-down streets to cinematic cities.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
