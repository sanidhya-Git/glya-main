import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for GLYA — Sree Sai Jewellers. How we collect, use, and protect your personal information.',
  alternates: { canonical: 'https://glya.in/privacy' },
  robots: { index: true, follow: true },
  openGraph: {
    url: 'https://glya.in/privacy',
    title: 'Privacy Policy | GLYA — Sree Sai Jewellers',
    description: 'Privacy policy for GLYA — Sree Sai Jewellers, Pune.',
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
