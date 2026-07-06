'use client';
import { useState } from 'react';
import Link from 'next/link';

interface QA { q: string; a: string }
interface Section { title: string; icon: string; items: QA[] }

const SECTIONS: Section[] = [
  {
    title: 'Ordering',
    icon: '⊞',
    items: [
      {
        q: 'How are your prices calculated?',
        a: 'Every price is calculated live using the current gold rate. The formula is: metal value (weight × gold rate × karat purity) + making charges + stone value + 3% GST. You can see the full breakdown on each product page. Prices update throughout the day as the bullion rate moves.',
      },
      {
        q: 'Can I place a custom or bespoke order?',
        a: 'Yes. We accept custom orders for most product types — rings, necklaces, bangles, and bridal sets. Please contact us with your design reference, metal preference, and budget, and our team will get back to you within 24 hours. Custom orders typically take 3–5 weeks.',
      },
      {
        q: 'Are your products available offline?',
        a: 'Our primary channel is online, but you are welcome to visit our atelier in Koregaon Park, Pune, by appointment. Contact us to schedule a visit.',
      },
      {
        q: 'Can I modify an order after placing it?',
        a: 'You can request changes within 2 hours of placing your order by calling us on +91 98765 43210. After production begins we cannot accept modifications, but you may cancel for a full refund.',
      },
      {
        q: 'Do you offer EMI or financing?',
        a: 'We accept no-cost EMI through select credit cards (HDFC, ICICI, SBI, Axis, Kotak) on orders above ₹25,000. The EMI option is shown at checkout.',
      },
    ],
  },
  {
    title: 'Shipping & Returns',
    icon: '↺',
    items: [
      {
        q: 'How long does delivery take?',
        a: 'Standard insured shipping takes 3–5 business days pan India. Express (1–2 days) and same-day delivery (select cities) are available at checkout for an additional charge. All shipments are fully insured at the declared value.',
      },
      {
        q: 'Is shipping free?',
        a: 'Standard insured shipping is complimentary on all orders. Express and same-day options carry an additional fee shown at checkout.',
      },
      {
        q: 'What is your return and exchange policy?',
        a: 'We accept returns within 30 days of delivery. The piece must be unworn, undamaged, and in its original packaging. Custom and engraved pieces are non-returnable unless defective. Once we receive and inspect the return, refunds are processed within 5–7 business days.',
      },
      {
        q: 'Do you offer a lifetime exchange or buyback?',
        a: 'Yes — all GLYA pieces are eligible for lifetime exchange at the current gold rate, minus making charges. We also offer buyback at 90% of the prevailing metal value. Visit our atelier or contact us to initiate either.',
      },
      {
        q: 'What if my order arrives damaged?',
        a: 'Please photograph the damaged item and packaging within 24 hours of receipt and email us at hello@glya.in. We will arrange a replacement or full refund at no cost.',
      },
    ],
  },
  {
    title: 'Products',
    icon: '◈',
    items: [
      {
        q: 'What karats of gold do you offer?',
        a: 'We offer 22K (91.6% pure) for traditional and everyday jewellery, and 18K (75% pure) for diamond-set and contemporary pieces. A few heritage pieces are available in 24K. The karat is clearly stated on every product page, and you can switch between karats where available.',
      },
      {
        q: 'How do I find my ring size?',
        a: 'You can measure your finger using a strip of paper and a ruler. Wrap it snugly around your finger, mark where it overlaps, and measure the length in millimetres — that is your circumference. Our size guide (available on every ring product page) converts this to Indian sizes. When in doubt, size up.',
      },
      {
        q: 'Do you offer silver jewellery?',
        a: 'Yes. Our silver range is made in 925 sterling silver. All silver pieces are hallmarked and rhodium-plated where relevant to prevent tarnishing.',
      },
      {
        q: 'What metals do you work with?',
        a: 'We work with 22K gold, 18K gold, 925 silver, and PT950 platinum. We do not currently offer white gold — we use platinum for white-metal settings, which is denser and more durable.',
      },
      {
        q: 'Can I request a specific stone for a product?',
        a: 'For diamond pieces, we can accommodate requests for specific cut, clarity, and colour grades. For coloured stones, we work with a certified gemstone vendor and can source specific varieties. Please contact us with your requirements.',
      },
    ],
  },
  {
    title: 'Certification & Authenticity',
    icon: '◎',
    items: [
      {
        q: 'What is BIS hallmarking?',
        a: 'BIS (Bureau of Indian Standards) hallmarking is mandatory government certification that verifies the purity of gold jewellery. Every GLYA gold piece carries the BIS mark, including the purity grade (22K = 916, 18K = 750) and the testing centre\'s mark. It is the gold standard of quality assurance in India.',
      },
      {
        q: 'Do your diamonds come with certification?',
        a: 'Yes. All diamonds above 0.18 carats come with an IGI (International Gemological Institute) or GIA (Gemological Institute of America) certificate. The certificate number is printed on the invoice. Stones below 0.18 carats are certified by our in-house gemologist.',
      },
      {
        q: 'How do I verify the authenticity of my GLYA piece?',
        a: 'Each piece ships with a physical authenticity card bearing a unique serial number. You can verify this number on our website. The BIS hallmark is stamped directly on the metal and can be verified independently at any BIS-authorised assaying centre.',
      },
      {
        q: 'Do you provide a GST invoice?',
        a: 'Yes. A GST-compliant invoice is included with every order and also emailed to you. This is required for warranty claims, returns, and resale.',
      },
    ],
  },
  {
    title: 'Custom Orders',
    icon: '✎',
    items: [
      {
        q: 'How does the custom order process work?',
        a: 'Step 1: Contact us with your design brief, metal, stone, and budget. Step 2: We share a CAD rendering and quote within 48 hours. Step 3: On approval, you pay 50% advance. Step 4: Production takes 3–5 weeks. Step 5: Final piece is photographed and shipped with full documentation.',
      },
      {
        q: 'Can I bring my own gold or diamonds?',
        a: 'Yes. We accept customer-supplied gold (minimum 18K) and certified diamonds for custom fabrication. A making charge applies. The supplied material will be assayed and a receipt issued.',
      },
      {
        q: 'What is the minimum budget for a custom order?',
        a: 'We accept custom orders from ₹15,000 upwards, depending on the design complexity and materials. There is no upper limit.',
      },
      {
        q: 'Do you make bridal sets?',
        a: 'Bridal sets are one of our specialities. We can design a complete bridal set (necklace, earrings, maang tikka, bangles, and ring) with a cohesive design language. Bridal consultations are available in-person at our Pune atelier or via video call.',
      },
    ],
  },
];

