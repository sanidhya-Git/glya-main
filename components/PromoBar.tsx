'use client';
import { useStore } from '@/lib/store';
import { inr } from '@/lib/catalog';

export default function PromoBar() {
  const goldRate = useStore(s => s.goldRate);
  const rate22 = Math.round(goldRate * 0.916);

  return (
    <div style={{background:'var(--ink)',color:'#EDE6D8',fontSize:12,letterSpacing:'0.14em',textTransform:'uppercase',display:'flex',justifyContent:'center',alignItems:'center',gap:26,padding:'9px 20px',flexWrap:'wrap'}}>
      <span style={{opacity:0.85}}>Complimentary insured shipping</span>
      <span style={{opacity:0.4}}>·</span>
      <span style={{opacity:0.85}}>Lifetime exchange &amp; buyback</span>
      <span style={{opacity:0.4}}>·</span>
      <span style={{display:'inline-flex',alignItems:'center',gap:8}}>
        <span style={{width:6,height:6,borderRadius:'50%',background:'#7FB08A',boxShadow:'0 0 0 3px rgba(127,176,138,0.25)'}}></span>
        Live 22K gold <b style={{fontWeight:500,color:'#fff'}} className="flash">{inr(rate22)}/g</b>
      </span>
    </div>
  );
}
