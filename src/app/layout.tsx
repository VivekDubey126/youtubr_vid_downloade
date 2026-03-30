import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Youtubr | Premium Downloader",
  description: "Download YouTube videos and audio in high quality instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-black text-white">
        {children}
      </body>
    </html>
  );
}
