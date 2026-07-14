import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us — Sree Sai Jewellers',
  description:
    'Learn about GLYA — Sree Sai Jewellers. Hand-finished fine jewellery crafted at our Pune atelier. BIS Hallmarked, IGI/GIA certified, lifetime exchange & buyback.',
  alternates: { canonical: 'https://glya.in/about' },
  openGraph: {
    url: 'https://glya.in/about',
    title: 'About Sree Sai Jewellers | GLYA Fine Jewellery, Pune',
    description: 'GLYA (Sree Sai Jewellers) — hand-crafted fine jewellery from our Koregaon Park, Pune atelier.',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
