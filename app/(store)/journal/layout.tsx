import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jewellery Journal',
  description:
    'Expert guides on gold jewellery, diamond grading, hallmarking, styling & care — from Sree Sai Jewellers (GLYA), Pune.',
  alternates: { canonical: 'https://glya.in/journal' },
  openGraph: {
    url: 'https://glya.in/journal',
    title: 'Jewellery Journal | GLYA — Sree Sai Jewellers',
    description: 'Expert guides on gold, diamonds, hallmarking & jewellery care from Sree Sai Jewellers, Pune.',
  },
};

export default function JournalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
