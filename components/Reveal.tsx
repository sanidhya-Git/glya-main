'use client';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

/* Scroll-reveal wrapper: fades + slides content up the first time it enters the
   viewport. Styling lives in globals.css (.glya-reveal / .is-in) so the effect
   is skipped automatically under prefers-reduced-motion. */
export default function Reveal({ children, delay = 0, style }: { children: ReactNode; delay?: number; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`glya-reveal${inView ? ' is-in' : ''}`} style={{ transitionDelay: delay ? `${delay}ms` : undefined, ...style }}>
      {children}
    </div>
  );
}
