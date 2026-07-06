'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminRedirectLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    window.location.replace('http://localhost:3001');
  }, []);

  return (
    <div style={{ fontFamily: "'Jost', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', flexDirection: 'column', gap: 20, color: '#555', padding: 40 }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, color: '#211C17' }}>GLYA Admin</div>
      <div style={{ fontSize: 16, color: '#8C8275' }}>Redirecting to admin panel…</div>
      <Link href="http://localhost:3001" style={{ background: '#211C17', color: '#F7F2E8', padding: '14px 28px', borderRadius: 2, fontSize: 12.5, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none' }}>
        Open Admin Panel
      </Link>
      <div style={{ display: 'none' }}>{children}</div>
    </div>
  );
}
