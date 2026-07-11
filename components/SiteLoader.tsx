'use client';
import { useEffect, useState } from 'react';

/* ════════════════════════════════════════════════════════════
   GLYA INTRO LOADER
   A gold brick shimmers → dissolves into a spark → a diamond
   ring draws itself → GLYA letters reveal. Shown once per
   browser session (full page loads only — client-side
   navigation never remounts this).
════════════════════════════════════════════════════════════ */

const SEEN_KEY = 'glya-intro-seen';

export default function SiteLoader() {
  const [stage, setStage] = useState<'show' | 'hide' | 'done'>('show');

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) { setStage('done'); return; }
    sessionStorage.setItem(SEEN_KEY, '1');
    const quick = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t1 = setTimeout(() => setStage('hide'), quick ? 700 : 2100);
    const t2 = setTimeout(() => setStage('done'), quick ? 1200 : 2700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (stage === 'done') return null;

  return (
    <div className={`gld-ov${stage === 'hide' ? ' gld-hide' : ''}`} aria-hidden="true">
      <style>{`
        .gld-ov {
          position: fixed; inset: 0; z-index: 9998;
          background:
            radial-gradient(ellipse 70% 55% at 50% 42%, rgba(176,141,87,.08), transparent 70%),
            var(--paper);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          transition: opacity .75s ease;
        }
        .gld-hide { opacity: 0; pointer-events: none; }

        .gld-stage { position: relative; width: 150px; height: 150px; }
        .gld-bar, .gld-ring, .gld-spark { position: absolute; inset: 0; margin: auto; }

        /* ── ACT 1 · the gold brick ── */
        .gld-bar {
          opacity: 0;
          animation:
            gldBarIn  .4s cubic-bezier(.2,.8,.3,1) .1s forwards,
            gldBarOut .4s ease .85s forwards;
        }
        @keyframes gldBarIn  { from { opacity:0; transform:translateY(20px) scale(.88); } to { opacity:1; transform:none; } }
        @keyframes gldBarOut { to   { opacity:0; transform:scale(.6) translateY(8px); filter:blur(6px); } }
        .gld-shine { animation: gldShine .7s ease-in-out .3s; transform: translateX(-70px); }
        @keyframes gldShine { to { transform: translateX(180px); } }

        /* ── the spark between the two acts ── */
        .gld-spark {
          width: 26px; height: 26px; font-size: 26px; line-height: 1;
          color: var(--gold); text-align: center; opacity: 0;
          animation: gldSpark .45s ease .95s;
        }
        @keyframes gldSpark {
          0%   { opacity: 0; transform: scale(.2) rotate(0deg); }
          45%  { opacity: 1; transform: scale(1.5) rotate(90deg); }
          100% { opacity: 0; transform: scale(.4) rotate(180deg); }
        }

        /* ── ACT 2 · the ring draws itself ── */
        .gld-ring { opacity: 0; animation: gldRingIn .3s ease 1.05s forwards; }
        @keyframes gldRingIn { to { opacity: 1; } }
        .gld-ring path, .gld-ring circle {
          stroke-dasharray: 1; stroke-dashoffset: 1;
          animation: gldDraw .7s cubic-bezier(.45,0,.3,1) forwards;
        }
        .gld-ring .gld-band { animation-delay: 1.05s; }
        .gld-ring .gld-gem  { animation-delay: 1.3s; }
        .gld-ring .gld-fct  { animation-delay: 1.5s; animation-duration: .5s; }
        @keyframes gldDraw { to { stroke-dashoffset: 0; } }
        .gld-tw {
          opacity: 0; transform-origin: center;
          animation: gldTw .9s ease 1.75s;
        }
        @keyframes gldTw {
          0%,100% { opacity: 0; transform: scale(.3); }
          50%     { opacity: 1; transform: scale(1); }
        }

        /* ── ACT 3 · GLYA ── */
        .gld-word {
          margin-top: 30px;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(40px, 8vw, 58px); font-weight: 600;
          letter-spacing: .42em; padding-left: .42em;
          color: var(--ink); line-height: 1; white-space: nowrap;
        }
        .gld-word span {
          display: inline-block; opacity: 0;
          animation: gldLetter .65s cubic-bezier(.2,.8,.3,1) forwards;
        }
        @keyframes gldLetter {
          from { opacity: 0; transform: translateY(16px); filter: blur(6px); }
          to   { opacity: 1; transform: none; filter: none; }
        }
        .gld-tag {
          margin-top: 14px;
          font-size: 10.5px; letter-spacing: .38em; padding-left: .38em;
          text-transform: uppercase; color: var(--muted);
          opacity: 0; animation: gldLetter .6s ease 1.7s forwards;
        }
        .gld-line {
          width: 130px; height: 1px; background: var(--line);
          margin-top: 22px; overflow: hidden; position: relative;
        }
        .gld-line::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(90deg, var(--gold), #E3C387);
          transform: scaleX(0); transform-origin: left;
          animation: gldLine 1.9s cubic-bezier(.4,0,.2,1) .1s forwards;
        }
        @keyframes gldLine { to { transform: scaleX(1); } }

        @media (prefers-reduced-motion: reduce) {
          .gld-ov * { animation-duration: .01s !important; animation-delay: 0s !important; }
        }
      `}</style>

      <div className="gld-stage">
        {/* Gold brick */}
        <svg className="gld-bar" width="150" height="86" viewBox="0 0 150 86">
          <defs>
            <linearGradient id="gldTop" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#F2DFB1" /><stop offset=".5" stopColor="#E6C88C" /><stop offset="1" stopColor="#D6B06C" />
            </linearGradient>
            <linearGradient id="gldFront" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#DDBC7E" /><stop offset=".55" stopColor="#B08D57" /><stop offset="1" stopColor="#93733E" />
            </linearGradient>
            <linearGradient id="gldGlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset=".5" stopColor="#fff" stopOpacity=".7" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <clipPath id="gldClip">
              <polygon points="30,30 120,30 106,12 44,12" />
              <polygon points="20,76 130,76 120,30 30,30" />
            </clipPath>
          </defs>
          <polygon points="30,30 120,30 106,12 44,12" fill="url(#gldTop)" />
          <polygon points="20,76 130,76 120,30 30,30" fill="url(#gldFront)" />
          <polygon points="30,30 120,30 106,12 44,12" fill="none" stroke="#93733E" strokeOpacity=".35" strokeWidth="1" />
          <text x="75" y="58" textAnchor="middle" fontFamily="Jost, sans-serif" fontSize="11" letterSpacing="3" fill="#6B5228">999.9</text>
          <g clipPath="url(#gldClip)">
            <rect className="gld-shine" x="-10" y="0" width="46" height="86" fill="url(#gldGlow)" transform="skewX(-18)" />
          </g>
        </svg>

        {/* Spark */}
        <div className="gld-spark">✦</div>

        {/* Diamond ring */}
        <svg className="gld-ring" width="150" height="150" viewBox="0 0 150 150" fill="none" stroke="#B08D57" strokeLinecap="round" strokeLinejoin="round">
          <circle className="gld-band" cx="75" cy="92" r="36" strokeWidth="3.5" pathLength="1" />
          <path className="gld-gem" d="M75 18 L96 38 L75 62 L54 38 Z" strokeWidth="2.5" pathLength="1" />
          <path className="gld-fct" d="M54 38 H96 M75 18 L66 38 L75 62 M75 18 L84 38 L75 62" strokeWidth="1.3" strokeOpacity=".8" pathLength="1" />
          <path className="gld-tw" d="M112 26 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5 Z" fill="#D6B06C" stroke="none" />
        </svg>
      </div>

      {/* GLYA */}
      <div className="gld-word">
        {['G', 'L', 'Y', 'A'].map((ch, i) => (
          <span key={ch} style={{ animationDelay: `${1.45 + i * 0.08}s` }}>{ch}</span>
        ))}
      </div>
      <div className="gld-tag">Fine Jewellery</div>
      <div className="gld-line" />
    </div>
  );
}
