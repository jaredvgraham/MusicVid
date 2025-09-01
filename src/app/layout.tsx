import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteMeta } from "@/lib/seo";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import PixelTracker from "@/components/PixelTracker";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = siteMeta();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      appearance={{
        baseTheme: dark,
        variables: {
          colorBackground: "#0a0a0a",
          colorText: "#ffffff",
          colorInputBackground: "#111111",
          colorInputText: "#ffffff",
          colorPrimary: "#ffffff",
          colorShimmer: "#222222",
          colorTextSecondary: "#a3a3a3",
        },
        elements: {
          card: "bg-neutral-950/80 backdrop-blur border border-white/10",
          headerTitle: "text-white",
          headerSubtitle: "text-white/60",
          socialButtonsIconButton: "bg-white/10 hover:bg-white/15",
          formFieldInput:
            "bg-white/5 border-white/10 text-white placeholder:text-white/40",
          formButtonPrimary: "bg-white text-neutral-900 hover:bg-white/90",
          footerActionText: "text-white/70",
          footerActionLink: "text-white hover:text-white",
        },
      }}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-950`}
        >
          <GoogleAnalytics />
          <PixelTracker
            facebookPixelId={process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || ""}
            tiktokPixelId={process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || ""}
          />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
