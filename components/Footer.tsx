'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background:'var(--ink)', color:'#C9C0B0', marginTop:'clamp(40px,6vw,90px)' }}>
      <style>{`
        .ft-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:clamp(24px,3vw,36px); }
        @media (max-width: 640px) {
          .ft-grid { grid-template-columns:1fr 1fr; gap:30px 20px; }
          .ft-brand, .ft-news { grid-column: 1 / -1; }
        }
        .ft-link { color:#C9C0B0; text-decoration:none; transition:color .18s ease, padding-left .18s ease; }
        .ft-link:hover, .ft-link:active { color:var(--gold); padding-left:3px; }
        .ft-link2 { color:#9C9284; text-decoration:none; transition:color .18s ease; }
        .ft-link2:hover, .ft-link2:active { color:#C9C0B0; }
        .ft-social { font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:#9C9284; text-decoration:none; transition:color .18s ease; }
        .ft-social:hover, .ft-social:active { color:var(--gold); }
        .ft-send { cursor:pointer; background:var(--gold); border:none; color:var(--ink); padding:0 18px; font-size:16px; flex-shrink:0; }
        .ft-send:hover { background:#C9A865; }
      `}</style>
      <div style={{ maxWidth:1360, margin:'0 auto', padding:'clamp(40px,5vw,70px) clamp(16px,3vw,28px)' }}>
        <div className="ft-grid">

          {/* BRAND */}
          <div className="ft-brand">
            <Link href="/" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, letterSpacing:'0.3em', paddingLeft:'0.3em', color:'#fff', textDecoration:'none', display:'block' }}>GLYA</Link>
            <p style={{ marginTop:16, fontSize:13.5, lineHeight:1.7, fontWeight:300, maxWidth:240 }}>Certified fine jewellery, priced transparently to the live gold rate. Designed and hallmarked in India.</p>
            <div style={{ display:'flex', gap:14, marginTop:20, flexWrap:'wrap' }}>
              {['Instagram','Pinterest','YouTube'].map(s => (
                <span key={s} className="ft-social" style={{ cursor:'pointer' }}>{s}</span>
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
                <Link key={c.label} href={c.href} className="ft-link">{c.label}</Link>
              ))}
            </div>
          </div>

          {/* HELP */}
          <div>
            <div style={{ fontSize:11.5, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--gold)', marginBottom:16 }}>Help</div>
            <div style={{ display:'flex', flexDirection:'column', gap:11, fontSize:14 }}>
              <Link href="/track"   className="ft-link">Track order</Link>
              <Link href="/returns" className="ft-link">Returns &amp; exchange</Link>
              <Link href="/faq"     className="ft-link">FAQ</Link>
              <Link href="/contact" className="ft-link">Contact us</Link>
              <Link href="/account" className="ft-link">My account</Link>
            </div>
          </div>

          {/* THE HOUSE */}
          <div>
            <div style={{ fontSize:11.5, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--gold)', marginBottom:16 }}>The house</div>
            <div style={{ display:'flex', flexDirection:'column', gap:11, fontSize:14 }}>
              <Link href="/about"   className="ft-link">Our story</Link>
              <Link href="/journal" className="ft-link">Journal</Link>
              <Link href="/contact" className="ft-link">Contact</Link>
            </div>
          </div>

          {/* NEWSLETTER */}
          <div className="ft-news">
            <div style={{ fontSize:11.5, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--gold)', marginBottom:16 }}>Stay in the light</div>
            <p style={{ fontSize:13, fontWeight:300, marginBottom:14, lineHeight:1.6 }}>Early access to collections &amp; private events.</p>
            <div style={{ display:'flex', border:'1px solid rgba(201,192,176,0.3)', borderRadius:2, overflow:'hidden' }}>
              <input placeholder="Email address" style={{ flex:1, background:'transparent', border:'none', padding:'12px 14px', fontSize:13, color:'#fff', minWidth:0 }} />
              <button className="ft-send" aria-label="Subscribe">→</button>
            </div>
          </div>
        </div>

        <div style={{ borderTop:'1px solid rgba(201,192,176,0.16)', marginTop:40, paddingTop:24, display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:14, fontSize:12.5, color:'#9C9284' }}>
          <span>© 2026 Glya Fine Jewellery. All rights reserved.</span>
          <div style={{ display:'flex', gap:18, flexWrap:'wrap' }}>
            <Link href="/privacy" className="ft-link2">Privacy</Link>
            <Link href="/terms"   className="ft-link2">Terms</Link>
            <Link href="/returns" className="ft-link2">Returns</Link>
            <Link href="/faq"     className="ft-link2">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
