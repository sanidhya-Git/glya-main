import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop Gold & Diamond Jewellery',
  description:
    'Browse the full collection of certified 22K gold, diamond rings, bangles, necklaces & earrings from Sree Sai Jewellers (GLYA), Pune. Live bullion-rate pricing, BIS Hallmarked, IGI certified. Free insured shipping.',
  keywords: [
    'buy gold jewellery online India',
    '22K gold jewellery online',
    'diamond jewellery India',
    'BIS hallmarked jewellery',
    'gold rings online India',
    'gold bangles online India',
    'gold necklaces India',
    'diamond rings India',
    'jewellery Pune',
    'certified gold jewellery',
    'IGI certified diamond jewellery',
    'fine jewellery online India',
    'GLYA jewellery collection',
    'Sree Sai Jewellers collection',
    'bridal jewellery India',
    'everyday gold jewellery',
  ],
  alternates: { canonical: 'https://glya.in/browse' },
  openGraph: {
    url: 'https://glya.in/browse',
    title: 'Shop Gold & Diamond Jewellery | GLYA — Sree Sai Jewellers',
    description: 'Browse certified 22K gold & diamond jewellery from Sree Sai Jewellers, Pune. Live pricing, BIS Hallmarked, free insured shipping.',
    type: 'website',
    siteName: 'GLYA — Sree Sai Jewellers',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop Certified Gold & Diamond Jewellery | GLYA',
    description: 'Browse 22K gold, diamond rings, bangles & necklaces. Live pricing, BIS Hallmarked, free shipping.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': 'https://glya.in/browse',
  name: 'GLYA Fine Jewellery Collection',
  description: 'Browse the full collection of certified gold, diamond & precious stone jewellery from Sree Sai Jewellers, Pune.',
  url: 'https://glya.in/browse',
  provider: { '@id': 'https://glya.in/#business' },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://glya.in' },
      { '@type': 'ListItem', position: 2, name: 'Shop All Jewellery', item: 'https://glya.in/browse' },
    ],
  },
};

export default function BrowseLayout({ children }: { children: React.ReactNode }) {
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
