'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';

/* ── types ── */
type NavLink    = { label: string; href: string };
type NavSection = { heading: string; allHref: string; items: NavLink[] };
type NavItem    = { label: string; href: string; sections?: NavSection[] };

/* ════════════════════════════════════════
   NAV DATA
   Gold / Silver → BK section + Lifestyle section
   Gemstone / Diamond → simple list
════════════════════════════════════════ */
const NAV: NavItem[] = [
  {
    label: 'Gold',
    href:  '/browse?metal=Gold',
    sections: [
      {
        heading: 'BK Gold',
        allHref: '/browse?col=BK+Gold',
        items: [
          { label: 'Gold Designer Badges', href: '/browse?col=BK+Gold&cat=Gold+Designer+Badges' },
          { label: 'Oval Gold Badges',     href: '/browse?col=BK+Gold&cat=Oval+Gold+Badges' },
          { label: 'Round Gold Badges',    href: '/browse?col=BK+Gold&cat=Round+Gold+Badges' },
          { label: 'Pendants',             href: '/browse?col=BK+Gold&cat=Pendants' },
          { label: 'Rings',                href: '/browse?col=BK+Gold&cat=Rings' },
          { label: 'Rakhi',                href: '/browse?col=BK+Gold&cat=Rakhi' },
          { label: 'Baba Articles',        href: '/browse?col=BK+Gold&cat=Baba+Articles' },
          { label: 'Earrings',             href: '/browse?col=BK+Gold&cat=Earrings' },
        ],
      },
      {
        heading: 'Lifestyle',
        allHref: '/browse?col=Gold+Jewellery',
        items: [
          { label: 'Gold Gifts',                  href: '/browse?col=Gold+Jewellery&cat=Gold+Gifts' },
          { label: 'Gold Rings',                  href: '/browse?col=Gold+Jewellery&cat=Gold+Rings' },
          { label: 'Rajasthani Gold Jewelry',     href: '/browse?col=Gold+Jewellery&cat=Rajasthani+Gold' },
          { label: 'Gold Mangalsutra',            href: '/browse?col=Gold+Jewellery&cat=Gold+Mangalsutra' },
          { label: 'Gold Earrings Diamond Polki', href: '/browse?col=Gold+Jewellery&cat=Gold+Earrings+Diamond+Polki' },
          { label: 'Gold Necklace Set',           href: '/browse?col=Gold+Jewellery&cat=Gold+Necklace+Set' },
          { label: 'Gold Child Najariya',         href: '/browse?col=Gold+Jewellery&cat=Gold+Child+Najariya' },
          { label: 'Gold Bangles',                href: '/browse?col=Gold+Jewellery&cat=Gold+Bangles' },
          { label: 'Gold Pendants',               href: '/browse?col=Gold+Jewellery&cat=Gold+Pendants' },
        ],
      },
    ],
  },
  {
    label: 'Silver',
    href:  '/browse?metal=Silver',
    sections: [
      {
        heading: 'BK Silver',
        allHref: '/browse?col=BK+Silver',
        items: [
          { label: 'Silver Articles', href: '/browse?col=BK+Silver&cat=Silver+Articles' },
          { label: 'Badges',          href: '/browse?col=BK+Silver&cat=Badges' },
          { label: 'Pendant',         href: '/browse?col=BK+Silver&cat=Pendant' },
          { label: 'Rings',           href: '/browse?col=BK+Silver&cat=Rings' },
          { label: 'Rakhi',           href: '/browse?col=BK+Silver&cat=Rakhi' },
        ],
      },
      {
        heading: 'Lifestyle',
        allHref: '/browse?col=Silver+Jewellery',
        items: [
          { label: 'Silver Idols / Murti',    href: '/browse?col=Silver+Jewellery&cat=Silver+Idols' },
          { label: 'Silver Cutstone Earrings', href: '/browse?col=Silver+Jewellery&cat=Silver+Cutstone+Earrings' },
          { label: 'Silver Cutstone Pendants', href: '/browse?col=Silver+Jewellery&cat=Silver+Cutstone+Pendants' },
          { label: 'Silver Cutstone Rings',    href: '/browse?col=Silver+Jewellery&cat=Silver+Cutstone+Rings' },
          { label: 'Silver Puja Articles',     href: '/browse?col=Silver+Jewellery&cat=Silver+Puja+Articles' },
          { label: 'Silverware',               href: '/browse?col=Silver+Jewellery&cat=Silverware' },
          { label: 'Silver Mangalsutra',       href: '/browse?col=Silver+Jewellery&cat=Silver+Mangalsutra' },
          { label: 'Silver Jutti',             href: '/browse?col=Silver+Jewellery&cat=Silver+Jutti' },
        ],
      },
    ],
  },
  {
    label: 'Gemstone',
    href:  '/browse?gem=all',
    sections: [
      {
        heading: 'Precious',
        allHref: '/browse?gem=all',
        items: [
          { label: 'Emerald (Panna)',          href: '/browse?gem=Emerald' },
          { label: 'Ruby (Manik)',             href: '/browse?gem=Ruby' },
          { label: 'Blue Sapphire (Neelam)',   href: '/browse?gem=Blue+Sapphire' },
          { label: 'Yellow Sapphire (Pukhraj)', href: '/browse?gem=Yellow+Sapphire' },
        ],
      },
      {
        heading: 'Semi-Precious',
        allHref: '/browse?gem=all',
        items: [
          { label: 'Pearl (Moti)',   href: '/browse?gem=Pearl' },
          { label: 'Coral (Moonga)', href: '/browse?gem=Coral' },
          { label: 'Diamond',        href: '/browse?gem=Diamond' },
        ],
      },
    ],
  },
  {
    label: 'Diamond',
    href:  '/browse?col=Diamond+Jewellery',
    sections: [
      {
        heading: 'Diamond Jewellery',
        allHref: '/browse?col=Diamond+Jewellery',
        items: [
          { label: 'Diamond Earrings',     href: '/browse?col=Diamond+Jewellery&cat=Diamond+Earrings' },
          { label: 'Diamond Rings',        href: '/browse?col=Diamond+Jewellery&cat=Diamond+Rings' },
          { label: 'Diamond Necklace Set', href: '/browse?col=Diamond+Jewellery&cat=Diamond+Necklace+Set' },
          { label: 'Diamond Pendants',     href: '/browse?col=Diamond+Jewellery&cat=Diamond+Pendants' },
        ],
      },
    ],
  },
];

