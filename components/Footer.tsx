'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{background:'var(--ink)',color:'#C9C0B0',marginTop:'clamp(40px,6vw,90px)'}}>
      <div style={{maxWidth:1360,margin:'0 auto',padding:'clamp(40px,5vw,70px) 28px'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:36}}>
          <div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:30,letterSpacing:'0.3em',paddingLeft:'0.3em',color:'#fff'}}>GLYA</div>
            <p style={{marginTop:16,fontSize:14,lineHeight:1.7,fontWeight:300,maxWidth:260}}>Certified fine jewelry, priced transparently to the live gold rate. Designed and hallmarked in India.</p>
          </div>
          <div>
            <div style={{fontSize:11.5,letterSpacing:'0.16em',textTransform:'uppercase',color:'var(--gold)',marginBottom:16}}>Shop</div>
            <div style={{display:'flex',flexDirection:'column',gap:11,fontSize:14}}>
              {['Rings','Necklaces','Bangles','Bridal','Gifting'].map(c => (
                <Link key={c} href={`/browse?cat=${c}`} style={{color:'#C9C0B0',textDecoration:'none'}}
                  onMouseEnter={e => (e.currentTarget.style.color='var(--gold)')}
                  onMouseLeave={e => (e.currentTarget.style.color='#C9C0B0')}
                >{c}</Link>
              ))}
            </div>
          </div>
          <div>
            <div style={{fontSize:11.5,letterSpacing:'0.16em',textTransform:'uppercase',color:'var(--gold)',marginBottom:16}}>Assurance</div>
            <div style={{display:'flex',flexDirection:'column',gap:11,fontSize:14}}>
              {['Certification','Lifetime exchange','Buyback policy','Care & repairs','Track order'].map(c => (
                <span key={c} style={{cursor:'pointer'}}>{c}</span>
              ))}
            </div>
          </div>
          <div>
            <div style={{fontSize:11.5,letterSpacing:'0.16em',textTransform:'uppercase',color:'var(--gold)',marginBottom:16}}>The house</div>
            <div style={{display:'flex',flexDirection:'column',gap:11,fontSize:14}}>
              <span style={{cursor:'pointer'}}>Our story</span>
              <Link href="/journal" style={{color:'#C9C0B0',textDecoration:'none'}}>Journal</Link>
              <span style={{cursor:'pointer'}}>Stores</span>
              <span style={{cursor:'pointer'}}>Careers</span>
              <span style={{cursor:'pointer'}}>Contact</span>
            </div>
          </div>
          <div>
            <div style={{fontSize:11.5,letterSpacing:'0.16em',textTransform:'uppercase',color:'var(--gold)',marginBottom:16}}>Stay in the light</div>
            <p style={{fontSize:13.5,fontWeight:300,marginBottom:12}}>Early access to collections &amp; private events.</p>
            <div style={{display:'flex',border:'1px solid rgba(201,192,176,0.3)',borderRadius:2,overflow:'hidden'}}>
              <input placeholder="Email address" style={{flex:1,background:'transparent',border:'none',padding:'12px 14px',fontSize:13.5,color:'#fff'}} />
              <button style={{cursor:'pointer',background:'var(--gold)',border:'none',color:'var(--ink)',padding:'0 18px',fontSize:16}}>→</button>
            </div>
          </div>
        </div>
        <div style={{borderTop:'1px solid rgba(201,192,176,0.16)',marginTop:40,paddingTop:24,display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:14,fontSize:12.5,color:'#8B8272'}}>
          <span>© 2026 Glya Fine Jewellery. All rights reserved.</span>
          <span style={{display:'flex',gap:18,flexWrap:'wrap'}}>
            {['Privacy','Terms','Shipping','Returns'].map(l => <span key={l} style={{cursor:'pointer'}}>{l}</span>)}
          </span>
        </div>
      </div>
    </footer>
  );
}
