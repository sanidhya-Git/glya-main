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

const P_STYLE: React.CSSProperties = { color:'var(--ink2)', fontSize:17, lineHeight:1.85, fontWeight:300, marginTop:20 };

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const adminJournal  = useStore(s => s.adminJournal);
  const journalLoaded = useStore(s => s.journalLoaded);
  const adminProducts = useStore(s => s.adminProducts);

  const listPost = adminJournal.find(p => p.slug === slug || p.id === slug) ?? null;

  const [fullPost, setFullPost] = useState<AdminPost | null>(null);
  const [bodyLoading, setBodyLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [shared, setShared] = useState(false);

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

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2200);
    } catch { /* user dismissed the share sheet */ }
  };

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
        .journal-body p { color:var(--ink2); font-size:17px; line-height:1.85; font-weight:300; margin-top:20px; }
        .journal-body > p:first-of-type::first-letter, p.jdrop::first-letter {
          font-family:'Cormorant Garamond',serif; font-size:3.4em; line-height:0.82;
          float:left; padding:6px 10px 0 0; color:var(--gold-d); font-weight:500;
        }
        .journal-body h1, .journal-body h2, .journal-body h3 {
          font-family:'Cormorant Garamond',serif; font-weight:500;
          font-size:clamp(24px,3vw,32px); line-height:1.15; margin:38px 0 4px;
        }
        .journal-body blockquote {
          border-left:2px solid var(--gold); padding:6px 0 6px 26px; margin:32px 0;
          font-family:'Cormorant Garamond',serif; font-size:25px; font-style:italic;
          line-height:1.4; color:var(--ink);
        }
        .journal-body ul, .journal-body ol { margin:20px 0 0 22px; color:var(--ink2); font-size:17px; line-height:1.85; font-weight:300; }
        .journal-body img { max-width:100%; border-radius:18px; margin-top:24px; }
        .journal-body a { color:var(--gold-d); }
        .jimg { transition:transform 1s cubic-bezier(.22,.61,.21,1); }
        .jcard:hover .jimg { transform:scale(1.05); }
        .jcard .jtitle { transition:color .25s ease; }
        .jcard:hover .jtitle { color:var(--gold-d); }
        .jshare { transition:border-color .2s ease, color .2s ease; }
        .jshare:hover { border-color:var(--gold-d); color:var(--gold-d); }

        .jhero { display:grid; grid-template-columns:1fr 1.05fr; gap:clamp(28px,5vw,76px); align-items:center; }
        @media (max-width:900px) { .jhero { grid-template-columns:1fr; gap:26px; } }

        .jlayout { display:grid; grid-template-columns:224px minmax(0,1fr); gap:clamp(36px,6vw,88px); align-items:start; }
        .jrail { position:sticky; top:96px; }
        @media (max-width:900px) {
          .jlayout { grid-template-columns:1fr; gap:28px; }
          .jrail {
            position:static; display:flex; flex-wrap:wrap; align-items:center; gap:14px 24px;
            border-top:1px solid var(--line); border-bottom:1px solid var(--line); padding:14px 0;
          }
          .jrail-block { margin:0 !important; padding:0 !important; border:none !important; }
        }
      `}</style>

      {/* READING PROGRESS */}
      <div style={{ position:'fixed', top:0, left:0, right:0, height:2, zIndex:60, pointerEvents:'none' }}>
        <div style={{ width:`${progress}%`, height:'100%', background:'var(--gold-d)', transition:'width .12s linear' }} />
      </div>

      {/* HERO — text left, image right */}
      <section style={{maxWidth:1360,margin:'0 auto',padding:'clamp(24px,3.5vw,56px) clamp(16px,3vw,28px) 0'}}>
        <div className="jhero">
          <div>
            <div style={{fontSize:12.5,letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--muted)',marginBottom:26}}>
              <Link href="/" style={{color:'var(--muted)',textDecoration:'none'}}>Home</Link> · <Link href="/journal" style={{color:'var(--muted)',textDecoration:'none'}}>Journal</Link> · <span style={{color:'var(--ink)'}}>{art.category}</span>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:12,fontSize:12,letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--gold-d)',marginBottom:18}}>
              <span style={{width:28,height:1,background:'var(--gold)',display:'inline-block'}} />
              <span>{art.category}</span>
            </div>
            <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:500,fontSize:'clamp(32px,3.6vw,54px)',lineHeight:1.04,letterSpacing:'-0.015em'}}>{art.title}</h1>
            {art.excerpt && (
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(18px,1.7vw,23px)',lineHeight:1.55,color:'var(--ink2)',fontStyle:'italic',marginTop:20,maxWidth:520}}>{art.excerpt}</p>
            )}
            <div style={{display:'flex',alignItems:'center',gap:14,fontSize:12.5,letterSpacing:'0.06em',textTransform:'uppercase',color:'var(--muted)',marginTop:26,paddingTop:20,borderTop:'1px solid var(--line)',flexWrap:'wrap'}}>
              <span style={{color:'var(--ink)'}}>{art.author}</span>
              <span style={{width:4,height:4,borderRadius:'50%',background:'var(--gold)',display:'inline-block'}}></span>
              <span>{art.date}</span>
              <span style={{width:4,height:4,borderRadius:'50%',background:'var(--gold)',display:'inline-block'}}></span>
              <span>{readTimeOf(body, art.excerpt || '')}</span>
            </div>
          </div>
          <div style={{ width:'100%', aspectRatio:'4/3', background:'var(--paper2)', borderRadius:'clamp(20px,2.4vw,32px)', overflow:'hidden', border:'1px solid var(--line)', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', fontSize:80, color:'var(--line)' }}>
            {art.coverImage
              ? <Image src={art.coverImage} alt={art.title} fill priority sizes="(max-width:900px) 100vw,52vw" style={{ objectFit:'cover' }} />
              : <span>◈</span>
            }
          </div>
        </div>
      </section>

      {/* BODY — sticky author rail left, article right */}
      <section style={{maxWidth:1160,margin:'0 auto',padding:'clamp(32px,5vw,64px) clamp(16px,3vw,28px) clamp(28px,4vw,48px)'}}>
        <div className="jlayout">
          <aside className="jrail">
            <div className="jrail-block" style={{display:'flex',alignItems:'center',gap:14}}>
              <div style={{width:50,height:50,borderRadius:'50%',background:'var(--paper2)',border:'1px solid var(--gold)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Cormorant Garamond',serif",fontSize:19,color:'var(--gold-d)',flexShrink:0}}>
                {(art.author || 'G').split(' ').map(w=>w[0]).join('')}
              </div>
              <div>
                <div style={{fontSize:14.5,color:'var(--ink)'}}>{art.author}</div>
                <div style={{fontSize:11.5,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--muted)',marginTop:2}}>The Glya Journal</div>
              </div>
            </div>
            <div className="jrail-block" style={{margin:'22px 0 0',paddingTop:20,borderTop:'1px solid var(--line)',display:'flex',flexDirection:'column',gap:10,fontSize:12,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--muted)'}}>
              <span>{art.date}</span>
              <span>{readTimeOf(body, art.excerpt || '')}</span>
            </div>
            <div className="jrail-block" style={{margin:'22px 0 0',paddingTop:20,borderTop:'1px solid var(--line)',display:'flex',flexDirection:'column',gap:12,alignItems:'flex-start'}}>
              <button onClick={share} className="jshare" style={{cursor:'pointer',background:'transparent',border:'1px solid var(--line)',padding:'10px 18px',borderRadius:2,fontSize:12,letterSpacing:'0.12em',textTransform:'uppercase',color:'var(--muted)'}}>
                {shared ? 'Link copied ✓' : 'Share'}
              </button>
              <Link href="/journal" style={{fontSize:12,letterSpacing:'0.12em',textTransform:'uppercase',color:'var(--gold-d)',textDecoration:'none'}}>← All stories</Link>
            </div>
          </aside>

          <article style={{minWidth:0,maxWidth:720}}>
            {body
              ? (isHtml
                  ? <div className="journal-body" dangerouslySetInnerHTML={{ __html: body }} />
                  : paragraphs.map((p, i) => <p key={i} className={i === 0 ? 'jdrop' : undefined} style={P_STYLE}>{p}</p>))
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

            {/* END ORNAMENT */}
            <div style={{textAlign:'center',margin:'44px 0 0',display:'flex',alignItems:'center',gap:18,justifyContent:'center'}}>
              <span style={{width:56,height:1,background:'var(--line)',display:'inline-block'}} />
              <span style={{color:'var(--gold)',fontSize:16}}>◈</span>
              <span style={{width:56,height:1,background:'var(--line)',display:'inline-block'}} />
            </div>
          </article>
        </div>
      </section>

      {/* SHOP THE STORY */}
      {shopProducts.length > 0 && (
        <section style={{maxWidth:1000,margin:'0 auto',padding:'clamp(10px,2vw,20px) 28px clamp(24px,3vw,36px)'}}>
          <div style={{textAlign:'center',marginBottom:28}}>
            <div style={{fontSize:11.5,letterSpacing:'0.24em',textTransform:'uppercase',color:'var(--gold-d)',marginBottom:10}}>From this story</div>
            <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:500,fontSize:'clamp(24px,3vw,34px)',lineHeight:1}}>Shop the story</h3>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(200px,38vw),1fr))',gap:'clamp(14px,2vw,24px)'}}>
            {shopProducts.map(p => <ProductCard key={p.id} product={p} size="sm" />)}
          </div>
        </section>
      )}

      {/* MORE STORIES */}
      {more.length > 0 && (
        <section style={{maxWidth:1360,margin:'0 auto',padding:'clamp(28px,4vw,48px) 28px clamp(36px,5vw,64px)',borderTop:'1px solid var(--line)'}}>
          <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',gap:14,marginBottom:28,flexWrap:'wrap'}}>
            <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:500,fontSize:'clamp(24px,3vw,36px)',lineHeight:1}}>More from the Journal</h3>
            <Link href="/journal" style={{fontSize:12,letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--gold-d)',textDecoration:'none'}}>All stories →</Link>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'clamp(18px,3vw,32px)'}}>
            {more.map(p => (
              <Link key={p.id} href={`/journal/${p.slug || p.id}`} className="jcard" style={{textDecoration:'none',color:'inherit',cursor:'pointer'}}>
                <div style={{ width:'100%', aspectRatio:'3/2', background:'var(--paper2)', borderRadius:3, overflow:'hidden', border:'1px solid var(--line)', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', fontSize:44, color:'var(--line)' }}>
                  {p.coverImage
                    ? <Image src={p.coverImage} alt={p.title} fill sizes="(max-width:700px) 100vw,33vw" className="jimg" style={{ objectFit:'cover' }} />
                    : <span>◈</span>
                  }
                </div>
                <div style={{fontSize:11.5,letterSpacing:'0.16em',textTransform:'uppercase',color:'var(--gold-d)',margin:'16px 0 8px'}}>{p.category}</div>
                <h3 className="jtitle" style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:500,fontSize:22,lineHeight:1.15}}>{p.title}</h3>
                <div style={{fontSize:11.5,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--muted)',marginTop:10}}>{p.date}</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
