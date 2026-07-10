'use client';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { inr } from '@/lib/catalog';

const COUPONS = [
  { code: 'GLYA10',  label: 'GLYA 10% off',  type: 'Percentage', desc: '10% discount, max ₹25,000' },
  { code: 'WELCOME', label: 'Welcome ₹5,000', type: 'Fixed',      desc: '₹5,000 flat off first order' },
];

const PLATINUM_RATE = 3380;

export default function AdminPricing() {
  const goldRate    = useStore(s => s.goldRate);
  const setGoldRate = useStore(s => s.setGoldRate);
  const orders      = useStore(s => s.orders);

  const [makingPct, setMakingPct] = useState(12);
  const [wastage,   setWastage]   = useState(5);
  const [pWeight,   setPWeight]   = useState(4.2);

  const rate22 = Math.round(goldRate * 0.916);
  const rate18 = Math.round(goldRate * 0.75);

  const mv       = Math.round(pWeight * rate22);
  const mk       = Math.round(mv * makingPct / 100);
  const wst      = Math.round(mv * wastage / 100);
  const sub      = mv + mk + wst;
  const gstAmt   = Math.round(sub * 0.03);
  const calcTotal = inr(sub + gstAmt);

  // Derive coupon stats from orders
  const couponStats = COUPONS.map(c => {
    const used    = orders.filter(o => o.couponCode === c.code);
    const savings = used.reduce((a, o) => a + o.discount, 0);
    return { ...c, used: used.length, savings };
  });

  const totalCouponSavings = couponStats.reduce((a, c) => a + c.savings, 0);

  return (
    <div style={{ animation:'glyaFade 0.4s ease' }}>
      <style>{`
        .pricing-grid { display:grid; grid-template-columns:1.2fr 1fr; gap:16px; }
        @media (max-width:860px){ .pricing-grid { grid-template-columns:1fr; } }
        .rate-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:12px; }
      `}</style>

      <div className="pricing-grid">
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

          {/* LIVE RATES */}
          <div style={{ background:'#fff', border:'1px solid #E7DFD2', borderRadius:6, padding:'clamp(16px,2vw,22px)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <div style={{ fontSize:13, letterSpacing:'0.06em', textTransform:'uppercase', fontWeight:500 }}>Live metal rates</div>
              <span style={{ fontSize:11.5, color:'#2F7A5B', display:'inline-flex', alignItems:'center', gap:5 }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:'#2F7A5B' }}></span>Live
              </span>
            </div>
            <div className="rate-grid">
              <div style={{ border:'1px solid #E7DFD2', borderRadius:4, padding:14 }}>
                <div style={{ fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'#6F6557' }}>Gold 24K · per g</div>
                <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:8 }}>
                  <span style={{ fontSize:18, color:'#6F6557' }}>₹</span>
                  <input type="number" value={goldRate} onChange={e => setGoldRate(Number(e.target.value))}
                    style={{ width:'100%', border:'none', borderBottom:'1px solid #E7DFD2', fontFamily:"'Cormorant Garamond',serif", fontSize:26, padding:'2px 0', background:'transparent' }} />
                </div>
              </div>
              <div style={{ border:'1px solid #E7DFD2', borderRadius:4, padding:14 }}>
                <div style={{ fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'#6F6557' }}>Gold 22K · derived</div>
                <div className="flash" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, marginTop:8 }}>{inr(rate22)}</div>
              </div>
              <div style={{ border:'1px solid #E7DFD2', borderRadius:4, padding:14 }}>
                <div style={{ fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'#6F6557' }}>Gold 18K · derived</div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, marginTop:8 }}>{inr(rate18)}</div>
              </div>
              <div style={{ border:'1px solid #E7DFD2', borderRadius:4, padding:14 }}>
                <div style={{ fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'#6F6557' }}>Platinum · per g</div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, marginTop:8 }}>{inr(PLATINUM_RATE)}</div>
              </div>
            </div>
          </div>

          {/* FORMULA SLIDERS */}
          <div style={{ background:'#fff', border:'1px solid #E7DFD2', borderRadius:6, padding:'clamp(16px,2vw,22px)' }}>
            <div style={{ fontSize:13, letterSpacing:'0.06em', textTransform:'uppercase', fontWeight:500, marginBottom:16 }}>Pricing formula</div>
            <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
              {[
                { label:`Making charges: ${makingPct}%`, value:makingPct, min:5,  max:25, onChange:(v:number)=>setMakingPct(v) },
                { label:`Wastage: ${wastage}%`,           value:wastage,   min:2,  max:12, onChange:(v:number)=>setWastage(v) },
                { label:`Sample weight: ${pWeight}g`,     value:pWeight,   min:1,  max:50, onChange:(v:number)=>setPWeight(v) },
              ].map(f => (
                <div key={f.label}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:8 }}><span>{f.label}</span></div>
                  <input type="range" min={f.min} max={f.max} step={1} value={f.value} onChange={e => f.onChange(Number(e.target.value))} style={{ width:'100%', accentColor:'#B08D57' }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CALCULATOR */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ background:'#211C17', color:'#EDE6D8', borderRadius:6, padding:'clamp(18px,2.5vw,26px)' }}>
            <div style={{ fontSize:12, letterSpacing:'0.12em', textTransform:'uppercase', color:'#B08D57' }}>Live price preview</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, color:'#fff', marginTop:6 }}>22K Gold Ring · {pWeight}g</div>
            <div style={{ display:'flex', flexDirection:'column', gap:12, marginTop:20, fontSize:14 }}>
              {[
                { label:'Metal value (22K)', val:inr(mv) },
                { label:`Making (${makingPct}%)`,  val:inr(mk) },
                { label:`Wastage (${wastage}%)`,   val:inr(wst) },
                { label:'GST (3%)',                val:inr(gstAmt) },
              ].map(r => (
                <div key={r.label} style={{ display:'flex', justifyContent:'space-between', color:'#C9C0B0' }}>
                  <span>{r.label}</span><span style={{ color:'#EDE6D8' }}>{r.val}</span>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', borderTop:'1px solid rgba(237,230,216,0.18)', marginTop:16, paddingTop:16 }}>
              <span style={{ fontSize:14, color:'#C9C0B0' }}>Retail price</span>
              <span className="flash" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(26px,3vw,34px)', color:'#fff' }}>{calcTotal}</span>
            </div>
            <div style={{ fontSize:12, color:'#A79E8E', marginTop:12 }}>Recalculated live across the catalog whenever rates change.</div>
          </div>
        </div>
      </div>

      {/* COUPON CODES — real data from store */}
      <div style={{ background:'#fff', border:'1px solid #E7DFD2', borderRadius:6, marginTop:16, overflow:'hidden' }}>
        <div style={{ padding:'16px 22px', borderBottom:'1px solid #E7DFD2', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
          <div style={{ fontSize:13, letterSpacing:'0.06em', textTransform:'uppercase', fontWeight:500 }}>Coupon codes</div>
          <div style={{ fontSize:13, color:'#6F6557' }}>Total savings given: {inr(totalCouponSavings)}</div>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13.5 }}>
            <thead>
              <tr style={{ borderBottom:'1px solid #E7DFD2' }}>
                {['Code','Type','Terms','Orders used','Total saved','Status'].map(h => (
                  <th key={h} style={{ padding:'11px 20px', textAlign:'left', fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'#6F6557', fontWeight:500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {couponStats.map(c => (
                <tr key={c.code} style={{ borderBottom:'1px solid #EFEAE0' }}>
                  <td style={{ padding:'14px 20px', fontFamily:'monospace', fontSize:14, fontWeight:600, color:'#B08D57', letterSpacing:'0.06em' }}>{c.code}</td>
                  <td style={{ padding:'14px 20px', color:'#4A423A' }}>{c.type}</td>
                  <td style={{ padding:'14px 20px', color:'#6A6058', fontSize:13 }}>{c.desc}</td>
                  <td style={{ padding:'14px 20px', fontFamily:"'Cormorant Garamond',serif", fontSize:20 }}>{c.used}</td>
                  <td style={{ padding:'14px 20px', fontFamily:"'Cormorant Garamond',serif", fontSize:20 }}>{inr(c.savings)}</td>
                  <td style={{ padding:'14px 20px' }}>
                    <span style={{ fontSize:11, letterSpacing:'0.05em', textTransform:'uppercase', color:'#2F7A5B', background:'rgba(47,122,91,0.08)', padding:'4px 9px', borderRadius:3 }}>Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
