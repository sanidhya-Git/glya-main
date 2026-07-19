import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jewellery Journal — Guides, Stories & Education',
  description:
    'Expert guides on gold jewellery, diamond grading, BIS hallmarking, jewellery styling & care — from Sree Sai Jewellers (GLYA), Pune. Learn about 22K gold, IGI certification, and fine jewellery.',
  keywords: [
    'jewellery buying guide India',
    'gold jewellery guide',
    'diamond grading guide',
    'BIS hallmark explained',
    'how to buy gold jewellery India',
    'jewellery care tips',
    'IGI GIA certification guide',
    '22K vs 18K gold',
    'bridal jewellery guide India',
    'GLYA journal',
    'Sree Sai Jewellers blog',
  ],
  alternates: { canonical: 'https://glya.in/journal' },
  openGraph: {
    url: 'https://glya.in/journal',
    title: 'Jewellery Journal | GLYA — Sree Sai Jewellers',
    description: 'Expert guides on gold, diamonds, hallmarking & jewellery care from Sree Sai Jewellers, Pune.',
    type: 'website',
    siteName: 'GLYA — Sree Sai Jewellers',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GLYA Jewellery Journal — Guides & Education',
    description: 'Expert jewellery guides on gold, diamonds, BIS hallmarking, and styling from Sree Sai Jewellers.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  '@id': 'https://glya.in/journal#blog',
  name: 'The GLYA Journal',
  description: 'Expert guides on gold jewellery, diamond grading, BIS hallmarking, styling & care from Sree Sai Jewellers, Pune.',
  url: 'https://glya.in/journal',
  publisher: { '@id': 'https://glya.in/#business' },
  inLanguage: 'en-IN',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://glya.in' },
      { '@type': 'ListItem', position: 2, name: 'Jewellery Journal', item: 'https://glya.in/journal' },
    ],
  },
};

export default function JournalLayout({ children }: { children: React.ReactNode }) {
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
