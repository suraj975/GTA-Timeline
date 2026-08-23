import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "From Above to Leonida — Grand Theft History",
  description:
    "An interactive timeline covering 18 Grand Theft Auto releases—from the top-down streets of 1997 to Leonida in 2026.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
