import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Public_Sans,
  Figtree,
  Source_Serif_4,
} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import { ViewTransitions } from "next-view-transitions";

const figtreeHeading = Figtree({
  subsets: ["latin"],
  variable: "--font-heading",
});

const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-sans" });

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Papadwala | Traditional Handcrafted Papads",
    template: "%s | Papadwala",
  },
  description:
    "Authentic, chemical-free, handcrafted Indian papads made with traditional recipes and love. Experience the crunch of tradition with Aaloo, Besan, and Lehsun flavors.",
  keywords: [
    "papad",
    "indian snacks",
    "handcrafted papad",
    "chemical free food",
    "traditional recipes",
    "aaloo papad",
    "besan papad",
  ],
  authors: [{ name: "Papadwala Team" }],
  creator: "Papadwala",
  metadataBase: new URL("https://papadwala.com"), // Replace with actual domain
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://papadwala.com",
    title: "Papadwala | Traditional Handcrafted Papads",
    description:
      "Authentic, chemical-free, handcrafted Indian papads made with traditional recipes and love.",
    siteName: "Papadwala",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Papadwala - The Crunch of Tradition",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Papadwala | Traditional Handcrafted Papads",
    description:
      "Authentic, chemical-free, handcrafted Indian papads made with traditional recipes and love.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        sourceSerif.variable,
        publicSans.variable,
        figtreeHeading.variable,
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          <ViewTransitions>{children}</ViewTransitions>
        </Providers>
      </body>
    </html>
  );
}
