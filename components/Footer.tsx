'use client';
import Link from 'next/link';

const linkStyle = { color:'#C9C0B0', textDecoration:'none' as const };
const hover = {
  enter: (e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color='var(--gold)'),
  leave: (e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color='#C9C0B0'),
};

export default function Footer() {
  return (
    <footer style={{ background:'var(--ink)', color:'#C9C0B0', marginTop:'clamp(40px,6vw,90px)' }}>
      <div style={{ maxWidth:1360, margin:'0 auto', padding:'clamp(40px,5vw,70px) clamp(16px,3vw,28px)' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'clamp(24px,3vw,36px)' }}>

          {/* BRAND */}
          <div style={{ gridColumn: 'span 1' }}>
            <Link href="/" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, letterSpacing:'0.3em', paddingLeft:'0.3em', color:'#fff', textDecoration:'none', display:'block' }}>GLYA</Link>
            <p style={{ marginTop:16, fontSize:13.5, lineHeight:1.7, fontWeight:300, maxWidth:240 }}>Certified fine jewellery, priced transparently to the live gold rate. Designed and hallmarked in India.</p>
            <div style={{ display:'flex', gap:14, marginTop:20 }}>
              {['Instagram','Pinterest','YouTube'].map(s => (
                <span key={s} style={{ fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', cursor:'pointer', color:'#8B8272' }}
                  onMouseEnter={e => (e.currentTarget.style.color='var(--gold)')}
                  onMouseLeave={e => (e.currentTarget.style.color='#8B8272')}
                >{s}</span>
              ))}
            </div>
          </div>

          {/* SHOP */}
          <div>
            <div style={{ fontSize:11.5, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--gold)', marginBottom:16 }}>Shop</div>
            <div style={{ display:'flex', flexDirection:'column', gap:11, fontSize:14 }}>
              {[
                { label:'Rings',     href:'/browse?cat=Rings' },
                { label:'Necklaces', href:'/browse?cat=Necklaces' },
                { label:'Bangles',   href:'/browse?cat=Bangles' },
                { label:'Earrings',  href:'/browse?cat=Earrings' },
                { label:'Bridal',    href:'/browse?col=Bridal' },
                { label:'New arrivals', href:'/browse?tag=New' },
              ].map(c => (
                <Link key={c.label} href={c.href} style={linkStyle} onMouseEnter={hover.enter} onMouseLeave={hover.leave}>{c.label}</Link>
              ))}
            </div>
          </div>

          {/* HELP */}
          <div>
            <div style={{ fontSize:11.5, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--gold)', marginBottom:16 }}>Help</div>
            <div style={{ display:'flex', flexDirection:'column', gap:11, fontSize:14 }}>
              <Link href="/track"   style={linkStyle} onMouseEnter={hover.enter} onMouseLeave={hover.leave}>Track order</Link>
              <Link href="/returns" style={linkStyle} onMouseEnter={hover.enter} onMouseLeave={hover.leave}>Returns &amp; exchange</Link>
              <Link href="/faq"     style={linkStyle} onMouseEnter={hover.enter} onMouseLeave={hover.leave}>FAQ</Link>
              <Link href="/contact" style={linkStyle} onMouseEnter={hover.enter} onMouseLeave={hover.leave}>Contact us</Link>
              <Link href="/account" style={linkStyle} onMouseEnter={hover.enter} onMouseLeave={hover.leave}>My account</Link>
            </div>
          </div>

          {/* THE HOUSE */}
          <div>
            <div style={{ fontSize:11.5, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--gold)', marginBottom:16 }}>The house</div>
            <div style={{ display:'flex', flexDirection:'column', gap:11, fontSize:14 }}>
              <Link href="/about"   style={linkStyle} onMouseEnter={hover.enter} onMouseLeave={hover.leave}>Our story</Link>
              <Link href="/journal" style={linkStyle} onMouseEnter={hover.enter} onMouseLeave={hover.leave}>Journal</Link>
              <Link href="/contact" style={linkStyle} onMouseEnter={hover.enter} onMouseLeave={hover.leave}>Contact</Link>
            </div>
          </div>

          {/* NEWSLETTER */}
          <div>
            <div style={{ fontSize:11.5, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--gold)', marginBottom:16 }}>Stay in the light</div>
            <p style={{ fontSize:13, fontWeight:300, marginBottom:14, lineHeight:1.6 }}>Early access to collections &amp; private events.</p>
            <div style={{ display:'flex', border:'1px solid rgba(201,192,176,0.3)', borderRadius:2, overflow:'hidden' }}>
              <input placeholder="Email address" style={{ flex:1, background:'transparent', border:'none', padding:'12px 14px', fontSize:13, color:'#fff', minWidth:0 }} />
              <button style={{ cursor:'pointer', background:'var(--gold)', border:'none', color:'var(--ink)', padding:'0 18px', fontSize:16, flexShrink:0 }}
                onMouseEnter={e => (e.currentTarget.style.background='#C9A865')}
                onMouseLeave={e => (e.currentTarget.style.background='var(--gold)')}
              >→</button>
            </div>
          </div>
        </div>

        <div style={{ borderTop:'1px solid rgba(201,192,176,0.16)', marginTop:40, paddingTop:24, display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:14, fontSize:12.5, color:'#8B8272' }}>
          <span>© 2026 Glya Fine Jewellery. All rights reserved.</span>
          <div style={{ display:'flex', gap:18, flexWrap:'wrap' }}>
            <Link href="/privacy" style={{ color:'#8B8272', textDecoration:'none' }} onMouseEnter={e => (e.currentTarget.style.color='#C9C0B0')} onMouseLeave={e => (e.currentTarget.style.color='#8B8272')}>Privacy</Link>
            <Link href="/terms"   style={{ color:'#8B8272', textDecoration:'none' }} onMouseEnter={e => (e.currentTarget.style.color='#C9C0B0')} onMouseLeave={e => (e.currentTarget.style.color='#8B8272')}>Terms</Link>
            <Link href="/returns" style={{ color:'#8B8272', textDecoration:'none' }} onMouseEnter={e => (e.currentTarget.style.color='#C9C0B0')} onMouseLeave={e => (e.currentTarget.style.color='#8B8272')}>Returns</Link>
            <Link href="/faq"     style={{ color:'#8B8272', textDecoration:'none' }} onMouseEnter={e => (e.currentTarget.style.color='#C9C0B0')} onMouseLeave={e => (e.currentTarget.style.color='#8B8272')}>FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
