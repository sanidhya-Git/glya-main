import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop Gold & Diamond Jewellery',
  description:
    'Browse the full collection of certified 22K gold, diamond rings, bangles, necklaces & earrings from Sree Sai Jewellers (GLYA), Pune. Live bullion-rate pricing, BIS Hallmarked, IGI certified.',
  alternates: { canonical: 'https://glya.in/browse' },
  openGraph: {
    url: 'https://glya.in/browse',
    title: 'Shop Gold & Diamond Jewellery | GLYA — Sree Sai Jewellers',
    description: 'Browse certified 22K gold & diamond jewellery from Sree Sai Jewellers, Pune.',
  },
};

export default function BrowseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
