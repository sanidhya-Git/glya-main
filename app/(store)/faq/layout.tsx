import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Get answers about ordering, pricing, BIS hallmarking, diamond certification, shipping, returns, and custom orders at GLYA — Sree Sai Jewellers, Pune.',
  keywords: [
    'jewellery FAQ India',
    'gold jewellery price calculation',
    'BIS hallmark explained',
    'IGI diamond certificate',
    'jewellery return policy India',
    'custom jewellery order Pune',
    'GLYA FAQ',
    'Sree Sai Jewellers FAQ',
    '22K gold jewellery questions',
  ],
  alternates: { canonical: 'https://glya.in/faq' },
  openGraph: {
    url: 'https://glya.in/faq',
    title: 'FAQ | GLYA — Sree Sai Jewellers, Pune',
    description: 'Answers to common questions about gold pricing, BIS hallmarking, diamond certification, shipping, and returns at Sree Sai Jewellers.',
  },
  twitter: {
    card: 'summary',
    title: 'FAQ | GLYA — Sree Sai Jewellers',
    description: 'Common questions about gold pricing, BIS hallmarks, certifications, shipping, and custom orders.',
  },
};

const FAQ_ITEMS = [
  { q: 'How are your prices calculated?', a: 'Every price is calculated live using the current gold rate. The formula is: metal value (weight × gold rate × karat purity) + making charges + stone value + 3% GST. Prices update throughout the day as the bullion rate moves.' },
  { q: 'Can I place a custom or bespoke order?', a: 'Yes. We accept custom orders for most product types — rings, necklaces, bangles, and bridal sets. Custom orders typically take 3–5 weeks.' },
  { q: 'Are your products available offline?', a: 'Our primary channel is online, but you are welcome to visit our atelier in Koregaon Park, Pune, by appointment.' },
  { q: 'Can I modify an order after placing it?', a: 'You can request changes within 2 hours of placing your order by calling us. After production begins we cannot accept modifications, but you may cancel for a full refund.' },
  { q: 'Do you offer EMI or financing?', a: 'We accept no-cost EMI through select credit cards (HDFC, ICICI, SBI, Axis, Kotak) on orders above ₹25,000.' },
  { q: 'How long does delivery take?', a: 'Standard insured shipping takes 3–5 business days pan India. All shipments are fully insured at the declared value.' },
  { q: 'Is shipping free?', a: 'Standard insured shipping is complimentary on all orders. Express and same-day options carry an additional fee shown at checkout.' },
  { q: 'What is your return and exchange policy?', a: 'We accept returns within 30 days of delivery. The piece must be unworn, undamaged, and in its original packaging.' },
  { q: 'Do you offer a lifetime exchange or buyback?', a: 'Yes — all GLYA pieces are eligible for lifetime exchange at the current gold rate, minus making charges. We also offer buyback at 90% of the prevailing metal value.' },
  { q: 'What if my order arrives damaged?', a: 'Please photograph the damaged item and packaging within 24 hours of receipt and email us. We will arrange a replacement or full refund at no cost.' },
  { q: 'What karats of gold do you offer?', a: 'We offer 22K (91.6% pure) for traditional and everyday jewellery, and 18K (75% pure) for diamond-set and contemporary pieces.' },
  { q: 'What is BIS hallmarking?', a: 'BIS (Bureau of Indian Standards) hallmarking is mandatory government certification that verifies the purity of gold jewellery. Every GLYA gold piece carries the BIS mark.' },
  { q: 'Do your diamonds come with certification?', a: 'Yes. All diamonds above 0.18 carats come with an IGI (International Gemological Institute) or GIA (Gemological Institute of America) certificate.' },
  { q: 'Do you provide a GST invoice?', a: 'Yes. A GST-compliant invoice is included with every order and also emailed to you.' },
  { q: 'How does the custom order process work?', a: 'Contact us with your design brief → We share a CAD rendering and quote → Pay 50% advance → Production takes 3–5 weeks → Piece ships with full documentation.' },
  { q: 'What is the minimum budget for a custom order?', a: 'We accept custom orders from ₹15,000 upwards, depending on the design complexity and materials.' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  name: 'GLYA Jewellery FAQ — Frequently Asked Questions',
  url: 'https://glya.in/faq',
  mainEntity: FAQ_ITEMS.map(item => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
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
