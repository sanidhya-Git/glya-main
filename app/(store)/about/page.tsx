'use client';
import Link from 'next/link';

const VALUES = [
  {
    icon: '◈',
    title: 'Radical transparency',
    body: 'Every price is broken down to the gram. You see metal value, making charges, stone value, and GST — nothing hidden.',
  },
  {
    icon: '∴',
    title: 'Atelier craftsmanship',
    body: 'Each piece is hand-finished in our Pune atelier by craftspeople who have trained for decades in traditional techniques.',
  },
  {
    icon: '◎',
    title: 'Certified assurance',
    body: 'Every metal piece carries a BIS hallmark. Every diamond and precious stone ships with IGI or GIA certification.',
  },
  {
    icon: '∞',
    title: 'Lifetime commitment',
    body: 'We offer lifetime exchange and buyback. Your jewellery is an investment — we stand behind it forever.',
  },
];

const TEAM = [
  { name: 'Arjun Mehta',    role: 'Founder & Creative Director', init: 'AM' },
  { name: 'Priya Desai',    role: 'Head of Design',               init: 'PD' },
  { name: 'Rohan Kapoor',   role: 'Master Goldsmith',             init: 'RK' },
  { name: 'Shreya Joshi',   role: 'Gemology & Certification',     init: 'SJ' },
];

const TRUST = [
  { label: 'BIS Hallmarked',      sub: 'Every gold & silver piece' },
  { label: 'IGI Certified',       sub: 'All diamonds & stones' },
  { label: '5-Year Warranty',     sub: 'On all products' },
  { label: 'ISO 9001:2015',       sub: 'Quality management' },
];

