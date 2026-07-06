'use client';
import { useState } from 'react';
import Link from 'next/link';

const SUBJECTS = [
  'Order inquiry',
  'Product question',
  'Custom order',
  'Atelier visit',
  'Press & media',
  'Other',
];

const INFO = [
  { icon: '◎', label: 'Address',        value: 'Glya Fine Jewellery\nKoregaon Park, Pune – 411001\nMaharashtra, India' },
  { icon: '◈', label: 'Phone',          value: '+91 98765 43210' },
  { icon: '✎', label: 'Email',          value: 'hello@glya.in' },
  { icon: '○', label: 'Business hours', value: 'Mon – Sat: 10 am – 7 pm\nSunday: By appointment only' },
];

export default function ContactPage() {
  const [form, setForm]   = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent]   = useState(false);
  const [sending, setSending] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1000);
  }

  return (
    <main style={{ animation: 'glyaFade 0.5s ease' }}>
      <style>{`
        .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px,5vw,64px); align-items: start; }
        .contact-input { width: 100%; border: 1px solid var(--line); background: var(--paper); padding: 14px 16px; font-size: 14px; border-radius: 2px; font-family: inherit; color: var(--ink); transition: border-color .2s; }
        .contact-input:focus { border-color: var(--gold); outline: none; }
        @media(max-width:780px){ .contact-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* HERO */}
      <section style={{ background: 'var(--paper2)', padding: 'clamp(48px,7vw,80px) clamp(20px,4vw,40px)', textAlign: 'center', borderBottom: '1px solid var(--line)' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14 }}>Get in touch</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 400, fontSize: 'clamp(36px,6vw,72px)', lineHeight: 1.0 }}>
          We would love to hear from you
        </h1>
        <p style={{ color: 'var(--ink2)', fontSize: 'clamp(14px,1.5vw,17px)', marginTop: 18, maxWidth: 480, margin: '18px auto 0', lineHeight: 1.75, fontWeight: 300 }}>
          Custom orders, atelier visits, product questions, or just a conversation about jewellery — we are always here.
        </p>
      </section>

      <section style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(48px,7vw,80px) clamp(20px,4vw,40px)' }}>
        <div className="contact-grid">

          {/* FORM */}
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 400, fontSize: 'clamp(24px,3vw,36px)', marginBottom: 28 }}>Send a message</h2>

            {sent ? (
              <div style={{ background: 'rgba(47,74,63,0.07)', border: '1px solid var(--em)', borderRadius: 4, padding: 'clamp(24px,4vw,40px)', textAlign: 'center' }}>
                <div style={{ fontSize: 36, color: 'var(--em)', marginBottom: 14 }}>◎</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 400 }}>Message received</h3>
                <p style={{ color: 'var(--ink2)', marginTop: 10, fontSize: 15, lineHeight: 1.7 }}>
                  Thank you, {form.name.split(' ')[0]}. We will get back to you within one business day.
                </p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                  style={{ marginTop: 20, cursor: 'pointer', background: 'none', border: '1px solid var(--line)', padding: '10px 22px', fontSize: 12.5, letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: 2, color: 'var(--ink)' }}>
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 7 }}>Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} required placeholder="Your name" className="contact-input" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 7 }}>Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 …" type="tel" className="contact-input" />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 7 }}>Email *</label>
                  <input name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" type="email" className="contact-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 7 }}>Subject</label>
                  <select name="subject" value={form.subject} onChange={handleChange} className="contact-input">
                    <option value="">Select a subject…</option>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 7 }}>Message *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required placeholder="Tell us how we can help…" rows={6}
                    style={{ width: '100%', border: '1px solid var(--line)', background: 'var(--paper)', padding: '14px 16px', fontSize: 14, borderRadius: 2, fontFamily: 'inherit', color: 'var(--ink)', resize: 'vertical' }} />
                </div>
                <button type="submit" disabled={sending}
                  style={{ cursor: sending ? 'not-allowed' : 'pointer', background: 'var(--ink)', color: '#F7F2E8', border: 'none', padding: '16px 32px', fontSize: 12.5, letterSpacing: '0.12em', textTransform: 'uppercase', borderRadius: 2, opacity: sending ? 0.7 : 1, alignSelf: 'flex-start' }}>
                  {sending ? 'Sending…' : 'Send message'}
                </button>
              </form>
            )}
          </div>

          {/* INFO */}
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 400, fontSize: 'clamp(24px,3vw,36px)', marginBottom: 28 }}>Find us</h2>

            {/* Map placeholder */}
            <div style={{ width: '100%', aspectRatio: '4/3', background: '#E8E0D0', borderRadius: 4, border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 28, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #E8E0D0 0%, #D9CFC0 100%)' }} />
              <div style={{ position: 'relative', textAlign: 'center' }}>
                <div style={{ fontSize: 36, color: 'var(--gold)', marginBottom: 10 }}>◎</div>
                <div style={{ fontSize: 13, letterSpacing: '0.06em', color: 'var(--ink2)' }}>Koregaon Park, Pune</div>
                <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 5 }}>Maharashtra, India</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              {INFO.map(item => (
                <div key={item.label} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--paper2)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: 'var(--gold)', flexShrink: 0, marginTop: 2 }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 15, color: 'var(--ink2)', lineHeight: 1.65, whiteSpace: 'pre-line', fontWeight: 300 }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 28, padding: 'clamp(18px,3vw,26px)', background: 'var(--paper2)', borderRadius: 4, border: '1px solid var(--line)' }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 22, marginBottom: 10 }}>Book an atelier visit</h3>
              <p style={{ fontSize: 14, color: 'var(--ink2)', lineHeight: 1.7, fontWeight: 300 }}>
                We welcome appointments for custom orders, bridal consultations, and jewellery care. Select "Atelier visit" in the form or call us directly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
