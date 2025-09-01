import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import SEONavBar from "@/components/SEONavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sonexa - AI-Powered Lyric Video Maker",
  description:
    "Create stunning lyric videos with AI-powered timing. Professional templates, studio-quality exports, and perfect synchronization.",
  keywords:
    "lyric video, music video, AI video, video maker, lyrics, music, video editing",
  authors: [{ name: "Sonexa Team" }],
  creator: "Sonexa",
  publisher: "Sonexa",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sonexa.cc",
    siteName: "Sonexa",
    title: "Sonexa - AI-Powered Lyric Video Maker",
    description:
      "Create stunning lyric videos with AI-powered timing. Professional templates, studio-quality exports, and perfect synchronization.",
    images: [
      {
        url: "https://sonexa.cc/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sonexa - AI-Powered Lyric Video Maker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sonexa - AI-Powered Lyric Video Maker",
    description:
      "Create stunning lyric videos with AI-powered timing. Professional templates, studio-quality exports, and perfect synchronization.",
    images: ["https://sonexa.cc/og-image.png"],
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function SEOLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SEONavBar />
      <main>{children}</main>
    </>
  );
}
