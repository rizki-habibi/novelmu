import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Perjalanan yang Belum Selesai — Rizki Habibi",
  description: "Novel digital tentang perjalanan hidup, mimpi, teknologi, kehilangan, dan cinta.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}