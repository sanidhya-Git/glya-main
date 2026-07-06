'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { journalPosts } from '@/lib/catalog';
import { useStore } from '@/lib/store';

const tabs = ['All','Buying Guide','Jewelry Education','Care','Bridal','Behind the Design'];

export default function JournalPage() {
  const adminJournal = useStore(s => s.adminJournal);
  const allPosts = adminJournal.length > 0
    ? adminJournal.map(ap => {
        const sp = journalPosts.find(s => s.id === ap.id);
        return { ...ap, read: sp?.read || '5 min read', authorRole: sp?.authorRole || '' };
      })
    : journalPosts;

  const [tab, setTab] = useState('All');
  const filtered  = tab === 'All' ? allPosts : allPosts.filter(p => p.category === tab);
  const featured  = filtered[0];
  const restPosts = filtered.slice(1);

  return (
    <main style={{ animation:'glyaFade 0.5s ease' }}>
      {/* MASTHEAD */}
      <section style={{ maxWidth:1360, margin:'0 auto', padding:'clamp(28px,4vw,56px) clamp(16px,3vw,28px) clamp(20px,3vw,36px)', textAlign:'center' }}>
        <div style={{ fontSize:12, letterSpacing:'0.28em', textTransform:'uppercase', color:'var(--gold-d)', marginBottom:16 }}>The Glya Journal</div>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:500, fontSize:'clamp(36px,5.5vw,72px)', lineHeight:1.0, letterSpacing:'-0.01em' }}>
          Notes on <span style={{ fontStyle:'italic', color:'var(--gold-d)' }}>light,</span> craft &amp; care.
        </h1>
        <p style={{ maxWidth:520, margin:'22px auto 0', color:'var(--ink2)', fontSize:'clamp(14px,1.5vw,16.5px)', lineHeight:1.7, fontWeight:300 }}>
          Buying guides, jewelry education, and the stories behind our collections.
        </p>
      </section>

      {/* CATEGORY TABS */}
      <section style={{ maxWidth:1360, margin:'0 auto', padding:'0 clamp(16px,3vw,28px)' }}>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center', borderBottom:'1px solid var(--line)', paddingBottom:22, overflowX:'auto' }}>
          {tabs.map(t => (
            <div key={t} onClick={() => setTab(t)}
              style={{ cursor:'pointer', fontSize:12.5, letterSpacing:'0.06em', padding:'8px 16px', borderRadius:40, border:`1px solid ${tab===t?'var(--gold)':'var(--line)'}`, background:tab===t?'rgba(176,141,87,0.1)':'transparent', color:tab===t?'#93733E':'var(--ink2)', whiteSpace:'nowrap', flexShrink:0 }}>
              {t}
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      {featured && (
        <section style={{ maxWidth:1360, margin:'0 auto', padding:'clamp(24px,4vw,48px) clamp(16px,3vw,28px)' }}>
          <Link href={`/journal/${featured.id}`} style={{ textDecoration:'none', color:'inherit', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'clamp(24px,4vw,52px)', alignItems:'center', cursor:'pointer' }}>
            <div style={{ width:'100%', aspectRatio:'4/3', background:'var(--paper2)', borderRadius:4, overflow:'hidden', border:'1px solid var(--line)', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', fontSize:60, color:'var(--line)' }}>
              {(featured as any).coverImage
                ? <Image src={(featured as any).coverImage} alt={featured.title} fill sizes="(max-width:700px) 100vw,50vw" style={{ objectFit:'cover' }} />
                : <span>◈</span>
              }
            </div>
            <div>
              <div style={{ fontSize:12, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--gold-d)', marginBottom:14 }}>{featured.category} · Featured</div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:500, fontSize:'clamp(26px,4vw,48px)', lineHeight:1.05 }}>{featured.title}</h2>
              <p style={{ maxWidth:460, margin:'18px 0 22px', color:'var(--ink2)', fontSize:15.5, lineHeight:1.7, fontWeight:300 }}>{featured.excerpt}</p>
              <div style={{ display:'flex', alignItems:'center', gap:14, fontSize:12.5, letterSpacing:'0.06em', textTransform:'uppercase', color:'var(--muted)', flexWrap:'wrap' }}>
                <span>{featured.date}</span>
                <span style={{ width:4, height:4, borderRadius:'50%', background:'var(--gold)', display:'inline-block' }}></span>
                <span>{(featured as any).read || '5 min read'}</span>
              </div>
              <div style={{ marginTop:24, fontSize:13, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--gold-d)', borderBottom:'1px solid var(--gold)', display:'inline-block', paddingBottom:3 }}>Read the story</div>
            </div>
          </Link>
        </section>
      )}

      {/* POST GRID */}
      <section style={{ maxWidth:1360, margin:'0 auto', padding:'clamp(10px,2vw,20px) clamp(16px,3vw,28px) clamp(40px,6vw,72px)' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'clamp(20px,3vw,40px)' }}>
          {restPosts.map(p => (
            <Link key={p.id} href={`/journal/${p.id}`} style={{ textDecoration:'none', color:'inherit', cursor:'pointer' }}>
              <div style={{ width:'100%', aspectRatio:'3/2', background:'var(--paper2)', borderRadius:3, overflow:'hidden', border:'1px solid var(--line)', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', fontSize:44, color:'var(--line)' }}>
                {(p as any).coverImage
                  ? <Image src={(p as any).coverImage} alt={p.title} fill sizes="(max-width:700px) 100vw,33vw" style={{ objectFit:'cover' }} />
                  : <span>◈</span>
                }
              </div>
              <div style={{ fontSize:11.5, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--gold-d)', margin:'16px 0 8px' }}>{p.category}</div>
              <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:500, fontSize:'clamp(20px,2vw,24px)', lineHeight:1.15 }}>{p.title}</h3>
              <p style={{ color:'var(--ink2)', fontSize:14.5, lineHeight:1.65, fontWeight:300, marginTop:10 }}>{p.excerpt}</p>
              <div style={{ display:'flex', alignItems:'center', gap:12, fontSize:12, letterSpacing:'0.05em', textTransform:'uppercase', color:'var(--muted)', marginTop:14, flexWrap:'wrap' }}>
                <span>{p.date}</span>
                <span style={{ width:4, height:4, borderRadius:'50%', background:'var(--line)', display:'inline-block' }}></span>
                <span>{(p as any).read || '5 min read'}</span>
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

      {/* NEWSLETTER */}
      <section style={{ background:'var(--paper2)' }}>
        <div style={{ maxWidth:720, margin:'0 auto', padding:'clamp(36px,5vw,64px) clamp(16px,3vw,28px)', textAlign:'center' }}>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:500, fontSize:'clamp(26px,3.6vw,42px)', lineHeight:1.05 }}>Stories, straight to your inbox</h2>
          <p style={{ color:'var(--ink2)', fontSize:15.5, margin:'14px 0 24px', fontWeight:300 }}>New guides and collection notes, a few times a month.</p>
          <div style={{ display:'flex', maxWidth:440, margin:'0 auto', border:'1px solid var(--line)', borderRadius:2, overflow:'hidden', background:'var(--paper)' }}>
            <input placeholder="Email address" style={{ flex:1, background:'transparent', border:'none', padding:'14px 16px', fontSize:14 }} />
            <button
              style={{ cursor:'pointer', background:'var(--ink)', border:'none', color:'#F7F2E8', padding:'0 22px', fontSize:12, letterSpacing:'0.12em', textTransform:'uppercase', whiteSpace:'nowrap' }}
              onMouseEnter={e => (e.currentTarget.style.background='var(--gold-d)')}
              onMouseLeave={e => (e.currentTarget.style.background='var(--ink)')}
            >Subscribe</button>
          </div>
        </div>
      </section>
    </main>
  );
}
