'use client';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import ProductCard from '@/components/ProductCard';

export default function WishlistPage() {
  const wishlist      = useStore(s => s.wishlist);
  const toggleWish    = useStore(s => s.toggleWish);
  const adminProducts  = useStore(s => s.adminProducts);
  const productsLoaded = useStore(s => s.productsLoaded);

  const loading   = !productsLoaded && wishlist.length > 0;
  const wishItems = adminProducts.filter(p => wishlist.includes(p.id));

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(24px,4vw,52px) clamp(16px,3vw,28px)', animation: 'glyaFade 0.5s ease' }}>

      {/* HEADING */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 32 }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>My account</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(32px,4.5vw,52px)', lineHeight: 1.05 }}>
            Wishlist
            {wishItems.length > 0 && (
              <span style={{ fontFamily: 'Jost,sans-serif', fontWeight: 400, fontSize: 'clamp(16px,2vw,20px)', color: 'var(--muted)', marginLeft: 14 }}>
                {wishItems.length} {wishItems.length === 1 ? 'piece' : 'pieces'}
              </span>
            )}
          </h1>
        </div>
        {wishItems.length > 0 && (
          <Link href="/browse" style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-d)', textDecoration: 'none' }}>
            Continue browsing →
          </Link>
        )}
      </div>

      {/* LOADING STATE */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 'clamp(60px,8vw,100px) 20px', border: '1px solid var(--line)', borderRadius: 4, background: 'var(--paper2)' }}>
          <div style={{ fontSize: 48, color: 'var(--gold)', marginBottom: 18, animation: 'glyaFade 1.2s ease infinite alternate' }}>◈</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(24px,3vw,34px)', marginBottom: 10 }}>
            Gathering your saved pieces
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 15, fontWeight: 300 }}>One moment…</p>
        </div>
      ) : wishItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'clamp(60px,8vw,100px) 20px', border: '1px solid var(--line)', borderRadius: 4, background: 'var(--paper2)' }}>
          <div style={{ fontSize: 56, color: 'var(--line)', marginBottom: 20 }}>♡</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(26px,3.5vw,38px)', marginBottom: 12 }}>
            Your wishlist is empty
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.7, maxWidth: 360, margin: '0 auto 28px', fontWeight: 300 }}>
            Save pieces you love while you browse — tap the ♡ on any product to add it here.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/browse" style={{ padding: '13px 30px', background: 'var(--ink)', color: '#F7F2E8', fontSize: 12.5, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: 2 }}>
              Browse jewellery
            </Link>
            <Link href="/browse?tag=New" style={{ padding: '13px 30px', border: '1px solid var(--line)', color: 'var(--ink)', fontSize: 12.5, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: 2 }}>
              New arrivals
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* PRODUCT GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(clamp(160px,22vw,240px),42vw),1fr))', gap: 'clamp(16px,2.5vw,28px)' }}>
            {wishItems.map(p => (
              <div key={p.id} style={{ position: 'relative' }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>

          {/* ACTIONS */}
          <div style={{ display: 'flex', gap: 12, marginTop: 40, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => wishItems.forEach(p => toggleWish(p.id))}
              style={{ padding: '11px 26px', border: '1px solid var(--line)', background: 'transparent', fontSize: 12.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', borderRadius: 2, cursor: 'pointer' }}
            >
              Clear wishlist
            </button>
            <Link href="/browse" style={{ padding: '11px 26px', background: 'var(--ink)', color: '#F7F2E8', fontSize: 12.5, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: 2 }}>
              Continue shopping
            </Link>
          </div>
        </>
      )}

    </main>
  );
}
