'use client';
import Link from 'next/link';

const STEPS = [
  { n: '01', title: 'Initiate your return', body: 'Email us at returns@glya.in or WhatsApp +91 98765 43210 within 30 days of delivery. Include your order number and reason for return.' },
  { n: '02', title: 'Get your pickup scheduled', body: 'We arrange a free, insured doorstep pickup within 2–3 business days at your convenience. No dropping off required.' },
  { n: '03', title: 'Inspection & approval', body: 'Our gemologists inspect the returned piece within 48 hours of receipt. You receive an email update at every stage.' },
  { n: '04', title: 'Refund or exchange', body: 'Approved refunds are processed within 5–7 business days to your original payment method. Exchanges ship within 3 days.' },
];

const CAN_RETURN = [
  'Unused pieces in original packaging with all certificates',
  'Items with manufacturing defects (any time within warranty)',
  'Wrong item or size delivered',
  'Pieces that differ significantly from product description',
];

const CANNOT_RETURN = [
  'Custom engraved or personalised pieces',
  'Items worn, damaged, or altered after delivery',
  'Pieces without original certificates or packaging',
  'Special-order or bespoke commissions',
  'Pieces purchased during clearance events (marked final sale)',
];

export default function ReturnsPage() {
  return (
    <main style={{ animation: 'glyaFade 0.5s ease' }}>

      {/* HERO */}
      <section style={{ background: 'var(--paper2)', padding: 'clamp(48px,7vw,96px) clamp(20px,5vw,60px)', textAlign: 'center' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14 }}>Returns &amp; Exchange</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(36px,6vw,72px)', lineHeight: 1.05, color: 'var(--ink)' }}>
          30-day hassle-free<br />returns
        </h1>
        <p style={{ maxWidth: 520, margin: '20px auto 0', fontSize: 15, lineHeight: 1.75, color: 'var(--ink2)', fontWeight: 300 }}>
          Every GLYA piece ships with full return protection. If it's not perfect, we make it right — no questions asked.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' }}>
          <Link href="/track" style={{ padding: '13px 30px', background: 'var(--ink)', color: '#F7F2E8', fontSize: 12.5, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: 2 }}>Track my order</Link>
          <Link href="/contact" style={{ padding: '13px 30px', border: '1px solid var(--ink)', color: 'var(--ink)', fontSize: 12.5, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: 2 }}>Contact support</Link>
        </div>
      </section>

      {/* TRUST STATS */}
      <section style={{ borderBottom: '1px solid var(--line)', borderTop: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 0 }}>
          {[
            { val: '30 days', label: 'Return window' },
            { val: 'Free', label: 'Doorstep pickup' },
            { val: '5–7 days', label: 'Refund processing' },
            { val: 'Lifetime', label: 'Buyback program' },
          ].map((s, i) => (
            <div key={s.val} style={{ padding: 'clamp(20px,3vw,32px) clamp(16px,2.5vw,28px)', textAlign: 'center', borderRight: i < 3 ? '1px solid var(--line)' : 'none' }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(28px,3.5vw,38px)', fontWeight: 500, color: 'var(--gold-d)' }}>{s.val}</div>
              <div style={{ fontSize: 12.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(44px,6vw,72px) clamp(20px,4vw,40px)' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <p style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>Process</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(28px,4vw,48px)' }}>How returns work</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {STEPS.map((s, i) => (
            <div key={s.n} style={{ display: 'grid', gridTemplateColumns: '72px 1fr', gap: 'clamp(16px,2.5vw,28px)', padding: 'clamp(20px,3vw,32px) 0', borderBottom: i < STEPS.length - 1 ? '1px solid var(--line)' : 'none', alignItems: 'start' }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(32px,4vw,44px)', color: 'var(--line)', fontWeight: 500, lineHeight: 1 }}>{s.n}</div>
              <div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(20px,2.5vw,26px)', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ color: 'var(--ink2)', fontSize: 15, lineHeight: 1.75, fontWeight: 300 }}>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT CAN / CANNOT */}
      <section style={{ background: 'var(--paper2)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(44px,6vw,72px) clamp(20px,4vw,40px)' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(28px,4vw,44px)', marginBottom: 36, textAlign: 'center' }}>Return eligibility</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 'clamp(20px,3vw,40px)' }}>
            <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 4, padding: 'clamp(20px,3vw,32px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(47,122,91,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: 'var(--em)', flexShrink: 0 }}>✓</span>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 500 }}>Eligible for return</h3>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {CAN_RETURN.map(item => (
                  <li key={item} style={{ display: 'flex', gap: 12, fontSize: 14.5, color: 'var(--ink2)', lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--em)', flexShrink: 0, marginTop: 2 }}>◈</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 4, padding: 'clamp(20px,3vw,32px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(180,85,59,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#B4553B', flexShrink: 0 }}>✕</span>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 500 }}>Not eligible</h3>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {CANNOT_RETURN.map(item => (
                  <li key={item} style={{ display: 'flex', gap: 12, fontSize: 14.5, color: 'var(--ink2)', lineHeight: 1.5 }}>
                    <span style={{ color: '#B4553B', flexShrink: 0, marginTop: 2 }}>◈</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* EXCHANGE */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(44px,6vw,72px) clamp(20px,4vw,40px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 'clamp(24px,4vw,48px)', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>Exchange</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(26px,3.5vw,42px)', lineHeight: 1.1 }}>Upgrade anytime</h2>
            <p style={{ color: 'var(--ink2)', fontSize: 15, lineHeight: 1.75, fontWeight: 300, marginTop: 16 }}>
              Exchange your piece for a different size, style, or karat within 30 days — we'll credit the full original purchase price toward your new selection.
            </p>
            <p style={{ color: 'var(--ink2)', fontSize: 15, lineHeight: 1.75, fontWeight: 300, marginTop: 12 }}>
              For exchanges of higher value, you pay only the difference. We cover all insured shipping both ways.
            </p>
          </div>
          <div style={{ background: 'var(--paper2)', borderRadius: 4, padding: 'clamp(20px,3vw,32px)', border: '1px solid var(--line)' }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 500, marginBottom: 18 }}>Lifetime buyback</h3>
            <p style={{ color: 'var(--ink2)', fontSize: 14.5, lineHeight: 1.75, fontWeight: 300 }}>
              GLYA offers a lifetime buyback guarantee on all pieces. Return your jewellery at any time and receive up to <strong style={{ color: 'var(--ink)', fontWeight: 500 }}>80% of the current metal value</strong> — no questions asked.
            </p>
            <p style={{ color: 'var(--ink2)', fontSize: 14.5, lineHeight: 1.75, fontWeight: 300, marginTop: 12 }}>
              The buyback value is calculated on the live gold or platinum rate at the time of return, ensuring you're always protected against depreciation.
            </p>
            <Link href="/contact" style={{ display: 'inline-block', marginTop: 20, padding: '11px 24px', border: '1px solid var(--ink)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', color: 'var(--ink)', borderRadius: 2 }}>Enquire about buyback</Link>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section style={{ background: 'var(--ink)', padding: 'clamp(36px,5vw,60px) clamp(20px,4vw,40px)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 400, fontSize: 'clamp(24px,3.5vw,40px)', color: '#EDE6D8', marginBottom: 10 }}>Need help with a return?</h2>
        <p style={{ color: '#9E958A', fontSize: 15, marginBottom: 24 }}>Our team responds within 2 hours on business days.</p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="mailto:returns@glya.in" style={{ padding: '12px 28px', background: 'var(--gold)', color: 'var(--ink)', fontSize: 12.5, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: 2, fontWeight: 600 }}>returns@glya.in</a>
          <a href="https://wa.me/919876543210" style={{ padding: '12px 28px', border: '1px solid rgba(237,230,216,0.3)', color: '#EDE6D8', fontSize: 12.5, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: 2 }}>WhatsApp us</a>
        </div>
      </section>

    </main>
  );
}
