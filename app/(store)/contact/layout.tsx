import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Sree Sai Jewellers (GLYA) — visit our Koregaon Park, Pune store or reach us by phone, email, or custom order enquiry.',
  alternates: { canonical: 'https://glya.in/contact' },
  openGraph: {
    url: 'https://glya.in/contact',
    title: 'Contact Sree Sai Jewellers | GLYA, Koregaon Park Pune',
    description: 'Visit Sree Sai Jewellers (GLYA) at Koregaon Park, Pune or enquire online.',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
