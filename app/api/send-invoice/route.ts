import nodemailer from 'nodemailer';

interface InvoiceLine {
  name: string;
  meta: string;
  qty: number;
  priceStr: string;
}

interface InvoicePayload {
  email: string;
  name: string;
  orderNo: string;
  date: string;
  etaDate: string;
  address: string;
  payment: string;
  delivery: string;
  lines: InvoiceLine[];
  subtotalStr: string;
  discountStr: string;
  promoCode: string;
  shippingStr: string;
  giftWrapStr: string;
  insuranceStr: string;
  totalStr: string;
  viewOrderUrl?: string;
}

function esc(s: unknown): string {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export async function POST(request: Request) {
  try {
    const body: InvoicePayload = await request.json();

    if (!body.email || !String(body.email).includes('@')) {
      return Response.json({ error: 'Invalid email address.' }, { status: 400 });
    }
    if (!body.orderNo || !Array.isArray(body.lines) || body.lines.length === 0) {
      return Response.json({ error: 'Invalid invoice payload.' }, { status: 400 });
    }

    const rows = body.lines.map(l => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #EFE9DD;">
          <div style="font-family:Georgia,serif;font-size:15px;color:#211C17;">${esc(l.name)}</div>
          <div style="font-size:12px;color:#6F6557;margin-top:3px;">${esc(l.meta)}</div>
        </td>
        <td style="padding:12px 8px;border-bottom:1px solid #EFE9DD;text-align:center;font-size:13px;color:#4A423A;white-space:nowrap;">× ${esc(l.qty)}</td>
        <td style="padding:12px 0;border-bottom:1px solid #EFE9DD;text-align:right;font-size:14px;color:#211C17;white-space:nowrap;">${esc(l.priceStr)}</td>
      </tr>`).join('');

    const totalRow = (label: string, value: string, opts?: { em?: boolean; big?: boolean }) => `
      <tr>
        <td colspan="2" style="padding:6px 0;font-size:${opts?.big ? '15px' : '13.5px'};color:${opts?.em ? '#2F7A5B' : '#4A423A'};">${label}</td>
        <td style="padding:6px 0;text-align:right;font-size:${opts?.big ? '20px' : '13.5px'};${opts?.big ? "font-family:Georgia,serif;" : ''}color:${opts?.em ? '#2F7A5B' : '#211C17'};white-space:nowrap;">${value}</td>
      </tr>`;

    let totals = totalRow('Subtotal', esc(body.subtotalStr));
    if (body.discountStr) totals += totalRow(`Discount${body.promoCode ? ` (${esc(body.promoCode)})` : ''}`, `− ${esc(body.discountStr)}`, { em: true });
    totals += totalRow('Shipping', esc(body.shippingStr), { em: body.shippingStr === 'Free' });
    if (body.giftWrapStr)  totals += totalRow('Gift wrapping', esc(body.giftWrapStr));
    if (body.insuranceStr) totals += totalRow('Shipment insurance', esc(body.insuranceStr));

    const transporter = nodemailer.createTransport({
      host:   process.env.EMAIL_HOST,
      port:   Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_PORT === '465',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from:    `"GLYA Fine Jewellery" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to:      body.email,
      subject: `Order ${body.orderNo} confirmed — your GLYA invoice`,
      html: `
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;background:#FAF7F1;border:1px solid #E7DFD2;border-radius:4px;overflow:hidden;">
          <div style="background:#211C17;padding:28px 32px;">
            <div style="font-family:Georgia,serif;font-size:22px;letter-spacing:0.36em;color:#EDE6D8;">GLYA</div>
          </div>
          <div style="padding:32px;">
            <p style="font-size:15px;color:#4A423A;line-height:1.7;margin:0;">
              ${body.name ? `Dear ${esc(body.name)},` : 'Hello,'}
            </p>
            <p style="font-size:15px;color:#4A423A;line-height:1.7;margin:12px 0 0;">
              Thank you for your order. Your pieces are being prepared in our Pune atelier —
              here is your invoice.
            </p>

            <div style="background:#fff;border:1px solid #E7DFD2;border-radius:4px;padding:20px 24px;margin-top:24px;">
              <table style="width:100%;border-collapse:collapse;font-size:13px;color:#4A423A;">
                <tr>
                  <td style="padding:3px 0;color:#6F6557;">Order number</td>
                  <td style="padding:3px 0;text-align:right;color:#211C17;"><b>${esc(body.orderNo)}</b></td>
                </tr>
                <tr>
                  <td style="padding:3px 0;color:#6F6557;">Order date</td>
                  <td style="padding:3px 0;text-align:right;">${esc(body.date)}</td>
                </tr>
                <tr>
                  <td style="padding:3px 0;color:#6F6557;">Payment method</td>
                  <td style="padding:3px 0;text-align:right;">${esc(body.payment)}</td>
                </tr>
                <tr>
                  <td style="padding:3px 0;color:#6F6557;">Delivery</td>
                  <td style="padding:3px 0;text-align:right;">${esc(body.delivery)}${body.etaDate ? ` · est. ${esc(body.etaDate)}` : ''}</td>
                </tr>
              </table>
            </div>

            <div style="background:#fff;border:1px solid #E7DFD2;border-radius:4px;padding:20px 24px;margin-top:14px;">
              <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#6F6557;margin-bottom:6px;">Delivering to</div>
              <div style="font-size:13.5px;color:#4A423A;line-height:1.6;">${esc(body.name)}<br/>${esc(body.address)}</div>
            </div>

            <div style="background:#fff;border:1px solid #E7DFD2;border-radius:4px;padding:20px 24px;margin-top:14px;">
              <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#6F6557;margin-bottom:4px;">Your pieces</div>
              <table style="width:100%;border-collapse:collapse;">${rows}</table>
              <table style="width:100%;border-collapse:collapse;margin-top:14px;">
                ${totals}
                <tr><td colspan="3" style="border-top:1px solid #E7DFD2;padding:0;"></td></tr>
                ${totalRow('<b>Total paid</b>', `<b>${esc(body.totalStr)}</b>`, { big: true })}
              </table>
              <div style="font-size:11.5px;color:#6F6557;margin-top:6px;">Inclusive of all taxes · GST invoice</div>
            </div>

            ${body.viewOrderUrl ? `
            <div style="text-align:center;margin-top:28px;">
              <a href="${esc(body.viewOrderUrl)}" style="display:inline-block;background:#211C17;color:#EDE6D8;text-decoration:none;padding:15px 40px;font-size:12.5px;letter-spacing:0.14em;text-transform:uppercase;border-radius:2px;">View your order</a>
            </div>` : ''}

            <p style="font-size:12.5px;color:#6F6557;line-height:1.7;margin:24px 0 0;">
              Every piece is BIS hallmarked and ships with a certificate of authenticity.
              An account has been created for you with this email — your orders will be waiting
              whenever you return to GLYA.
            </p>
          </div>
          <div style="background:#F2EDE3;padding:16px 32px;border-top:1px solid #E7DFD2;">
            <p style="font-size:11.5px;color:#6F6557;margin:0;">© GLYA Fine Jewellery — Certified diamonds &amp; 22K gold · Pune, India</p>
          </div>
        </div>
      `,
    });

    return Response.json({ sent: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to send invoice.';
    console.error('[GLYA send-invoice]', err);
    return Response.json({ error: message }, { status: 500 });
  }
}
