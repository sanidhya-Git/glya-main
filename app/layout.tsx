import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://glya.in"),
  title: {
    default: "GLYA | Sree Sai Jewellers — Fine Gold & Diamond Jewellery",
    template: "%s | GLYA — Sree Sai Jewellers",
  },
  description:
    "Sree Sai Jewellers (also known as Sai Jewells) — certified 22K gold, diamond & precious stone jewellery from Pune. BIS Hallmarked, IGI/GIA certified, live bullion pricing. Shop online or visit our Koregaon Park atelier.",
  keywords: [
    "Sree Sai Jewellers",
    "Sai Jewellers",
    "Sai Jewells",
    "Sai Jewellery",
    "GLYA",
    "Glya Fine Jewellery",
    "gold jewellery Pune",
    "diamond jewellery Pune",
    "fine jewellery India",
    "22K gold jewellery",
    "18K gold jewellery",
    "BIS hallmarked jewellery",
    "IGI certified diamonds",
    "GIA certified diamonds",
    "Koregaon Park jewellers",
    "Pune jewellery store",
    "buy gold jewellery online India",
    "certified diamond jewellery",
    "jewellery online India",
    "gold bangles Pune",
    "diamond rings Pune",
  ],
  authors: [{ name: "GLYA — Sree Sai Jewellers", url: "https://glya.in" }],
  creator: "GLYA — Sree Sai Jewellers",
  publisher: "GLYA — Sree Sai Jewellers",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://glya.in",
    siteName: "GLYA — Sree Sai Jewellers",
    title: "GLYA | Sree Sai Jewellers — Fine Gold & Diamond Jewellery",
    description:
      "Certified 22K gold, diamond & precious stone jewellery from Sree Sai Jewellers, Pune. Live bullion pricing, BIS Hallmarked, IGI/GIA certified.",
  },
  twitter: {
    card: "summary_large_image",
    title: "GLYA | Sree Sai Jewellers — Fine Gold & Diamond Jewellery",
    description:
      "Certified 22K gold & diamond jewellery from Sree Sai Jewellers, Pune. BIS Hallmarked, IGI/GIA certified.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://glya.in",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "JewelryStore",
      "@id": "https://glya.in/#business",
      name: "GLYA — Sree Sai Jewellers",
      alternateName: ["Sree Sai Jewellers", "Sai Jewells", "Sai Jewellers", "GLYA Fine Jewellery"],
      url: "https://glya.in",
      telephone: "+91-98765-43210",
      email: "hello@glya.in",
      description:
        "Sree Sai Jewellers — certified 22K gold, diamond & precious stone fine jewellery from Pune. BIS Hallmarked, IGI/GIA certified, live bullion pricing.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Koregaon Park",
        addressLocality: "Pune",
        addressRegion: "Maharashtra",
        postalCode: "411001",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 18.5362,
        longitude: 73.8957,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "10:00",
          closes: "19:00",
        },
      ],
      priceRange: "₹₹₹",
      currenciesAccepted: "INR",
      paymentAccepted: "Cash, Credit Card, Debit Card, UPI, Net Banking",
      hasMap: "https://maps.google.com/?q=Koregaon+Park+Pune",
      sameAs: ["https://glya.in"],
    },
    {
      "@type": "WebSite",
      "@id": "https://glya.in/#website",
      url: "https://glya.in",
      name: "GLYA — Sree Sai Jewellers",
      description: "Fine gold & diamond jewellery — Sree Sai Jewellers, Pune",
      publisher: { "@id": "https://glya.in/#business" },
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: "https://glya.in/browse?q={search_term_string}" },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

// Warm up the connection to the admin API — every page fetches catalog data from it on mount.
const ADMIN_ORIGIN = (() => {
  const base = process.env.NEXT_PUBLIC_GLYA_API_BASE ?? process.env.NEXT_PUBLIC_ADMIN_API;
  try { return base ? new URL(base).origin : null; } catch { return null; }
})();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body style={{ fontFamily: "var(--font-jost), system-ui, sans-serif", background: "var(--paper)", color: "var(--ink)" }}>
        {ADMIN_ORIGIN && <link rel="preconnect" href={ADMIN_ORIGIN} crossOrigin="anonymous" />}
        <link rel="dns-prefetch" href="//checkout.razorpay.com" />
        <link rel="dns-prefetch" href="//api.razorpay.com" />
        {children}
      </body>
    </html>
  );
}