export default function AboutPage() {
  return (
    <main style={{ animation: 'glyaFade 0.5s ease' }}>
      <style>{`
        .about-values { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: clamp(16px,3vw,32px); }
        .about-team   { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: clamp(16px,3vw,28px); }
        .about-trust  { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0; border: 1px solid var(--line); }
        .trust-cell   { padding: clamp(18px,3vw,32px) clamp(14px,2.5vw,24px); text-align: center; border-right: 1px solid var(--line); }
        .trust-cell:last-child { border-right: none; }
        @media(max-width:640px){
          .about-trust { grid-template-columns: 1fr 1fr; }
          .trust-cell:nth-child(2n){ border-right: none; }
          .trust-cell:nth-child(n+3){ border-top: 1px solid var(--line); }
        }
      `}</style>

      {/* HERO */}
      <section style={{ background: '#211C17', minHeight: '55vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'clamp(48px,8vw,96px) clamp(20px,5vw,60px)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 60%, rgba(176,141,87,0.14) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <p style={{ fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#B08D57', position: 'relative' }}>Est. 2019 · Pune, India</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(40px,7vw,88px)', color: '#EDE6D8', lineHeight: 1.0, marginTop: 16, maxWidth: 700, fontWeight: 400, position: 'relative' }}>
          Jewellery made<br />with <em style={{ fontStyle: 'italic', color: '#B08D57' }}>conviction</em>
        </h1>
        <p style={{ color: '#9E958A', fontSize: 'clamp(14px,1.5vw,17px)', marginTop: 22, maxWidth: 480, lineHeight: 1.75, position: 'relative', fontWeight: 300 }}>
          We believe fine jewellery should be honest — in price, in craft, and in the promise it makes to the person who wears it.
        </p>
      </section>

      {/* STORY */}
      <section style={{ maxWidth: 840, margin: '0 auto', padding: 'clamp(48px,7vw,88px) clamp(20px,4vw,40px)', textAlign: 'center' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16 }}>Our story</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 400, fontSize: 'clamp(26px,3.5vw,42px)', lineHeight: 1.15 }}>
          Started in a small workshop in Koregaon Park
        </h2>
        <p style={{ color: 'var(--ink2)', fontSize: 'clamp(15px,1.5vw,17px)', lineHeight: 1.85, marginTop: 24, fontWeight: 300 }}>
          GLYA was founded in 2019 by Arjun Mehta, a second-generation jeweller who grew frustrated watching customers overpay for pieces whose value they could never verify. He brought together a team of master goldsmiths, a gemologist, and a designer — and set one rule: every price must be explainable down to the last rupee.
        </p>
        <p style={{ color: 'var(--ink2)', fontSize: 'clamp(15px,1.5vw,17px)', lineHeight: 1.85, marginTop: 18, fontWeight: 300 }}>
          Today we serve customers across India from our Pune atelier. Every piece is hand-crafted, BIS hallmarked, and priced live against the bullion rate. No markups. No mystery. Just gold, craft, and care.
        </p>
      </section>

      {/* DIVIDER */}
      <div style={{ maxWidth: 120, margin: '0 auto', height: 1, background: 'var(--gold)', opacity: 0.4 }} />

      {/* VALUES */}
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(48px,7vw,88px) clamp(20px,4vw,40px)' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>What we stand for</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 400, fontSize: 'clamp(26px,3.5vw,42px)' }}>Four things we will never compromise</h2>
        </div>
        <div className="about-values">
          {VALUES.map(v => (
            <div key={v.title} style={{ background: 'var(--paper2)', borderRadius: 4, padding: 'clamp(22px,3.5vw,36px) clamp(18px,3vw,28px)', border: '1px solid var(--line)' }}>
              <div style={{ fontSize: 28, color: 'var(--gold)', marginBottom: 18 }}>{v.icon}</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(20px,2vw,26px)', lineHeight: 1.2, marginBottom: 12 }}>{v.title}</h3>
              <p style={{ color: 'var(--ink2)', fontSize: 14.5, lineHeight: 1.75, fontWeight: 300 }}>{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ATELIER SPLIT */}
      <section style={{ background: 'var(--paper2)', padding: 'clamp(44px,6vw,80px) clamp(20px,4vw,40px)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 'clamp(28px,5vw,64px)', alignItems: 'center' }}>
          <div style={{ background: '#2F4A3F', minHeight: 320, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 80, color: 'rgba(237,230,216,0.12)' }}>◈</span>
          </div>
          <div>
            <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14 }}>The atelier</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 400, fontSize: 'clamp(24px,3vw,40px)', lineHeight: 1.15 }}>
              Where every piece begins with a drawing and ends with a hallmark
            </h2>
            <p style={{ color: 'var(--ink2)', fontSize: 15, lineHeight: 1.8, marginTop: 18, fontWeight: 300 }}>
              Our Koregaon Park atelier houses six master craftspeople, each specialising in a different discipline — karigari, meenakari, stone-setting, polishing, quality assurance, and finishing. Every GLYA piece passes through every pair of hands before it leaves our studio.
            </p>
            <p style={{ color: 'var(--ink2)', fontSize: 15, lineHeight: 1.8, marginTop: 14, fontWeight: 300 }}>
              We are open to visits by appointment. Come see how your jewellery is made.
            </p>
            <Link href="/contact" style={{ display: 'inline-block', marginTop: 26, padding: '11px 26px', border: '1px solid var(--ink)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', color: 'var(--ink)' }}>
              Book a visit →
            </Link>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(48px,7vw,88px) clamp(20px,4vw,40px)' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>The people</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 400, fontSize: 'clamp(26px,3.5vw,42px)' }}>Meet the team behind GLYA</h2>
        </div>
        <div className="about-team">
          {TEAM.map(m => (
            <div key={m.name} style={{ textAlign: 'center' }}>
              <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'var(--paper2)', border: '1px solid var(--line)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond',serif", fontSize: 26, color: 'var(--gold-d)' }}>
                {m.init}
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, lineHeight: 1.2 }}>{m.name}</div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 6, letterSpacing: '0.04em' }}>{m.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST */}
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '0 clamp(20px,4vw,40px) clamp(48px,7vw,88px)' }}>
        <div className="about-trust">
          {TRUST.map(t => (
            <div key={t.label} className="trust-cell">
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(18px,2vw,24px)', fontWeight: 500 }}>{t.label}</div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 6 }}>{t.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--ink)', padding: 'clamp(48px,7vw,88px) clamp(20px,4vw,40px)', textAlign: 'center' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#B08D57', marginBottom: 16 }}>Ready to find your piece?</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 400, fontSize: 'clamp(28px,4vw,52px)', color: '#EDE6D8', lineHeight: 1.05 }}>
          Browse the collection
        </h2>
        <p style={{ color: '#9E958A', fontSize: 15, marginTop: 16, maxWidth: 420, margin: '16px auto 0', lineHeight: 1.7 }}>
          Every piece is priced live. No negotiations — just the fairest price in the market.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginTop: 32 }}>
          <Link href="/browse" style={{ display: 'inline-block', padding: '14px 36px', background: '#B08D57', color: '#211C17', fontSize: 12.5, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, textDecoration: 'none', borderRadius: 2 }}>
            Shop now
          </Link>
          <Link href="/contact" style={{ display: 'inline-block', padding: '14px 36px', border: '1px solid rgba(237,230,216,0.3)', color: '#EDE6D8', fontSize: 12.5, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: 2 }}>
            Contact us
          </Link>
        </div>
      </section>
    </main>
  );
}
