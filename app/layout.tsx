import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/contexts/CartContext";
import { AuthProvider } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "Mox Mini's | Miniature Figurines",
    template: "%s | Mox Mini's",
  },
  description: "Your premier destination for tabletop gaming miniatures. Browse, search, and discover thousands of high-quality miniatures for your gaming collection.",
  keywords: ["miniatures", "tabletop gaming", "figurines", "miniature painting", "wargaming", "rpg miniatures"],
  authors: [{ name: "Mox Mini's" }],
  creator: "Mox Mini's",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Mox Mini's",
    title: "Mox Mini's | Miniature Figurines",
    description: "Your premier destination for tabletop gaming miniatures.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
