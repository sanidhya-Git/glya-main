'use client';

const SECTIONS = [
  {
    title: '1. Information we collect',
    body: [
      'Account & order data: name, email address, phone number, shipping and billing address, and order history when you create an account or place an order.',
      'Payment data: we do not store full card details. Payments are processed by PCI-DSS-compliant gateways (Razorpay / Stripe). We receive only a transaction reference.',
      'Usage data: pages visited, time on site, browser type, device, and IP address collected via first-party analytics and server logs.',
      'Communications: messages you send us via email, WhatsApp, or contact forms.',
    ],
  },
  {
    title: '2. How we use your information',
    body: [
      'Process and fulfil orders, send shipping confirmations and delivery updates.',
      'Respond to enquiries and provide customer support.',
      'Send transactional emails and, with your consent, marketing newsletters about new collections and offers.',
      'Detect fraud, prevent abuse, and maintain the security of our systems.',
      'Comply with legal obligations under Indian law (GST Act, IT Act, Consumer Protection Act).',
    ],
  },
  {
    title: '3. Cookies & tracking',
    body: [
      'We use essential cookies required for the site to function (session management, cart persistence).',
      'Analytics cookies (first-party) help us understand how visitors use the site. No third-party advertising trackers are used.',
      'You can disable cookies in your browser settings. Disabling essential cookies may affect site functionality.',
    ],
  },
  {
    title: '4. Data sharing & third parties',
    body: [
      'Logistics partners (e.g. Bluedart, DTDC) receive your name and delivery address solely to fulfil your order.',
      'Payment gateways receive order value and billing details to process payments.',
      'Email service providers send transactional and marketing emails on our behalf.',
      'We do not sell, rent, or trade your personal data with any third party for their marketing purposes.',
    ],
  },
  {
    title: '5. Data retention',
    body: [
      'Order records are retained for 7 years as required under the GST Act.',
      'Account data is retained while your account is active and for 3 years after deletion.',
      'Analytics data is aggregated and anonymised after 26 months.',
    ],
  },
  {
    title: '6. Your rights',
    body: [
      'Access: you may request a copy of the personal data we hold about you.',
      'Correction: you may update inaccurate data via your account settings or by contacting us.',
      'Deletion: you may request deletion of your account and associated data, subject to legal retention requirements.',
      'Opt-out: you may unsubscribe from marketing emails at any time via the unsubscribe link or by emailing privacy@glya.in.',
    ],
  },
  {
    title: '7. Security',
    body: [
      'All data in transit is encrypted with TLS 1.2+. Data at rest is encrypted using AES-256.',
      'Access to personal data is restricted to authorised personnel on a need-to-know basis.',
      'We conduct periodic security reviews and vulnerability assessments.',
    ],
  },
  {
    title: '8. Changes to this policy',
    body: [
      'We may update this policy periodically. Material changes will be communicated via email or a prominent notice on the site at least 14 days before they take effect.',
      'Your continued use of the site after the effective date constitutes acceptance of the updated policy.',
    ],
  },
  {
    title: '9. Contact us',
    body: [
      'Data controller: Glya Fine Jewellery Pvt. Ltd., Pune, Maharashtra, India.',
      'Privacy queries: privacy@glya.in',
      'Response time: within 72 hours on business days.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main style={{ animation: 'glyaFade 0.5s ease' }}>

      {/* HEADER */}
      <section style={{ background: 'var(--paper2)', padding: 'clamp(44px,6vw,80px) clamp(20px,5vw,60px)', textAlign: 'center', borderBottom: '1px solid var(--line)' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14 }}>Legal</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(34px,5.5vw,64px)', lineHeight: 1.05 }}>Privacy Policy</h1>
        <p style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 14 }}>Effective date: January 1, 2025 · Last updated: January 1, 2025</p>
        <p style={{ maxWidth: 560, margin: '16px auto 0', fontSize: 15, lineHeight: 1.75, color: 'var(--ink2)', fontWeight: 300 }}>
          Glya Fine Jewellery Pvt. Ltd. ("GLYA", "we", "us") is committed to protecting your personal information. This policy explains what we collect, why, and how you can exercise your rights.
        </p>
      </section>

      {/* CONTENT */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(36px,5vw,64px) clamp(20px,4vw,40px)' }}>
        {SECTIONS.map(sec => (
          <section key={sec.title} style={{ marginBottom: 40, paddingBottom: 40, borderBottom: '1px solid var(--line)' }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(20px,2.5vw,28px)', marginBottom: 16 }}>{sec.title}</h2>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sec.body.map(item => (
                <li key={item} style={{ display: 'flex', gap: 12, color: 'var(--ink2)', fontSize: 15, lineHeight: 1.75, fontWeight: 300 }}>
                  <span style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 4, fontSize: 12 }}>◈</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <p style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center', marginTop: 8 }}>
          Questions? Write to <a href="mailto:privacy@glya.in" style={{ color: 'var(--gold-d)', textDecoration: 'none' }}>privacy@glya.in</a>
        </p>
      </div>

    </main>
  );
}
