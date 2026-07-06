'use client';

const SECTIONS = [
  {
    title: '1. Acceptance of terms',
    body: 'By accessing or using the GLYA website (glya.in) you agree to be bound by these Terms & Conditions. If you do not agree, please do not use the site. These terms are governed by the laws of India and the jurisdiction of the courts in Pune, Maharashtra.',
  },
  {
    title: '2. Use of the site',
    body: 'You agree to use the site only for lawful purposes. You must not misuse our site by introducing viruses or other malicious material, attempting unauthorised access, or using automated tools to scrape or replicate content. We reserve the right to terminate access for any user who violates these terms.',
  },
  {
    title: '3. Products & pricing',
    body: 'All jewellery prices are calculated live against the current gold, silver, or platinum spot rate. Prices displayed are inclusive of GST at 3%. Prices may change between your initial viewing and checkout due to live rate fluctuations; the price confirmed at checkout is the binding price. Product images are representative; slight variations in colour may occur due to photographic lighting.',
  },
  {
    title: '4. Orders & contract',
    body: 'Placing an order constitutes an offer to purchase. A binding contract is formed only when we send you an order confirmation email. We reserve the right to cancel any order where an error has occurred in the advertised price or description, in which case a full refund will be issued immediately.',
  },
  {
    title: '5. Payment',
    body: 'We accept credit/debit cards, UPI, net banking, and select EMI options via our payment partners Razorpay and Stripe. All transactions are encrypted. GLYA does not store card numbers. In the event of a payment failure, no amount is charged; please retry or contact our support team.',
  },
  {
    title: '6. Shipping & delivery',
    body: 'All orders are shipped with insured, tracked courier (Bluedart / DTDC). Standard delivery is 3–5 business days across India. Express and same-day options are available at checkout for select pincodes. Risk of loss transfers to you upon delivery. GLYA is not liable for delays caused by natural events, courier disruptions, or incorrect addresses provided by the customer.',
  },
  {
    title: '7. Returns & exchanges',
    body: 'Returns are accepted within 30 days of delivery for eligible items. Please refer to our Returns & Exchange Policy for full details. Custom engraved or bespoke pieces are not returnable. Refunds are processed to the original payment method within 5–7 business days of receiving the returned item.',
  },
  {
    title: '8. Warranties',
    body: 'All GLYA pieces come with a 1-year manufacturing defect warranty. This covers defects in craftsmanship but excludes damage from normal wear, accidents, or unauthorised repairs. The lifetime buyback guarantee is a separate commercial commitment detailed in our Returns Policy.',
  },
  {
    title: '9. Intellectual property',
    body: 'All content on this site — including text, images, design elements, the GLYA logo, and jewellery photographs — is the exclusive property of Glya Fine Jewellery Pvt. Ltd. and is protected by Indian copyright law. You may not reproduce, distribute, or use any content without express written permission.',
  },
  {
    title: '10. Limitation of liability',
    body: "To the maximum extent permitted by law, GLYA's liability for any claim arising from the use of this site or the purchase of products is limited to the value of the order in question. We are not liable for indirect, incidental, or consequential damages. Nothing in these terms affects your statutory rights as a consumer under Indian law.",
  },
  {
    title: '11. Changes to these terms',
    body: 'We may update these Terms & Conditions at any time. Updates will be posted on this page with a revised effective date. Continued use of the site after changes constitutes acceptance.',
  },
  {
    title: '12. Contact',
    body: 'For queries about these terms, contact legal@glya.in or write to Glya Fine Jewellery Pvt. Ltd., Pune, Maharashtra, India.',
  },
];

export default function TermsPage() {
  return (
    <main style={{ animation: 'glyaFade 0.5s ease' }}>

      {/* HEADER */}
      <section style={{ background: 'var(--paper2)', padding: 'clamp(44px,6vw,80px) clamp(20px,5vw,60px)', textAlign: 'center', borderBottom: '1px solid var(--line)' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14 }}>Legal</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(34px,5.5vw,64px)', lineHeight: 1.05 }}>Terms &amp; Conditions</h1>
        <p style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 14 }}>Effective date: January 1, 2025</p>
        <p style={{ maxWidth: 560, margin: '16px auto 0', fontSize: 15, lineHeight: 1.75, color: 'var(--ink2)', fontWeight: 300 }}>
          Please read these terms carefully before using our website or placing an order. By using GLYA you agree to these terms.
        </p>
      </section>

      {/* CONTENT */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(36px,5vw,64px) clamp(20px,4vw,40px)' }}>
        {SECTIONS.map(sec => (
          <section key={sec.title} style={{ marginBottom: 36, paddingBottom: 36, borderBottom: '1px solid var(--line)' }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(20px,2.5vw,28px)', marginBottom: 12 }}>{sec.title}</h2>
            <p style={{ color: 'var(--ink2)', fontSize: 15, lineHeight: 1.8, fontWeight: 300 }}>{sec.body}</p>
          </section>
        ))}
        <p style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center', marginTop: 8 }}>
          Queries? Email <a href="mailto:legal@glya.in" style={{ color: 'var(--gold-d)', textDecoration: 'none' }}>legal@glya.in</a>
        </p>
      </div>

    </main>
  );
}
