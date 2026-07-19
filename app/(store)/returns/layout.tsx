import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Returns & Exchange Policy',
  description: '30-day free returns, lifetime exchange & buyback policy at GLYA — Sree Sai Jewellers. Hassle-free returns on all certified jewellery.',
  keywords: ['jewellery return policy', 'gold exchange policy India', 'lifetime buyback gold jewellery', 'GLYA returns', 'Sree Sai Jewellers return policy'],
  alternates: { canonical: 'https://glya.in/returns' },
  robots: { index: true, follow: true },
  openGraph: {
    url: 'https://glya.in/returns',
    title: 'Returns & Exchange Policy | GLYA — Sree Sai Jewellers',
    description: '30-day free returns and lifetime exchange policy at GLYA, Sree Sai Jewellers, Pune.',
  },
};

export default function ReturnsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
