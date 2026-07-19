import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us — Sree Sai Jewellers',
  description:
    'Learn about GLYA — Sree Sai Jewellers. Hand-finished fine jewellery crafted at our Koregaon Park, Pune atelier since 2019. BIS Hallmarked, IGI/GIA certified, lifetime exchange & buyback.',
  keywords: [
    'Sree Sai Jewellers Pune',
    'GLYA fine jewellery about',
    'jewellery atelier Pune',
    'Koregaon Park jewellery store',
    'BIS hallmarked jewellery Pune',
    'custom jewellery Pune',
    'gold jewellery manufacturer Pune',
    'about GLYA jewellery',
  ],
  alternates: { canonical: 'https://glya.in/about' },
  openGraph: {
    url: 'https://glya.in/about',
    title: 'About Sree Sai Jewellers | GLYA Fine Jewellery, Pune',
    description: 'GLYA (Sree Sai Jewellers) — hand-crafted fine jewellery from our Koregaon Park, Pune atelier since 2019. Radical price transparency, lifetime exchange & buyback.',
    type: 'website',
    siteName: 'GLYA — Sree Sai Jewellers',
  },
  twitter: {
    card: 'summary',
    title: 'About GLYA — Sree Sai Jewellers, Pune',
    description: 'Hand-crafted fine jewellery from our Pune atelier. BIS Hallmarked, IGI certified, lifetime exchange.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  '@id': 'https://glya.in/about',
  name: 'About GLYA — Sree Sai Jewellers',
  url: 'https://glya.in/about',
  description: 'GLYA (Sree Sai Jewellers) — hand-crafted fine jewellery from our Koregaon Park, Pune atelier.',
  mainEntity: {
    '@type': 'JewelryStore',
    '@id': 'https://glya.in/#business',
    name: 'GLYA — Sree Sai Jewellers',
    alternateName: ['Sree Sai Jewellers', 'Sai Jewells', 'Sai Jewellers', 'GLYA Fine Jewellery'],
    url: 'https://glya.in',
    description:
      'Fine jewellery crafted with radical transparency. Every price is broken down to the gram — metal value, making charges, stone value, and GST. Founded 2019 in Pune.',
    foundingDate: '2019',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Koregaon Park',
      addressLocality: 'Pune',
      addressRegion: 'Maharashtra',
      postalCode: '411001',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 18.5362,
      longitude: 73.8957,
    },
    telephone: '+91-98765-43210',
    email: 'hello@glya.in',
    priceRange: '₹₹₹',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '10:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday'],
        opens: '11:00',
        closes: '17:00',
        description: 'By appointment only',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Fine Jewellery Collection',
      url: 'https://glya.in/browse',
    },
    sameAs: ['https://glya.in'],
    slogan: 'Certified today, valued forever.',
    knowsAbout: ['Gold jewellery', 'Diamond jewellery', 'BIS hallmarking', 'IGI certification', 'Custom jewellery'],
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://glya.in' },
      { '@type': 'ListItem', position: 2, name: 'About Us', item: 'https://glya.in/about' },
    ],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