/* ── SVG icons ── */
const IconSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconHeart = ({ filled }: { filled?: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const IconBag = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);
const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconClose = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconMenu = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <line x1="3" y1="6"  x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const IconChevron = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

export default function Header() {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [search,     setSearch]     = useState('');
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [mobOpen,    setMobOpen]    = useState<Set<string>>(new Set());
  const [scrolled,   setScrolled]   = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const cart            = useStore(s => s.cart);
  const wishlist        = useStore(s => s.wishlist);
  const adminProducts   = useStore(s => s.adminProducts);
  const adminCategories = useStore(s => s.adminCategories);
  const cartCount       = cart.reduce((a, b) => a + b.qty, 0);

  const suggestions = search.trim().length > 1
    ? adminProducts.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.col.toLowerCase().includes(search.toLowerCase()) ||
        p.cat.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 7)
    : [];

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 60);
  }, [searchOpen]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setSearchOpen(false); setMenuOpen(false); }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* Lock body scroll whenever any overlay is open */
  useEffect(() => {
    document.body.style.overflow = (menuOpen || searchOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, searchOpen]);

  function go(path: string) {
    router.push(path);
    setSearch(''); setSearchOpen(false); setMenuOpen(false);
  }

  function toggleMob(key: string) {
    setMobOpen(prev => {
      const n = new Set(prev);
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });
  }

  return (
    <>
      <style>{`
        /* ══════════════════════════════════════
           GLYA HEADER
        ══════════════════════════════════════ */
        .gh {
          position: sticky; top: 0; z-index: 100;
          height: 68px;
          background: rgba(250,247,241,0.97);
          backdrop-filter: blur(18px) saturate(1.4);
          -webkit-backdrop-filter: blur(18px) saturate(1.4);
          border-bottom: 1px solid var(--line);
          transition: box-shadow .3s;
        }
        .gh.gh--sc { box-shadow: 0 2px 28px -8px rgba(33,28,23,.13); }

        .gh-inner {
          max-width: 1440px; margin: 0 auto;
          padding: 0 clamp(16px,2.6vw,44px);
          height: 100%;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
        }

        /* ── Logo ── */
        .gh-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px; font-weight: 600;
          letter-spacing: .42em; padding-left: .42em;
          color: var(--ink); text-decoration: none; line-height: 1;
          white-space: nowrap; flex-shrink: 0;
          margin-right: clamp(18px, 2.8vw, 48px);
          transition: color .2s;
        }
        .gh-logo:hover { color: var(--gold-d); }

        /* ── Nav ── */
        .gh-nav {
          display: flex; align-items: center; justify-content: center;
          list-style: none; margin: 0; padding: 0; gap: 0;
        }
        .gh-ni { position: relative; }
        .gh-nl {
          display: flex; align-items: center; gap: 5px;
          padding: 0 clamp(12px,1.4vw,22px); height: 68px;
          font-size: 12px; letter-spacing: .12em; text-transform: uppercase;
          font-weight: 500; color: var(--ink2); text-decoration: none;
          white-space: nowrap; background: none; border: none;
          font-family: inherit; cursor: pointer; position: relative;
          transition: color .16s;
        }
        .gh-nl::after {
          content: ''; position: absolute; bottom: 0; left: 50%; right: 50%;
          height: 2px; background: var(--gold);
          transition: left .22s ease, right .22s ease;
        }
        .gh-ni:hover > .gh-nl,
        .gh-ni:focus-within > .gh-nl { color: var(--ink); }
        .gh-ni:hover > .gh-nl::after,
        .gh-ni:focus-within > .gh-nl::after { left: clamp(12px,1.4vw,22px); right: clamp(12px,1.4vw,22px); }

        .gh-cv { color: var(--muted); flex-shrink:0; transition: transform .22s ease, color .2s; }
        .gh-ni:hover > .gh-nl .gh-cv { transform: rotate(180deg); color: var(--gold); }

        /* ══════════════════════════
           MEGA MENU
        ══════════════════════════ */
        .gh-mega {
          display: none;
          position: absolute; top: 100%; left: 50%;
          transform: translateX(-50%);
          background: #fff;
          border: 1px solid var(--line);
          border-top: 2px solid var(--gold);
          border-radius: 0 0 4px 4px;
          box-shadow: 0 32px 64px -18px rgba(33,28,23,.20);
          z-index: 200;
          min-width: 280px;
          animation: ghDrop .18s ease;
          overflow: hidden;
        }
        @keyframes ghDrop {
          from { opacity:0; transform:translateX(-50%) translateY(-6px); }
          to   { opacity:1; transform:translateX(-50%) translateY(0); }
        }
        .gh-ni:hover .gh-mega { display: block; }

        /* notch */
        .gh-mega::before {
          content: ''; position: absolute; top: -7px; left: 50%;
          transform: translateX(-50%);
          border: 6px solid transparent;
          border-bottom-color: var(--gold); border-top: 0;
          pointer-events: none;
        }

        /* sections row */
        .gh-mega-body { display: flex; }

        /* each section = one column */
        .gh-sec {
          flex: 1; padding: 20px 22px 0; min-width: 200px;
          border-right: 1px solid var(--line);
        }
        .gh-sec:last-child { border-right: none; }

        /* section heading */
        .gh-sec-hd {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 12px; padding-bottom: 10px;
          border-bottom: 1px solid var(--line);
        }
        .gh-sec-hd-label {
          font-size: 10px; letter-spacing: .2em; text-transform: uppercase;
          font-weight: 700; color: var(--gold);
        }
        .gh-sec-hd-all {
          font-size: 10px; letter-spacing: .1em; text-transform: uppercase;
          color: var(--muted); text-decoration: none; transition: color .14s;
        }
        .gh-sec-hd-all:hover { color: var(--gold-d); }

        /* items */
        .gh-sec-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 0; gap: 10px;
          font-size: 13px; color: var(--ink2); text-decoration: none;
          letter-spacing: .01em; border-radius: 2px;
          transition: color .14s, padding-left .14s;
        }
        .gh-sec-item svg { opacity: 0; color: var(--gold); flex-shrink: 0; transition: opacity .14s; }
        .gh-sec-item:hover { color: var(--ink); padding-left: 4px; }
        .gh-sec-item:hover svg { opacity: 1; }

        /* footer bar */
        .gh-mega-foot {
          padding: 10px 22px;
          border-top: 1px solid var(--line);
          background: var(--paper2);
          display: flex; gap: 20px; align-items: center; flex-wrap: wrap;
        }
        .gh-mega-foot a {
          font-size: 10.5px; letter-spacing: .13em; text-transform: uppercase;
          color: var(--muted); text-decoration: none; transition: color .14s;
        }
        .gh-mega-foot a:first-child { color: var(--gold); }
        .gh-mega-foot a:hover { color: var(--gold-d); }

        /* ── Actions ── */
        .gh-actions {
          display: flex; align-items: center;
          gap: 2px; margin-left: clamp(10px,1.8vw,24px);
        }
        .gh-ib {
          display: flex; align-items: center; justify-content: center;
          width: 38px; height: 38px; border-radius: 50%;
          color: var(--ink); text-decoration: none;
          background: none; border: none; cursor: pointer; position: relative;
          transition: background .18s, color .18s; font-family: inherit;
          flex-shrink: 0;
        }
        .gh-ib:hover { background: rgba(176,141,87,.10); color: var(--gold-d); }
        .gh-badge {
          position: absolute; top: 3px; right: 3px;
          min-width: 15px; height: 15px;
          background: var(--gold); color: #fff;
          font-size: 9px; font-weight: 600; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          padding: 0 3px; pointer-events: none;
        }
        .gh-div { width:1px; height:18px; background:var(--line); margin:0 6px; flex-shrink:0; }
        .gh-acct {
          display: flex; align-items: center; gap: 7px;
          padding: 0 15px; height: 34px;
          border: 1px solid rgba(33,28,23,.28); border-radius: 1px;
          font-size: 10.5px; letter-spacing: .11em; text-transform: uppercase;
          color: var(--ink); text-decoration: none; font-family: inherit;
          background: transparent; white-space: nowrap; flex-shrink: 0;
          transition: background .18s, color .18s, border-color .18s;
        }
        .gh-acct:hover { background: var(--ink); color: var(--paper); border-color: var(--ink); }
        .gh-acct-text { /* hidden <1100px */ }

        .gh-ham { display: none !important; }

        /* ── RESPONSIVE ── */
        @media (max-width: 1100px) {
          .gh-acct-text { display: none; }
          .gh-acct { padding:0; width:36px; height:36px; border-radius:50%; justify-content:center; }
        }
        @media (max-width: 880px) {
          .gh-nav  { display: none !important; }
          .gh-div  { display: none !important; }
          .gh-acct { display: none !important; }
          .gh-ham  { display: flex !important; }
        }

        /* ── SEARCH OVERLAY ── */
        .gh-sov {
          position: fixed; inset: 0; z-index: 300;
          background: rgba(33,28,23,.65);
          display: flex; flex-direction: column;
          animation: ghFd .2s ease;
        }
        @keyframes ghFd { from{opacity:0} to{opacity:1} }
        .gh-sp {
          background: var(--paper);
          padding: clamp(28px,4vw,52px) clamp(20px,5vw,56px);
          border-bottom: 1px solid var(--line);
        }
        .gh-sr { max-width:700px; margin:0 auto; display:flex; align-items:center; gap:14px; }
        .gh-si-w { flex:1; }
        .gh-si {
          width:100%; background:transparent; border:none;
          border-bottom: 2px solid var(--ink);
          font-family:'Cormorant Garamond',serif;
          font-size:clamp(22px,3.8vw,36px); color:var(--ink);
          padding:8px 0; outline:none; caret-color:var(--gold); box-sizing:border-box;
        }
        .gh-si::placeholder { color:#CCC5B9; }
        .gh-scl {
          flex-shrink:0; width:42px; height:42px; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          background:none; border:1px solid var(--line); cursor:pointer; color:var(--ink);
          transition:background .18s;
        }
        .gh-scl:hover { background:var(--paper2); }
        .gh-s-hint { max-width:700px; margin:10px auto 0; font-size:11.5px; color:var(--muted); }
        .gh-s-res  { max-width:700px; margin:0 auto; padding-top:16px; }
        .gh-s-row  {
          display:flex; align-items:center; gap:14px;
          padding:12px 0; border-bottom:1px solid var(--line);
          cursor:pointer; text-decoration:none; color:inherit;
          transition:padding-left .14s;
        }
        .gh-s-row:hover { padding-left:5px; }
        .gh-s-row:hover .gh-s-nm { color:var(--gold-d); }
        .gh-s-th  { width:44px; height:52px; background:var(--paper2); border-radius:1px; display:flex; align-items:center; justify-content:center; font-size:16px; color:var(--line); flex-shrink:0; }
        .gh-s-nm  { font-family:'Cormorant Garamond',serif; font-size:19px; transition:color .14s; }
        .gh-s-mt  { font-size:11px; color:var(--muted); margin-top:2px; }

        /* ── MOBILE MENU ── */
        .gh-mob {
          position:fixed; inset:0; z-index:200;
          background:var(--paper);
          display:flex; flex-direction:column; overflow-y:auto;
          animation:ghSl .22s ease;
        }
        @keyframes ghSl {
          from { transform:translateX(100%); }
          to   { transform:translateX(0); }
        }
        .gh-mob-hdr {
          display:flex; align-items:center; justify-content:space-between;
          padding:0 20px; height:68px;
          border-bottom:1px solid var(--line); flex-shrink:0;
        }
        .gh-mob-ni { border-bottom:1px solid var(--line); }
        .gh-mob-top {
          display:flex; align-items:center; justify-content:space-between;
          padding:0 20px; height:56px; cursor:pointer;
        }
        .gh-mob-lbl {
          font-family:'Cormorant Garamond',serif; font-size:25px; color:var(--ink);
        }
        .gh-mob-cv { transition:transform .22s ease; color:var(--muted); }
        .gh-mob-cv.open { transform:rotate(180deg); color:var(--gold); }
        .gh-mob-plain {
          display:flex; align-items:center;
          padding:0 20px; height:56px;
          font-family:'Cormorant Garamond',serif; font-size:25px;
          color:var(--ink); text-decoration:none; transition:color .16s;
        }
        .gh-mob-plain:hover { color:var(--gold-d); }
        .gh-mob-panel { overflow:hidden; max-height:0; transition:max-height .3s ease; }
        .gh-mob-panel.open { max-height:800px; }

        /* section inside mobile */
        .gh-mob-sec-hd {
          display:flex; align-items:center; justify-content:space-between;
          padding:12px 20px 8px 28px;
          background:var(--paper2); border-top:1px solid var(--line);
        }
        .gh-mob-sec-hd-lbl {
          font-size:9.5px; letter-spacing:.2em; text-transform:uppercase;
          font-weight:700; color:var(--gold);
        }
        .gh-mob-sec-hd-all {
          font-size:10px; letter-spacing:.1em; text-transform:uppercase;
          color:var(--muted); text-decoration:none;
        }
        .gh-mob-sec-hd-all:hover { color:var(--gold-d); }
        .gh-mob-sub {
          display:flex; align-items:center; justify-content:space-between;
          padding:10px 20px 10px 36px;
          background:var(--paper2); border-top:1px solid var(--line);
          text-decoration:none; color:var(--ink2); font-size:13.5px;
          transition:color .14s, background .14s;
        }
        .gh-mob-sub:hover { color:var(--ink); background:#EDE6D8; }
        .gh-mob-utils {
          display:flex; border-top:2px solid var(--line); flex-shrink:0; margin-top:auto;
        }
        .gh-mob-util {
          flex:1; padding:17px 6px; text-align:center;
          font-size:10px; letter-spacing:.1em; text-transform:uppercase;
          color:var(--muted); text-decoration:none;
          border-right:1px solid var(--line);
          background:none; border-bottom:none; cursor:pointer;
          font-family:inherit; transition:color .14s, background .14s;
        }
        .gh-mob-util:last-child { border-right:none; }
        .gh-mob-util:hover { color:var(--ink); background:var(--paper2); }
      `}</style>

      {/* ════════════ HEADER BAR ════════════ */}
      <header className={`gh${scrolled ? ' gh--sc' : ''}`}>
        <div className="gh-inner">

          {/* Logo */}
          <Link href="/" className="gh-logo">GLYA</Link>

          {/* Nav */}
          <nav className="gh-nav" aria-label="Main navigation">
            {NAV.map(n => (
              <div key={n.label} className="gh-ni">
                <Link href={n.href} className="gh-nl">
                  {n.label}
                  {n.sections && <span className="gh-cv"><IconChevron /></span>}
                </Link>

                {n.sections && (
                  <div className="gh-mega">
                    <div className="gh-mega-body">
                      {n.sections.map(sec => (
                        <div key={sec.heading} className="gh-sec">
                          {/* Section heading */}
                          <div className="gh-sec-hd">
                            <span className="gh-sec-hd-label">{sec.heading}</span>
                            <Link href={sec.allHref} className="gh-sec-hd-all">View all →</Link>
                          </div>
                          {/* Items */}
                          {sec.items.map(item => (
                            <Link key={item.label} href={item.href} className="gh-sec-item">
                              <span>{item.label}</span>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                            </Link>
                          ))}
                          <div style={{ height: 20 }} />
                        </div>
                      ))}
                    </div>
                    {/* Footer */}
                    <div className="gh-mega-foot">
                      <Link href={n.href}>View all {n.label} →</Link>
                      {n.sections.map(sec => (
                        <Link key={sec.heading} href={sec.allHref}>{sec.heading}</Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="gh-actions">
            <button className="gh-ib" onClick={() => setSearchOpen(true)} aria-label="Search">
              <IconSearch />
            </button>
            <Link href="/account?tab=wishlist" className="gh-ib" aria-label="Wishlist">
              <IconHeart filled={wishlist.length > 0} />
              {wishlist.length > 0 && <span className="gh-badge">{wishlist.length}</span>}
            </Link>
            <Link href="/cart" className="gh-ib" aria-label="Cart">
              <IconBag />
              {cartCount > 0 && <span className="gh-badge">{cartCount}</span>}
            </Link>
            <div className="gh-div" />
            <Link href="/account" className="gh-acct" aria-label="Account">
              <IconUser />
              <span className="gh-acct-text">My Account</span>
            </Link>
            <button className="gh-ib gh-ham" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
              {menuOpen ? <IconClose /> : <IconMenu />}
            </button>
          </div>

        </div>
      </header>

      {/* ════════════ SEARCH OVERLAY ════════════ */}
      {searchOpen && (
        <div className="gh-sov" onClick={e => { if (e.target === e.currentTarget) setSearchOpen(false); }}>
          <div className="gh-sp">
            <div className="gh-sr">
              <div className="gh-si-w">
                <input
                  ref={searchRef}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && search.trim()) go(`/browse?q=${encodeURIComponent(search.trim())}`); }}
                  placeholder="Search for jewellery…"
                  className="gh-si"
                />
              </div>
              <button className="gh-scl" onClick={() => { setSearchOpen(false); setSearch(''); }}><IconClose /></button>
            </div>
            <div className="gh-s-hint">Press Enter to search · Esc to close</div>
            {suggestions.length > 0 && (
              <div className="gh-s-res">
                {suggestions.map(s => (
                  <div key={s.id} className="gh-s-row" onClick={() => go(`/product/${s.id}`)}>
                    <div className="gh-s-th">◈</div>
                    <div style={{ flex: 1 }}>
                      <div className="gh-s-nm">{s.name}</div>
                      <div className="gh-s-mt">{s.karat} {s.metal} · {s.cat}</div>
                    </div>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color:'var(--muted)',flexShrink:0 }}><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════ MOBILE MENU ════════════ */}
      {menuOpen && (
        <div className="gh-mob">
          <div className="gh-mob-hdr">
            <Link href="/" className="gh-logo" style={{ margin: 0 }} onClick={() => setMenuOpen(false)}>GLYA</Link>
            <button className="gh-ib" onClick={() => setMenuOpen(false)}><IconClose /></button>
          </div>

          <div style={{ flex: 1 }}>
            {NAV.map(n => (
              <div key={n.label} className="gh-mob-ni">
                {n.sections ? (
                  <>
                    <div className="gh-mob-top" onClick={() => toggleMob(n.label)}>
                      <span className="gh-mob-lbl">{n.label}</span>
                      <span className={`gh-mob-cv${mobOpen.has(n.label) ? ' open' : ''}`}><IconChevron /></span>
                    </div>
                    <div className={`gh-mob-panel${mobOpen.has(n.label) ? ' open' : ''}`}>
                      {n.sections.map(sec => (
                        <div key={sec.heading}>
                          <div className="gh-mob-sec-hd">
                            <span className="gh-mob-sec-hd-lbl">{sec.heading}</span>
                            <Link href={sec.allHref} className="gh-mob-sec-hd-all" onClick={() => setMenuOpen(false)}>View all →</Link>
                          </div>
                          {sec.items.map(item => (
                            <Link key={item.label} href={item.href} className="gh-mob-sub" onClick={() => setMenuOpen(false)}>
                              <span>{item.label}</span>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color:'var(--gold)',flexShrink:0 }}><polyline points="9 18 15 12 9 6"/></svg>
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link href={n.href} className="gh-mob-plain" onClick={() => setMenuOpen(false)}>{n.label}</Link>
                )}
              </div>
            ))}

            {/* Admin categories in mobile menu */}
            {adminCategories.length > 0 && (
              <div className="gh-mob-ni">
                <div className="gh-mob-top" onClick={() => toggleMob('Categories')}>
                  <span className="gh-mob-lbl">Categories</span>
                  <span className={`gh-mob-cv${mobOpen.has('Categories') ? ' open' : ''}`}><IconChevron /></span>
                </div>
                <div className={`gh-mob-panel${mobOpen.has('Categories') ? ' open' : ''}`}>
                  {adminCategories.map(cat => (
                    <Link key={cat} href={`/browse?cat=${encodeURIComponent(cat)}`} className="gh-mob-sub" onClick={() => setMenuOpen(false)}>
                      <span>{cat}</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color:'var(--gold)', flexShrink:0 }}><polyline points="9 18 15 12 9 6"/></svg>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <Link href="/journal" className="gh-mob-plain" onClick={() => setMenuOpen(false)}>Journal</Link>
            <Link href="/about"   className="gh-mob-plain" onClick={() => setMenuOpen(false)}>About</Link>
            <Link href="/contact" className="gh-mob-plain" onClick={() => setMenuOpen(false)}>Contact</Link>
          </div>

          <div className="gh-mob-utils">
            <button className="gh-mob-util" onClick={() => { setMenuOpen(false); setSearchOpen(true); }}>Search</button>
            <Link href="/account?tab=wishlist" className="gh-mob-util" onClick={() => setMenuOpen(false)}>Wishlist</Link>
            <Link href="/cart"    className="gh-mob-util" onClick={() => setMenuOpen(false)}>Cart</Link>
            <Link href="/account" className="gh-mob-util" onClick={() => setMenuOpen(false)}>Account</Link>
            <Link href="/track"   className="gh-mob-util" onClick={() => setMenuOpen(false)}>Track</Link>
          </div>
        </div>
      )}
    </>
  );
}
