import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Sree Sai Jewellers (GLYA) — visit our Koregaon Park, Pune store or reach us by phone, email, or custom order enquiry. Mon–Sat 10am–7pm.',
  keywords: [
    'contact Sree Sai Jewellers',
    'GLYA contact Pune',
    'jewellery store Koregaon Park',
    'jewellery store Pune contact',
    'custom jewellery enquiry Pune',
    'gold jewellery shop Pune',
    'atelier visit jewellery Pune',
  ],
  alternates: { canonical: 'https://glya.in/contact' },
  openGraph: {
    url: 'https://glya.in/contact',
    title: 'Contact Sree Sai Jewellers | GLYA, Koregaon Park Pune',
    description: 'Visit Sree Sai Jewellers (GLYA) at Koregaon Park, Pune or enquire online. Custom orders, atelier visits & product questions welcome.',
    type: 'website',
    siteName: 'GLYA — Sree Sai Jewellers',
  },
  twitter: {
    card: 'summary',
    title: 'Contact GLYA — Sree Sai Jewellers, Pune',
    description: 'Reach Sree Sai Jewellers at Koregaon Park, Pune. Mon–Sat 10am–7pm.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ContactPage',
      '@id': 'https://glya.in/contact',
      name: 'Contact GLYA — Sree Sai Jewellers',
      url: 'https://glya.in/contact',
      description: 'Contact page for GLYA — Sree Sai Jewellers, Koregaon Park, Pune.',
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://glya.in' },
          { '@type': 'ListItem', position: 2, name: 'Contact', item: 'https://glya.in/contact' },
        ],
      },
    },
    {
      '@type': 'LocalBusiness',
      '@id': 'https://glya.in/#localbusiness',
      name: 'GLYA — Sree Sai Jewellers',
      alternateName: ['Sree Sai Jewellers', 'Sai Jewellers Pune', 'GLYA Fine Jewellery'],
      url: 'https://glya.in',
      logo: 'https://glya.in/icon',
      image: 'https://glya.in/icon',
      telephone: '+91-98765-43210',
      email: 'hello@glya.in',
      description:
        'Certified fine gold, diamond & precious stone jewellery from Pune. BIS Hallmarked, IGI/GIA certified, live bullion pricing, lifetime exchange & buyback.',
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
      hasMap: 'https://maps.google.com/?q=Koregaon+Park+Pune+jewellery',
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
        },
      ],
      priceRange: '₹₹₹',
      currenciesAccepted: 'INR',
      paymentAccepted: 'Cash, Credit Card, Debit Card, UPI, Net Banking, EMI',
      areaServed: {
        '@type': 'Country',
        name: 'India',
      },
    },
  ],
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
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
