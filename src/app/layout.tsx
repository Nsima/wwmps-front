import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Load fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Site metadata
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "What Would My Pastor Say?",
  description: "AI-powered guidance from curated sermons.",
  keywords: ["Pastor AI", "Sermons", "Christian AI", "Spiritual guidance"],
  authors: [{ name: "Nsima" }],
  icons: {
    icon: "/favicon.ico",       // put favicon.ico in /public
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png", // optional if you add one
  },
  openGraph: {
    title: "What Would My Pastor Say?",
    description: "AI chatbot trained on sermons for spiritual guidance.",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    siteName: "WWMPS",
    images: [
      {
        url: "/preview.png",    // add preview.png in /public
        width: 1200,
        height: 630,
        alt: "WWMPS Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "What Would My Pastor Say?",
    description: "Ask your pastors for AI-guided answers.",
    images: ["/preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
