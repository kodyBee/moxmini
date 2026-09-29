import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Close match for the serif wordmark in the Mox Mini's logo
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#16121d",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Mox Mini's | Hand-Painted Miniatures",
    template: "%s | Mox Mini's",
  },
  description:
    "Hand-painted tabletop miniatures for D&D and wargaming. Shop one-of-a-kind prepainted figures, or pick any Reaper miniature and have Mox paint it in your colors.",
  keywords: [
    "miniatures",
    "tabletop gaming",
    "figurines",
    "miniature painting",
    "wargaming",
    "rpg miniatures",
    "D&D miniatures",
    "custom painted miniatures",
  ],
  authors: [{ name: "Mox Mini's" }],
  creator: "Mox Mini's",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Mox Mini's",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-primary px-4 py-2 font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
