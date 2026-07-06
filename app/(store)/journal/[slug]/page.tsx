'use client';
import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { journalPosts, catalog, priceOf, inr } from '@/lib/catalog';
import { useStore } from '@/lib/store';
import ProductCard from '@/components/ProductCard';

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const adminJournal  = useStore(s => s.adminJournal);
  const adminProducts = useStore(s => s.adminProducts);
  const allProducts   = adminProducts.length > 0 ? adminProducts : catalog;
  const goldRate      = useStore(s => s.goldRate);

  // Merge admin metadata with static body content
  const staticArt = journalPosts.find(p => p.id === slug);
  const adminArt  = adminJournal.find(p => p.id === slug || p.slug === slug);
  const art = staticArt
    ? { ...staticArt, ...(adminArt ? { title: adminArt.title, date: adminArt.date, category: adminArt.category, author: adminArt.author, excerpt: adminArt.excerpt } : {}) }
    : adminArt
      ? { ...adminArt, read: '5 min read', authorRole: '', shop: [], lede: adminArt.excerpt, body: [] }
      : null;

  if (!art) return <div style={{padding:'60px 28px',textAlign:'center',fontFamily:"'Cormorant Garamond',serif",fontSize:30}}>Article not found.</div>;

  const shopProducts = (art.shop || []).map(id => allProducts.find(p => p.id === id)!).filter(Boolean);
  const allJournal = adminJournal.length > 0
    ? adminJournal.map(ap => ({ ...ap, read: journalPosts.find(s => s.id === ap.id)?.read || '5 min read' }))
    : journalPosts;
  const more = allJournal.filter(p => p.id !== art.id).slice(0, 3);

  return (
    <main style={{animation:'glyaFade 0.5s ease'}}>
      <article style={{maxWidth:760,margin:'0 auto',padding:'clamp(24px,3vw,44px) 28px 0'}}>
        <div style={{fontSize:12.5,letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--muted)',marginBottom:20}}>
          <Link href="/" style={{color:'var(--muted)',textDecoration:'none'}}>Home</Link> · <Link href="/journal" style={{color:'var(--muted)',textDecoration:'none'}}>Journal</Link> · <span style={{color:'var(--ink)'}}>{art.category}</span>
        </div>
        <div style={{fontSize:12,letterSpacing:'0.16em',textTransform:'uppercase',color:'var(--gold-d)',marginBottom:14}}>{art.category}</div>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:500,fontSize:'clamp(34px,5vw,58px)',lineHeight:1.03,letterSpacing:'-0.01em'}}>{art.title}</h1>
        <div style={{display:'flex',alignItems:'center',gap:14,fontSize:12.5,letterSpacing:'0.06em',textTransform:'uppercase',color:'var(--muted)',marginTop:20}}>
          <span>{art.author}</span>
          <span style={{width:4,height:4,borderRadius:'50%',background:'var(--gold)',display:'inline-block'}}></span>
          <span>{art.date}</span>
          <span style={{width:4,height:4,borderRadius:'50%',background:'var(--gold)',display:'inline-block'}}></span>
          <span>{art.read}</span>
        </div>
      </article>

      <div style={{ maxWidth:960, margin:'clamp(24px,3vw,36px) auto 0', padding:'0 clamp(16px,3vw,28px)' }}>
        <div style={{ width:'100%', aspectRatio:'16/9', background:'var(--paper2)', borderRadius:4, overflow:'hidden', border:'1px solid var(--line)', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', fontSize:80, color:'var(--line)' }}>
          {(art as any).coverImage
            ? <Image src={(art as any).coverImage} alt={art.title} fill sizes="(max-width:960px) 100vw,960px" style={{ objectFit:'cover' }} />
            : <span>◈</span>
          }
        </div>
      </div>

      <article style={{maxWidth:680,margin:'0 auto',padding:'clamp(28px,4vw,44px) 28px'}}>
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(20px,2.4vw,26px)',lineHeight:1.5,color:'var(--ink)',fontStyle:'italic',marginBottom:28}}>{art.lede}</p>
        {art.body.map((b, i) => (
          <div key={i}>
            {b.t==='h' && <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:500,fontSize:'clamp(24px,3vw,32px)',lineHeight:1.15,margin:'34px 0 4px'}}>{b.x}</h2>}
            {b.t==='p' && <p style={{color:'var(--ink2)',fontSize:17,lineHeight:1.8,fontWeight:300,marginTop:18}}>{b.x}</p>}
            {b.t==='q' && <blockquote style={{borderLeft:'2px solid var(--gold)',padding:'6px 0 6px 24px',margin:'28px 0',fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontStyle:'italic',lineHeight:1.4,color:'var(--ink)'}}>{b.x}</blockquote>}
          </div>
        ))}
        {/* AUTHOR */}
        <div style={{borderTop:'1px solid var(--line)',marginTop:36,paddingTop:24,display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
          <div style={{width:52,height:52,borderRadius:'50%',background:'var(--paper2)',border:'1px solid var(--line)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:'var(--gold-d)',flexShrink:0}}>
            {art.author.split(' ').map(w=>w[0]).join('')}
          </div>
          <div style={{flex:1,minWidth:180}}>
            <div style={{fontSize:15}}>{art.author}</div>
            <div style={{fontSize:13,color:'var(--muted)'}}>{art.authorRole}</div>
          </div>
          <div style={{display:'flex',gap:10,fontSize:12,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--muted)'}}>
            <span style={{cursor:'pointer',border:'1px solid var(--line)',padding:'8px 14px',borderRadius:2}}>Share</span>
            <span style={{cursor:'pointer',border:'1px solid var(--line)',padding:'8px 14px',borderRadius:2}}>Save</span>
          </div>
        </div>
      </article>

      {/* SHOP THE STORY */}
      {shopProducts.length > 0 && (
        <section style={{maxWidth:1000,margin:'0 auto',padding:'clamp(10px,2vw,20px) 28px clamp(20px,3vw,32px)'}}>
          <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:500,fontSize:'clamp(24px,3vw,32px)',textAlign:'center',marginBottom:24}}>Shop the story</h3>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'clamp(14px,2vw,24px)'}}>
            {shopProducts.map(p => <ProductCard key={p.id} product={p} goldRate={goldRate} size="sm" />)}
          </div>
        </section>
      )}

      {/* MORE STORIES */}
      <section style={{maxWidth:1360,margin:'0 auto',padding:'clamp(24px,4vw,44px) 28px clamp(30px,4vw,56px)',borderTop:'1px solid var(--line)'}}>
        <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:500,fontSize:'clamp(24px,3vw,34px)',marginBottom:24}}>More from the Journal</h3>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'clamp(18px,3vw,32px)'}}>
          {more.map(p => (
            <Link key={p.id} href={`/journal/${p.id}`} style={{textDecoration:'none',color:'inherit',cursor:'pointer'}}>
              <div style={{ width:'100%', aspectRatio:'3/2', background:'var(--paper2)', borderRadius:3, overflow:'hidden', border:'1px solid var(--line)', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', fontSize:44, color:'var(--line)' }}>
                {(p as any).coverImage
                  ? <Image src={(p as any).coverImage} alt={p.title} fill sizes="(max-width:700px) 100vw,33vw" style={{ objectFit:'cover' }} />
                  : <span>◈</span>
                }
              </div>
              <div style={{fontSize:11.5,letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--gold-d)',margin:'14px 0 7px'}}>{p.category}</div>
              <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:500,fontSize:22,lineHeight:1.15}}>{p.title}</h3>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
