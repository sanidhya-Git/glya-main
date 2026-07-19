import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions for shopping at GLYA — Sree Sai Jewellers. Understand our policies on orders, returns, and jewellery certification.',
  alternates: { canonical: 'https://glya.in/terms' },
  robots: { index: true, follow: true },
  openGraph: {
    url: 'https://glya.in/terms',
    title: 'Terms & Conditions | GLYA — Sree Sai Jewellers',
    description: 'Terms and conditions for shopping at GLYA — Sree Sai Jewellers, Pune.',
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
