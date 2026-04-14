import type { Metadata, Viewport } from "next";
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
    default: "Papadwala | Best Traditional Papad Store in Ranchi",
    template: "%s | Papadwala Ranchi",
  },
  description:
    "Ranchi's finest authentic, chemical-free handcrafted Indian papads. Made with traditional legacy recipes. Buy the best Aaloo, Besan, and Lehsun papads in Jharkhand.",
  keywords: [
    "best papad store in ranchi",
    "buy papad local ranchi",
    "handcrafted papad jharkhand",
    "traditional papadwala ranchi",
    "chemical free food ranchi",
    "authentic indian snacks ranchi",
    "aaloo papad buy near me",
    "besan papad ranchi delivery",
  ],
  authors: [{ name: "Papadwala Artisans" }],
  creator: "Papadwala Ranchi",
  metadataBase: new URL("https://papadwala.com"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://papadwala.com",
    title: "Papadwala | Best Traditional Papad Store in Ranchi",
    description:
      "Ranchi's finest authentic, chemical-free handcrafted Indian papads. Taste the authentic legacy of Jharkhand.",
    siteName: "Papadwala Ranchi",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Papadwala Ranchi - The Crunch of Tradition",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Papadwala | Best Traditional Papad Store in Ranchi",
    description:
      "Ranchi's finest authentic, chemical-free handcrafted Indian papads made with traditional recipes and love.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://papadwala.com",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f97316",
};


const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  name: "Papadwala Ranchi",
  image: "https://papadwala.com/og-image.jpg",
  "@id": "https://papadwala.com",
  url: "https://papadwala.com",
  telephone: "+918001234567",
  address: {
    "@type": "PostalAddress",
    streetAddress: "123 Heritage Lane, Traditional Market District",
    addressLocality: "Ranchi",
    addressRegion: "Jharkhand",
    postalCode: "834001",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 23.3441,
    longitude: 85.3096,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    opens: "09:00",
    closes: "18:00",
  },
  sameAs: [
    "https://facebook.com/papadwalaranchi",
    "https://instagram.com/papadwalaranchi",
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
        <Providers>
          <ViewTransitions>{children}</ViewTransitions>
        </Providers>
      </body>
    </html>
  );
}