function AccordionItem({ q, a }: QA) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid var(--line)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 'clamp(14px,2vw,20px) 0', textAlign: 'left', gap: 16 }}
      >
        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(17px,2vw,22px)', color: 'var(--ink)', fontWeight: 500, lineHeight: 1.25 }}>{q}</span>
        <span style={{ fontSize: 22, color: 'var(--muted)', flexShrink: 0, lineHeight: 1 }}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div style={{ padding: '0 0 clamp(14px,2vw,22px)', color: 'var(--ink2)', fontSize: 'clamp(14px,1.5vw,16px)', lineHeight: 1.8, fontWeight: 300, maxWidth: 680, animation: 'glyaFade 0.25s ease' }}>
          {a}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [activeSection, setActiveSection] = useState(0);

  return (
    <main style={{ animation: 'glyaFade 0.5s ease' }}>
      <style>{`
        .faq-layout { display: grid; grid-template-columns: 240px 1fr; gap: clamp(28px,5vw,64px); align-items: start; }
        .faq-nav-btn { display: flex; align-items: center; gap: 10px; padding: 11px 14px; background: none; border: none; cursor: pointer; text-align: left; width: 100%; border-radius: 3px; font-size: 14px; font-family: inherit; transition: background .15s; }
        @media(max-width:720px){ .faq-layout { grid-template-columns: 1fr; } .faq-sidebar { display: none; } }
      `}</style>

      {/* HEADER */}
      <section style={{ background: 'var(--paper2)', padding: 'clamp(44px,7vw,80px) clamp(20px,4vw,40px)', textAlign: 'center', borderBottom: '1px solid var(--line)' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14 }}>Help centre</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 400, fontSize: 'clamp(36px,6vw,72px)', lineHeight: 1.0 }}>
          Frequently asked questions
        </h1>
        <p style={{ color: 'var(--ink2)', fontSize: 'clamp(14px,1.5vw,16px)', marginTop: 16, maxWidth: 440, margin: '16px auto 0', lineHeight: 1.75, fontWeight: 300 }}>
          Can&apos;t find what you&apos;re looking for? <Link href="/contact" style={{ color: 'var(--gold-d)', textDecoration: 'none', borderBottom: '1px solid var(--gold)' }}>Write to us</Link> — we reply within one business day.
        </p>
      </section>

      <section style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(44px,7vw,80px) clamp(20px,4vw,40px)' }}>
        <div className="faq-layout">

          {/* SIDEBAR NAV */}
          <aside className="faq-sidebar" style={{ position: 'sticky', top: 96 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12, paddingLeft: 14 }}>Topics</div>
            {SECTIONS.map((s, i) => (
              <button key={s.title} onClick={() => setActiveSection(i)} className="faq-nav-btn"
                style={{ background: activeSection === i ? 'rgba(176,141,87,0.1)' : 'transparent', color: activeSection === i ? 'var(--gold-d)' : 'var(--ink2)', fontWeight: activeSection === i ? 500 : 400, borderLeft: `2px solid ${activeSection === i ? 'var(--gold)' : 'transparent'}` }}>
                <span style={{ fontSize: 16, color: activeSection === i ? 'var(--gold)' : 'var(--muted)' }}>{s.icon}</span>
                {s.title}
              </button>
            ))}
          </aside>

          {/* FAQ CONTENT */}
          <div>
            {/* Mobile: section tabs */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }} className="faq-mobile-tabs">
              {SECTIONS.map((s, i) => (
                <button key={s.title} onClick={() => setActiveSection(i)}
                  style={{ cursor: 'pointer', padding: '8px 16px', borderRadius: 40, border: `1px solid ${activeSection===i?'var(--gold)':'var(--line)'}`, background: activeSection===i?'rgba(176,141,87,0.1)':'transparent', color: activeSection===i?'var(--gold-d)':'var(--ink2)', fontSize: 13, fontFamily: 'inherit' }}>
                  {s.icon} {s.title}
                </button>
              ))}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 26, color: 'var(--gold)' }}>{SECTIONS[activeSection].icon}</span>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 400, fontSize: 'clamp(24px,3vw,36px)' }}>
                  {SECTIONS[activeSection].title}
                </h2>
              </div>
              <div style={{ borderTop: '1px solid var(--line)', marginTop: 8 }}>
                {SECTIONS[activeSection].items.map(item => (
                  <AccordionItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>

            <div style={{ marginTop: 40, padding: 'clamp(18px,3vw,28px)', background: 'var(--paper2)', borderRadius: 4, border: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 18 }}>
              <div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(18px,2vw,24px)', fontWeight: 500 }}>Still have questions?</h3>
                <p style={{ color: 'var(--ink2)', fontSize: 14, marginTop: 6, fontWeight: 300 }}>Our team replies within one business day.</p>
              </div>
              <Link href="/contact" style={{ textDecoration: 'none', display: 'inline-block', padding: '12px 26px', background: 'var(--ink)', color: '#F7F2E8', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: 2, whiteSpace: 'nowrap' }}>
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
