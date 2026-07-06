'use client';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { catalog, inr, priceOf } from '@/lib/catalog';

export default function AdminInventoryPage() {
  const stock    = useStore(s => s.stock);
  const setStock = useStore(s => s.setStock);
  const goldRate = useStore(s => s.goldRate);
  const [search,  setSearch]  = useState('');
  const [editing, setEditing] = useState<Record<number, string>>({});

  const filtered = catalog.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.cat.toLowerCase().includes(search.toLowerCase())
  );

  function commitEdit(id: number) {
    const val = parseInt(editing[id] ?? '', 10);
    if (!isNaN(val)) setStock(id, val);
    setEditing(e => { const n = { ...e }; delete n[id]; return n; });
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(26px,3vw,38px)' }}>Inventory</h1>
          <p style={{ fontSize: 13.5, color: 'var(--admin-muted)', marginTop: 4 }}>Click a stock number to edit. New products start at 5 units.</p>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--admin-muted)', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ padding: '3px 10px', borderRadius: 2, background: 'rgba(180,85,59,0.12)', color: '#B4553B' }}>■ Out of stock</span>
          <span style={{ padding: '3px 10px', borderRadius: 2, background: 'rgba(176,141,87,0.12)', color: '#B08D57' }}>■ Low (≤2)</span>
          <span style={{ padding: '3px 10px', borderRadius: 2, background: 'rgba(47,122,91,0.12)', color: '#2F7A5B' }}>■ In stock</span>
        </div>
      </div>

      <input
        placeholder="Search products…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', maxWidth: 400, border: '1px solid var(--admin-border)', background: 'var(--admin-surface)', color: 'var(--admin-text)', padding: '10px 14px', fontSize: 13.5, borderRadius: 3, marginBottom: 20, boxSizing: 'border-box' }}
      />

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--admin-border)' }}>
              {['Product', 'Category', 'Metal', 'Price', 'Stock', ''].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--admin-muted)', fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const qty     = stock[p.id] ?? 5;
              const isEdit  = p.id in editing;
              const pr      = priceOf(p, p.karat, goldRate);
              const stockBg = qty === 0 ? 'rgba(180,85,59,0.12)' : qty <= 2 ? 'rgba(176,141,87,0.12)' : 'rgba(47,122,91,0.1)';
              const stockC  = qty === 0 ? '#B4553B' : qty <= 2 ? '#B08D57' : '#2F7A5B';
              return (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--admin-border)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, color: 'var(--admin-text)' }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--admin-muted)' }}>ID #{p.id}</div>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--admin-muted)' }}>{p.cat}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--admin-muted)' }}>{p.karat} {p.metal}</td>
                  <td style={{ padding: '14px 16px', fontFamily: "'Cormorant Garamond',serif", fontSize: 17, color: 'var(--admin-text)' }}>{inr(pr.total)}</td>
                  <td style={{ padding: '14px 16px' }}>
                    {isEdit ? (
                      <input
                        type="number" min={0}
                        value={editing[p.id]}
                        onChange={e => setEditing(ed => ({ ...ed, [p.id]: e.target.value }))}
                        onBlur={() => commitEdit(p.id)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') commitEdit(p.id);
                          if (e.key === 'Escape') setEditing(ed => { const n = { ...ed }; delete n[p.id]; return n; });
                        }}
                        autoFocus
                        style={{ width: 70, border: '1px solid #B08D57', background: 'var(--admin-bg)', color: 'var(--admin-text)', padding: '5px 8px', fontSize: 14, borderRadius: 2, textAlign: 'center' }}
                      />
                    ) : (
                      <span
                        onClick={() => setEditing(ed => ({ ...ed, [p.id]: String(qty) }))}
                        title="Click to edit"
                        style={{ cursor: 'pointer', padding: '4px 12px', borderRadius: 2, background: stockBg, color: stockC, fontSize: 13 }}
                      >
                        {qty === 0 ? 'Out of stock' : qty}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button
                      onClick={() => setEditing(ed => ({ ...ed, [p.id]: String(qty) }))}
                      style={{ cursor: 'pointer', fontSize: 12, background: 'transparent', border: '1px solid var(--admin-border)', color: 'var(--admin-muted)', padding: '5px 10px', borderRadius: 2 }}
                    >Edit</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
