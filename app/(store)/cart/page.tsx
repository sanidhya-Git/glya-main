'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { catalog, priceOf, inr } from '@/lib/catalog';

export default function CartPage() {
  const router = useRouter();
  const { cart, changeQty, removeItem, coupon, setCoupon, couponApplied, applyCoupon, giftWrap, toggleGiftWrap, insurance, toggleInsurance } = useStore();
  const goldRate = useStore(s => s.goldRate);

  const items = cart.map(it => {
    const p = catalog.find(x => x.id === it.id)!;
    const pr = priceOf(p, it.karat, goldRate);
    const qty = it.qty;
    const line = pr.total * qty;
    return { ...it, p, priceStr: inr(pr.total), lineStr: inr(line), lineNum: line, metalLabel: it.karat === 'PT950' ? 'Platinum 950' : it.karat + ' Gold' };
  });

  const subtotal = items.reduce((a, b) => a + b.lineNum, 0);
  let discount = 0;
  if (couponApplied && !couponApplied.invalid) {
    if (couponApplied.type === 'pct') discount = Math.min(Math.round(subtotal * 0.10), 25000);
    else discount = Math.min(couponApplied.amount || 0, subtotal);
  }
  const giftWrapAmt = giftWrap ? 299 : 0;
  const insuranceAmt = insurance ? 499 : 0;
  const total = subtotal - discount + giftWrapAmt + insuranceAmt;

  if (items.length === 0) {
    return (
      <main style={{maxWidth:1200,margin:'0 auto',padding:'clamp(24px,3vw,48px) 28px',animation:'glyaFade 0.5s ease'}}>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:500,fontSize:'clamp(34px,4.4vw,52px)'}}>Your bag</h1>
        <div style={{textAlign:'center',padding:'90px 20px'}}>
          <div style={{fontSize:44,color:'var(--line)'}}>⛊</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:30,marginTop:14}}>Your bag is empty</div>
          <p style={{color:'var(--muted)',marginTop:8}}>Discover pieces made to be lived in.</p>
          <Link href="/browse" style={{marginTop:22,display:'inline-block',cursor:'pointer',background:'var(--ink)',color:'#F7F2E8',padding:'15px 30px',fontSize:12.5,letterSpacing:'0.12em',textTransform:'uppercase',borderRadius:2,textDecoration:'none'}}>Start shopping</Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{maxWidth:1200,margin:'0 auto',padding:'clamp(24px,3vw,48px) 28px',animation:'glyaFade 0.5s ease'}}>
      <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:500,fontSize:'clamp(34px,4.4vw,52px)'}}>Your bag</h1>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:'clamp(24px,4vw,48px)',alignItems:'start',marginTop:28}}>
        <div>
          {items.map(i => (
            <div key={i.key} style={{display:'flex',gap:18,padding:'22px 0',borderBottom:'1px solid var(--line)'}}>
              <div style={{width:110,height:130,flexShrink:0,background:'var(--paper2)',borderRadius:3,display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,color:'var(--line)',border:'1px solid var(--line)'}}>◈</div>
              <div style={{flex:1,display:'flex',flexDirection:'column'}}>
                <div style={{display:'flex',justifyContent:'space-between',gap:10}}>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,lineHeight:1.1}}>{i.p.name}</div>
                  <div style={{fontSize:16,fontWeight:500,whiteSpace:'nowrap'}}>{i.lineStr}</div>
                </div>
                <div style={{fontSize:12,letterSpacing:'0.06em',textTransform:'uppercase',color:'var(--muted)',marginTop:6}}>{i.metalLabel}</div>
                {i.size && <div style={{fontSize:13,color:'var(--ink2)',marginTop:4}}>Size · {i.size}</div>}
                {i.engraving && <div style={{fontSize:13,color:'var(--gold-d)',fontStyle:'italic',fontFamily:"'Cormorant Garamond',serif",marginTop:4}}>Engraved · &quot;{i.engraving}&quot;</div>}
                <div style={{display:'flex',alignItems:'center',gap:18,marginTop:'auto',paddingTop:14}}>
                  <div style={{display:'flex',alignItems:'center',border:'1px solid var(--line)',borderRadius:2}}>
                    <button onClick={() => changeQty(i.key,-1)} style={{cursor:'pointer',background:'none',border:'none',width:34,height:34,fontSize:16}}>−</button>
                    <span style={{width:30,textAlign:'center',fontSize:14}}>{i.qty}</span>
                    <button onClick={() => changeQty(i.key,1)} style={{cursor:'pointer',background:'none',border:'none',width:34,height:34,fontSize:16}}>+</button>
                  </div>
                  <button onClick={() => removeItem(i.key)} style={{cursor:'pointer',background:'none',border:'none',fontSize:12.5,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--muted)',borderBottom:'1px solid var(--line)'}}>Remove</button>
                </div>
              </div>
            </div>
          ))}

          {/* GIFT OPTIONS */}
          <div style={{marginTop:26,display:'flex',flexDirection:'column',gap:12}}>
            <div onClick={toggleGiftWrap} style={{cursor:'pointer',display:'flex',alignItems:'center',gap:14,border:`1px solid ${giftWrap?'var(--gold)':'var(--line)'}`,borderRadius:3,padding:'16px 18px'}}>
              <span style={{width:20,height:20,border:'1px solid var(--ink)',borderRadius:2,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,flexShrink:0}}>{giftWrap?'✓':''}</span>
              <div style={{flex:1}}><div style={{fontSize:15}}>Signature gift wrapping</div><div style={{fontSize:12.5,color:'var(--muted)'}}>Hand-tied ribbon in a lacquered box</div></div>
              <div style={{fontSize:14}}>+ ₹299</div>
            </div>
            <div onClick={toggleInsurance} style={{cursor:'pointer',display:'flex',alignItems:'center',gap:14,border:`1px solid ${insurance?'var(--gold)':'var(--line)'}`,borderRadius:3,padding:'16px 18px'}}>
              <span style={{width:20,height:20,border:'1px solid var(--ink)',borderRadius:2,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,flexShrink:0}}>{insurance?'✓':''}</span>
              <div style={{flex:1}}><div style={{fontSize:15}}>Shipment protection</div><div style={{fontSize:12.5,color:'var(--muted)'}}>Full-value transit insurance</div></div>
              <div style={{fontSize:14}}>+ ₹499</div>
            </div>
          </div>
        </div>

        {/* SUMMARY */}
        <div style={{background:'var(--paper2)',borderRadius:4,padding:28,position:'sticky',top:96}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,marginBottom:18}}>Order summary</div>
          <div style={{display:'flex',gap:8,marginBottom:18}}>
            <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Promo code"
              style={{flex:1,border:'1px solid var(--line)',background:'var(--paper)',padding:'12px 14px',fontSize:13.5,borderRadius:2}} />
            <button onClick={applyCoupon} style={{cursor:'pointer',background:'var(--ink)',color:'#F7F2E8',border:'none',padding:'0 20px',fontSize:12,letterSpacing:'0.1em',textTransform:'uppercase',borderRadius:2}}>Apply</button>
          </div>
          {couponApplied && (
            <div style={{fontSize:12.5,color:couponApplied.invalid?'#B4553B':'var(--em)',margin:'-8px 0 16px'}}>
              {couponApplied.invalid ? `"${couponApplied.code}" is not a valid code` : `Code ${couponApplied.code} applied!`}
            </div>
          )}
          <div style={{display:'flex',flexDirection:'column',gap:12,fontSize:14.5,borderTop:'1px solid var(--line)',paddingTop:18}}>
            <div style={{display:'flex',justifyContent:'space-between',color:'var(--ink2)'}}><span>Subtotal ({items.reduce((a,b)=>a+b.qty,0)} items)</span><span>{inr(subtotal)}</span></div>
            {discount > 0 && <div style={{display:'flex',justifyContent:'space-between',color:'var(--em)'}}><span>Discount</span><span>− {inr(discount)}</span></div>}
            {giftWrap && <div style={{display:'flex',justifyContent:'space-between',color:'var(--ink2)'}}><span>Gift wrapping</span><span>{inr(299)}</span></div>}
            {insurance && <div style={{display:'flex',justifyContent:'space-between',color:'var(--ink2)'}}><span>Shipment protection</span><span>{inr(499)}</span></div>}
            <div style={{display:'flex',justifyContent:'space-between',color:'var(--ink2)'}}><span>Shipping</span><span style={{color:'var(--em)'}}>Complimentary</span></div>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',borderTop:'1px solid var(--line)',marginTop:18,paddingTop:18}}>
            <span style={{fontSize:16}}>Total</span>
            <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:500}}>{inr(total)}</span>
          </div>
          <div style={{fontSize:12,color:'var(--muted)',marginTop:4}}>Inclusive of all taxes</div>
          <button onClick={() => router.push('/checkout')} style={{cursor:'pointer',width:'100%',marginTop:22,background:'var(--ink)',color:'#F7F2E8',border:'none',padding:18,fontSize:13,letterSpacing:'0.14em',textTransform:'uppercase',borderRadius:2}}
            onMouseEnter={e => (e.currentTarget.style.background='var(--gold-d)')}
            onMouseLeave={e => (e.currentTarget.style.background='var(--ink)')}
          >Secure checkout</button>
          <div style={{textAlign:'center',marginTop:14,fontSize:12,color:'var(--muted)'}}>🔒 256-bit encrypted · Razorpay · Stripe · UPI</div>
        </div>
      </div>
    </main>
  );
}
