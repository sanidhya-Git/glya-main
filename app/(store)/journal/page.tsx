'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import type { AdminPost } from '@/lib/api';

function readTime(p: AdminPost): string {
  const text = `${p.body || ''} ${p.excerpt || ''}`.replace(/<[^>]+>/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const mins = Math.max(2, Math.ceil(words / 200));
  return `${mins} min read`;
}

export default function JournalPage() {
  const adminJournal  = useStore(s => s.adminJournal);
  const journalLoaded = useStore(s => s.journalLoaded);

  const tabs = ['All', ...Array.from(new Set(adminJournal.map(p => p.category).filter(Boolean)))];

  const [tab, setTab] = useState('All');
  const filtered  = tab === 'All' ? adminJournal : adminJournal.filter(p => p.category === tab);
  const featured  = filtered[0];
  const restPosts = filtered.slice(1);

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

        .jtab {
          position:relative; cursor:pointer; font-size:12px; letter-spacing:0.16em;
          text-transform:uppercase; padding:12px 2px 14px; color:var(--muted);
          transition:color .22s ease; white-space:nowrap; flex-shrink:0; background:none; border:none;
        }
        .jtab:hover { color:var(--ink); }
        .jtab::after {
          content:''; position:absolute; left:0; right:100%; bottom:-1px; height:2px;
          background:var(--gold-d); transition:right .28s ease;
        }
        .jtab.active { color:var(--ink); }
        .jtab.active::after { right:0; }

        .jimg { transition:transform 1s cubic-bezier(.22,.61,.21,1); }
        .jcard:hover .jimg, .jfeat:hover .jimg { transform:scale(1.05); }
        .jcard .jtitle, .jfeat .jtitle { transition:color .25s ease; }
        .jcard:hover .jtitle, .jfeat:hover .jtitle { color:var(--gold-d); }
        .jarrow { display:inline-block; transition:transform .25s ease; }
        .jcard:hover .jarrow, .jfeat:hover .jarrow { transform:translateX(6px); }

        .jfeat-grid { display:grid; grid-template-columns:1.15fr 1fr; gap:clamp(28px,4.5vw,64px); align-items:center; }
        @media (max-width:820px) { .jfeat-grid { grid-template-columns:1fr; gap:24px; } }

        .jgrid { display:grid; grid-template-columns:repeat(3,1fr); gap:clamp(28px,3.2vw,48px) clamp(22px,2.6vw,40px); }
        @media (max-width:980px) { .jgrid { grid-template-columns:repeat(2,1fr); } }
        @media (max-width:620px) { .jgrid { grid-template-columns:1fr; } }

        .jnews-input::placeholder { color:rgba(247,242,232,0.45); }
      `}</style>

      {/* MASTHEAD */}
      <section style={{ maxWidth:1360, margin:'0 auto', padding:'clamp(32px,5vw,68px) clamp(16px,3vw,28px) clamp(24px,3.5vw,44px)', textAlign:'center' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:18, marginBottom:22 }}>
          <span style={{ width:'min(72px,14vw)', height:1, background:'var(--gold)', display:'inline-block' }} />
          <span style={{ fontSize:12, letterSpacing:'0.34em', textTransform:'uppercase', color:'var(--gold-d)' }}>The Glya Journal</span>
          <span style={{ width:'min(72px,14vw)', height:1, background:'var(--gold)', display:'inline-block' }} />
        </div>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:500, fontSize:'clamp(38px,6vw,80px)', lineHeight:0.98, letterSpacing:'-0.015em' }}>
          Notes on <span style={{ fontStyle:'italic', color:'var(--gold-d)' }}>light,</span> craft &amp; care.
        </h1>
        <p style={{ maxWidth:540, margin:'24px auto 0', color:'var(--ink2)', fontSize:'clamp(14px,1.5vw,16.5px)', lineHeight:1.75, fontWeight:300 }}>
          Buying guides, jewellery education, and the stories behind our collections —
          written slowly, the way our pieces are made.
        </p>
        <div style={{ marginTop:26, fontSize:11.5, letterSpacing:'0.22em', textTransform:'uppercase', color:'var(--muted)', display:'flex', justifyContent:'center', alignItems:'center', gap:14, flexWrap:'wrap' }}>
          <span>Guides</span><span style={{ color:'var(--gold)' }}>·</span>
          <span>Education</span><span style={{ color:'var(--gold)' }}>·</span>
          <span>Atelier stories</span>
        </div>
      </section>

      {!journalLoaded ? (
        /* LOADING */
        <section style={{ maxWidth:1360, margin:'0 auto', padding:'clamp(24px,4vw,48px) clamp(16px,3vw,28px) clamp(40px,6vw,72px)' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'clamp(24px,4vw,52px)', alignItems:'center', marginBottom:'clamp(28px,4vw,52px)' }}>
            <div className="journal-skel" style={{ width:'100%', aspectRatio:'4/3', borderRadius:4 }} />
            <div>
              <div className="journal-skel" style={{ width:150, height:12, marginBottom:18 }} />
              <div className="journal-skel" style={{ width:'85%', height:40, marginBottom:12 }} />
              <div className="journal-skel" style={{ width:'70%', height:40, marginBottom:22 }} />
              <div className="journal-skel" style={{ width:'92%', height:14, marginBottom:10 }} />
              <div className="journal-skel" style={{ width:'60%', height:14 }} />
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'clamp(20px,3vw,40px)' }}>
            {[0,1,2].map(i => (
              <div key={i}>
                <div className="journal-skel" style={{ width:'100%', aspectRatio:'3/2' }} />
                <div className="journal-skel" style={{ width:110, height:11, margin:'16px 0 10px' }} />
                <div className="journal-skel" style={{ width:'80%', height:22, marginBottom:12 }} />
                <div className="journal-skel" style={{ width:'95%', height:13 }} />
              </div>
            ))}
          </div>
          <div style={{ textAlign:'center', marginTop:'clamp(28px,4vw,44px)', fontSize:12, letterSpacing:'0.22em', textTransform:'uppercase', color:'var(--muted)' }}>
            Gathering stories…
          </div>
        </section>
      ) : adminJournal.length === 0 ? (
        /* EMPTY */
        <section style={{ maxWidth:640, margin:'0 auto', padding:'clamp(48px,7vw,90px) clamp(16px,3vw,28px)', textAlign:'center' }}>
          <div style={{ fontSize:44, color:'var(--gold)', marginBottom:20 }}>◈</div>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:500, fontSize:'clamp(24px,3.4vw,36px)', lineHeight:1.1 }}>The journal is quiet, for now.</h2>
          <p style={{ color:'var(--ink2)', fontSize:15.5, lineHeight:1.7, fontWeight:300, margin:'16px auto 26px', maxWidth:420 }}>
            New guides and stories from the atelier are on their way. In the meantime, the collections are waiting.
          </p>
          <Link href="/browse" style={{ textDecoration:'none', display:'inline-block', background:'var(--ink)', color:'#F7F2E8', padding:'13px 28px', fontSize:12.5, letterSpacing:'0.12em', textTransform:'uppercase', borderRadius:2 }}>
            Explore the collection
          </Link>
        </section>
      ) : (
        <>
          {/* CATEGORY TABS */}
          <section style={{ maxWidth:1360, margin:'0 auto', padding:'0 clamp(16px,3vw,28px)' }}>
            <div style={{ display:'flex', gap:'clamp(18px,3vw,36px)', justifyContent:'center', borderBottom:'1px solid var(--line)', overflowX:'auto' }}>
              {tabs.map(t => (
                <button key={t} onClick={() => setTab(t)} className={`jtab${tab===t?' active':''}`}>
                  {t}
                </button>
              ))}
            </div>
          </section>

          {/* FEATURED */}
          {featured && (
            <section style={{ maxWidth:1360, margin:'0 auto', padding:'clamp(28px,4.5vw,56px) clamp(16px,3vw,28px)' }}>
              <Link href={`/journal/${featured.slug || featured.id}`} className="jfeat jfeat-grid" style={{ textDecoration:'none', color:'inherit', cursor:'pointer' }}>
                <div style={{ width:'100%', aspectRatio:'4/3', background:'var(--paper2)', borderRadius:4, overflow:'hidden', border:'1px solid var(--line)', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', fontSize:60, color:'var(--line)' }}>
                  {featured.coverImage
                    ? <Image src={featured.coverImage} alt={featured.title} fill sizes="(max-width:820px) 100vw,55vw" className="jimg" style={{ objectFit:'contain' }} />
                    : <span>◈</span>
                  }
                  <span style={{ position:'absolute', top:16, left:16, background:'rgba(250,247,241,0.94)', fontSize:10.5, letterSpacing:'0.18em', textTransform:'uppercase', padding:'7px 14px', borderRadius:2, color:'var(--gold-d)', zIndex:1 }}>Featured story</span>
                </div>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:12, fontSize:12, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--gold-d)', marginBottom:16 }}>
                    <span style={{ width:28, height:1, background:'var(--gold)', display:'inline-block' }} />
                    <span>{featured.category}</span>
                  </div>
                  <h2 className="jtitle" style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:500, fontSize:'clamp(28px,4.2vw,52px)', lineHeight:1.04, letterSpacing:'-0.01em' }}>{featured.title}</h2>
                  <p style={{ maxWidth:480, margin:'20px 0 24px', color:'var(--ink2)', fontSize:16, lineHeight:1.75, fontWeight:300 }}>{featured.excerpt}</p>
                  <div style={{ display:'flex', alignItems:'center', gap:14, fontSize:12, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--muted)', flexWrap:'wrap' }}>
                    <span>{featured.date}</span>
                    <span style={{ width:4, height:4, borderRadius:'50%', background:'var(--gold)', display:'inline-block' }} />
                    <span>{readTime(featured)}</span>
                  </div>
                  <div style={{ marginTop:28, fontSize:12.5, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--ink)', display:'inline-flex', alignItems:'center', gap:10, borderBottom:'1px solid var(--gold-d)', paddingBottom:5 }}>
                    Read the story <span className="jarrow">→</span>
                  </div>
                </div>
              </Link>
            </section>
          )}

          {/* POST GRID */}
          <section style={{ maxWidth:1360, margin:'0 auto', padding:'clamp(10px,2vw,20px) clamp(16px,3vw,28px) clamp(48px,7vw,88px)' }}>
            {restPosts.length > 0 && (
              <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:14, borderTop:'1px solid var(--line)', padding:'clamp(20px,3vw,32px) 0 clamp(22px,3vw,34px)', flexWrap:'wrap' }}>
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:500, fontSize:'clamp(24px,3vw,36px)', lineHeight:1 }}>Latest stories</h2>
                <span style={{ fontSize:12, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--muted)' }}>
                  {filtered.length} {filtered.length === 1 ? 'story' : 'stories'}{tab !== 'All' ? ` · ${tab}` : ''}
                </span>
              </div>
            )}
            <div className="jgrid">
              {restPosts.map(p => (
                <Link key={p.id} href={`/journal/${p.slug || p.id}`} className="jcard" style={{ textDecoration:'none', color:'inherit', cursor:'pointer', display:'block' }}>
                  <div style={{ width:'100%', aspectRatio:'3/2', background:'var(--paper2)', borderRadius:3, overflow:'hidden', border:'1px solid var(--line)', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', fontSize:44, color:'var(--line)' }}>
                    {p.coverImage
                      ? <Image src={p.coverImage} alt={p.title} fill sizes="(max-width:620px) 100vw,(max-width:980px) 50vw,33vw" className="jimg" style={{ objectFit:'contain' }} />
                      : <span>◈</span>
                    }
                  </div>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, margin:'18px 0 10px' }}>
                    <span style={{ fontSize:11.5, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--gold-d)' }}>{p.category}</span>
                    <span style={{ fontSize:11.5, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--muted)', whiteSpace:'nowrap' }}>{readTime(p)}</span>
                  </div>
                  <h3 className="jtitle" style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:500, fontSize:'clamp(21px,2vw,25px)', lineHeight:1.15 }}>{p.title}</h3>
                  <p style={{ color:'var(--ink2)', fontSize:14.5, lineHeight:1.65, fontWeight:300, marginTop:10, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{p.excerpt}</p>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, marginTop:16 }}>
                    <span style={{ fontSize:11.5, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--muted)' }}>{p.date}</span>
                    <span style={{ fontSize:11.5, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--gold-d)', display:'inline-flex', alignItems:'center', gap:7 }}>
                      Read <span className="jarrow">→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            {filtered.length === 0 && (
              <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--muted)' }}>
                <p style={{ fontSize:15 }}>No posts in this category yet.</p>
                <button onClick={() => setTab('All')} style={{ marginTop:14, cursor:'pointer', background:'var(--ink)', color:'#F7F2E8', border:'none', padding:'12px 24px', fontSize:12.5, letterSpacing:'0.1em', textTransform:'uppercase', borderRadius:2 }}>View all posts</button>
              </div>
            )}
          </section>
        </>
      )}

      {/* NEWSLETTER */}
      <section style={{ background:'var(--ink)', color:'#F7F2E8' }}>
        <div style={{ maxWidth:760, margin:'0 auto', padding:'clamp(44px,6vw,80px) clamp(16px,3vw,28px)', textAlign:'center' }}>
          <div style={{ fontSize:11.5, letterSpacing:'0.3em', textTransform:'uppercase', color:'var(--gold)', marginBottom:18 }}>The Glya Letter</div>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:500, fontSize:'clamp(28px,4vw,48px)', lineHeight:1.05 }}>
            Stories, straight to your <span style={{ fontStyle:'italic', color:'var(--gold)' }}>inbox.</span>
          </h2>
          <p style={{ color:'rgba(247,242,232,0.72)', fontSize:15.5, margin:'16px auto 30px', fontWeight:300, maxWidth:440, lineHeight:1.7 }}>
            New guides and collection notes, a few times a month. No noise, ever.
          </p>
          <div style={{ display:'flex', maxWidth:460, margin:'0 auto', border:'1px solid rgba(247,242,232,0.28)', borderRadius:2, overflow:'hidden', background:'rgba(247,242,232,0.04)' }}>
            <input className="jnews-input" placeholder="Email address" style={{ flex:1, minWidth:0, background:'transparent', border:'none', padding:'15px 18px', fontSize:14, color:'#F7F2E8', outline:'none' }} />
            <button
              style={{ cursor:'pointer', background:'var(--gold)', border:'none', color:'#211C17', padding:'0 26px', fontSize:12, letterSpacing:'0.14em', textTransform:'uppercase', whiteSpace:'nowrap', fontWeight:500, transition:'background .2s' }}
              onMouseEnter={e => (e.currentTarget.style.background='#C6A46C')}
              onMouseLeave={e => (e.currentTarget.style.background='var(--gold)')}
            >Subscribe</button>
          </div>
          <div style={{ marginTop:18, fontSize:11.5, letterSpacing:'0.1em', color:'rgba(247,242,232,0.45)' }}>
            Unsubscribe anytime · We never share your address
          </div>
        </div>
      </section>
    </main>
  );
}
