'use client';
import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import type { AdminPost } from '@/lib/api';
import ProductCard from '@/components/ProductCard';

const ADMIN_BASE = process.env.NEXT_PUBLIC_GLYA_API_BASE ?? process.env.NEXT_PUBLIC_ADMIN_API ?? 'http://localhost:3001';

async function fetchAdminJournalPost(id: string): Promise<AdminPost | null> {
  try {
    const res = await fetch(`${ADMIN_BASE}/api/journal/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function readTimeOf(body: string, excerpt: string): string {
  const text = `${body} ${excerpt}`.replace(/<[^>]+>/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(2, Math.ceil(words / 200))} min read`;
}

const P_STYLE: React.CSSProperties = { color:'var(--ink2)', fontSize:17, lineHeight:1.8, fontWeight:300, marginTop:18 };

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const adminJournal  = useStore(s => s.adminJournal);
  const journalLoaded = useStore(s => s.journalLoaded);
  const adminProducts = useStore(s => s.adminProducts);

  const listPost = adminJournal.find(p => p.slug === slug || p.id === slug) ?? null;

  const [fullPost, setFullPost] = useState<AdminPost | null>(null);
  const [bodyLoading, setBodyLoading] = useState(false);

  const postId = listPost?.id;
  const listHasBody = Boolean(listPost?.body && listPost.body.trim());

  useEffect(() => {
    setFullPost(null);
    if (!postId || listHasBody) return;
    let cancelled = false;
    setBodyLoading(true);
    fetchAdminJournalPost(postId).then(p => {
      if (cancelled) return;
      if (p && (!p.id || p.id === postId)) setFullPost(p);
      setBodyLoading(false);
    });
    return () => { cancelled = true; };
  }, [postId, listHasBody]);

  /* ── LOADING ── */
  if (!journalLoaded) {
    return (
      <main style={{ animation:'glyaFade 0.5s ease' }}>
        <style>{`
          .journal-skel {
            background:linear-gradient(100deg, var(--paper2) 30%, #F3EDE1 50%, var(--paper2) 70%);
            background-size:200% 100%;
            animation:journalShimmer 1.8s ease-in-out infinite;
            border:1px solid var(--line); border-radius:3px;
          }
          @keyframes journalShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        `}</style>
        <article style={{ maxWidth:760, margin:'0 auto', padding:'clamp(24px,3vw,44px) 28px 0' }}>
          <div className="journal-skel" style={{ width:180, height:12, marginBottom:22 }} />
          <div className="journal-skel" style={{ width:'88%', height:44, marginBottom:12 }} />
          <div className="journal-skel" style={{ width:'62%', height:44, marginBottom:24 }} />
          <div className="journal-skel" style={{ width:280, height:13 }} />
        </article>
        <div style={{ maxWidth:960, margin:'clamp(24px,3vw,36px) auto 0', padding:'0 clamp(16px,3vw,28px)' }}>
          <div className="journal-skel" style={{ width:'100%', aspectRatio:'16/9', borderRadius:4 }} />
        </div>
        <div style={{ maxWidth:680, margin:'0 auto', padding:'clamp(28px,4vw,44px) 28px', textAlign:'center', fontSize:12, letterSpacing:'0.22em', textTransform:'uppercase', color:'var(--muted)' }}>
          Turning the page…
        </div>
      </main>
    );
  }

  /* ── NOT FOUND ── */
  if (!listPost) {
    return (
      <main style={{ animation:'glyaFade 0.5s ease' }}>
        <section style={{ maxWidth:640, margin:'0 auto', padding:'clamp(56px,9vw,120px) 28px', textAlign:'center' }}>
          <div style={{ fontSize:44, color:'var(--gold)', marginBottom:20 }}>◈</div>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:500, fontSize:'clamp(28px,4vw,44px)', lineHeight:1.08 }}>This story has slipped away.</h1>
          <p style={{ color:'var(--ink2)', fontSize:15.5, lineHeight:1.7, fontWeight:300, margin:'16px auto 28px', maxWidth:420 }}>
            The article you are looking for is no longer published, or the link may be incorrect.
          </p>
          <Link href="/journal" style={{ textDecoration:'none', display:'inline-block', background:'var(--ink)', color:'#F7F2E8', padding:'13px 28px', fontSize:12.5, letterSpacing:'0.12em', textTransform:'uppercase', borderRadius:2 }}>
            Back to the Journal
          </Link>
        </section>
      </main>
    );
  }

  const art  = fullPost && String(fullPost.id) === String(listPost.id) ? { ...listPost, ...fullPost } : listPost;
  const body = (art.body || '').trim();
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(body);
  const paragraphs = isHtml ? [] : body.split(/\n{2,}/).map(s => s.trim()).filter(Boolean);

  const shopIds: Array<string | number> = Array.isArray((art as any).shop) ? (art as any).shop : [];
  const shopProducts = shopIds
    .map(id => adminProducts.find(p => String(p.id) === String(id)))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const more = adminJournal.filter(p => p.id !== art.id).slice(0, 3);

  return (
    <main style={{animation:'glyaFade 0.5s ease'}}>
      <style>{`
        .journal-skel {
          background:linear-gradient(100deg, var(--paper2) 30%, #F3EDE1 50%, var(--paper2) 70%);
          background-size:200% 100%;
          animation:journalShimmer 1.8s ease-in-out infinite;
          border:1px solid var(--line); border-radius:3px;
        }
        @keyframes journalShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .journal-body p { color:var(--ink2); font-size:17px; line-height:1.8; font-weight:300; margin-top:18px; }
        .journal-body h1, .journal-body h2, .journal-body h3 {
          font-family:'Cormorant Garamond',serif; font-weight:500;
          font-size:clamp(24px,3vw,32px); line-height:1.15; margin:34px 0 4px;
        }
        .journal-body blockquote {
          border-left:2px solid var(--gold); padding:6px 0 6px 24px; margin:28px 0;
          font-family:'Cormorant Garamond',serif; font-size:24px; font-style:italic;
          line-height:1.4; color:var(--ink);
        }
        .journal-body ul, .journal-body ol { margin:18px 0 0 22px; color:var(--ink2); font-size:17px; line-height:1.8; font-weight:300; }
        .journal-body img { max-width:100%; border-radius:4px; margin-top:22px; }
        .journal-body a { color:var(--gold-d); }
      `}</style>

      <article style={{maxWidth:760,margin:'0 auto',padding:'clamp(24px,3vw,44px) 28px 0'}}>
        <div style={{fontSize:12.5,letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--muted)',marginBottom:20}}>
          <Link href="/" style={{color:'var(--muted)',textDecoration:'none'}}>Home</Link> · <Link href="/journal" style={{color:'var(--muted)',textDecoration:'none'}}>Journal</Link> · <span style={{color:'var(--ink)'}}>{art.category}</span>
        </div>
        <div style={{fontSize:12,letterSpacing:'0.16em',textTransform:'uppercase',color:'var(--gold-d)',marginBottom:14}}>{art.category}</div>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:500,fontSize:'clamp(34px,5vw,58px)',lineHeight:1.03,letterSpacing:'-0.01em'}}>{art.title}</h1>
        <div style={{display:'flex',alignItems:'center',gap:14,fontSize:12.5,letterSpacing:'0.06em',textTransform:'uppercase',color:'var(--muted)',marginTop:20,flexWrap:'wrap'}}>
          <span>{art.author}</span>
          <span style={{width:4,height:4,borderRadius:'50%',background:'var(--gold)',display:'inline-block'}}></span>
          <span>{art.date}</span>
          <span style={{width:4,height:4,borderRadius:'50%',background:'var(--gold)',display:'inline-block'}}></span>
          <span>{readTimeOf(body, art.excerpt || '')}</span>
        </div>
      </article>

      <div style={{ maxWidth:960, margin:'clamp(24px,3vw,36px) auto 0', padding:'0 clamp(16px,3vw,28px)' }}>
        <div style={{ width:'100%', aspectRatio:'16/9', background:'var(--paper2)', borderRadius:4, overflow:'hidden', border:'1px solid var(--line)', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', fontSize:80, color:'var(--line)' }}>
          {art.coverImage
            ? <Image src={art.coverImage} alt={art.title} fill sizes="(max-width:960px) 100vw,960px" style={{ objectFit:'cover' }} />
            : <span>◈</span>
          }
        </div>
      </div>

      <article style={{maxWidth:680,margin:'0 auto',padding:'clamp(28px,4vw,44px) 28px'}}>
        {art.excerpt && (
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(20px,2.4vw,26px)',lineHeight:1.5,color:'var(--ink)',fontStyle:'italic',marginBottom:28}}>{art.excerpt}</p>
        )}

        {body
          ? (isHtml
              ? <div className="journal-body" dangerouslySetInnerHTML={{ __html: body }} />
              : paragraphs.map((p, i) => <p key={i} style={P_STYLE}>{p}</p>))
          : bodyLoading
            ? (
              <div>
                <div className="journal-skel" style={{ width:'100%', height:14, marginTop:18 }} />
                <div className="journal-skel" style={{ width:'96%', height:14, marginTop:12 }} />
                <div className="journal-skel" style={{ width:'88%', height:14, marginTop:12 }} />
                <div className="journal-skel" style={{ width:'92%', height:14, marginTop:30 }} />
                <div className="journal-skel" style={{ width:'70%', height:14, marginTop:12 }} />
              </div>
            )
            : null}

        {/* AUTHOR */}
        <div style={{borderTop:'1px solid var(--line)',marginTop:36,paddingTop:24,display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
          <div style={{width:52,height:52,borderRadius:'50%',background:'var(--paper2)',border:'1px solid var(--line)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:'var(--gold-d)',flexShrink:0}}>
            {(art.author || 'G').split(' ').map(w=>w[0]).join('')}
          </div>
          <div style={{flex:1,minWidth:180}}>
            <div style={{fontSize:15}}>{art.author}</div>
            <div style={{fontSize:13,color:'var(--muted)'}}>The Glya Journal</div>
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
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(200px,38vw),1fr))',gap:'clamp(14px,2vw,24px)'}}>
            {shopProducts.map(p => <ProductCard key={p.id} product={p} size="sm" />)}
          </div>
        </section>
      )}

      {/* MORE STORIES */}
      {more.length > 0 && (
        <section style={{maxWidth:1360,margin:'0 auto',padding:'clamp(24px,4vw,44px) 28px clamp(30px,4vw,56px)',borderTop:'1px solid var(--line)'}}>
          <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:500,fontSize:'clamp(24px,3vw,34px)',marginBottom:24}}>More from the Journal</h3>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'clamp(18px,3vw,32px)'}}>
            {more.map(p => (
              <Link key={p.id} href={`/journal/${p.slug || p.id}`} style={{textDecoration:'none',color:'inherit',cursor:'pointer'}}>
                <div style={{ width:'100%', aspectRatio:'3/2', background:'var(--paper2)', borderRadius:3, overflow:'hidden', border:'1px solid var(--line)', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', fontSize:44, color:'var(--line)' }}>
                  {p.coverImage
                    ? <Image src={p.coverImage} alt={p.title} fill sizes="(max-width:700px) 100vw,33vw" style={{ objectFit:'cover' }} />
                    : <span>◈</span>
                  }
                </div>
                <div style={{fontSize:11.5,letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--gold-d)',margin:'14px 0 7px'}}>{p.category}</div>
                <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:500,fontSize:22,lineHeight:1.15}}>{p.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
