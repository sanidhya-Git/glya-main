import { createHmac } from 'crypto';
import nodemailer from 'nodemailer';

const SECRET = process.env.OTP_SECRET || 'glya-otp-fallback-secret';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !String(email).includes('@')) {
      return Response.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
    const payload = `${email}:${otp}:${expires}`;
    const sig = createHmac('sha256', SECRET).update(payload).digest('hex');
    const token = `${Buffer.from(payload).toString('base64url')}.${sig}`;

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
      to:      email,
      subject: 'Your GLYA verification code',
      html: `
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:520px;margin:0 auto;background:#FAF7F1;border:1px solid #E7DFD2;border-radius:4px;overflow:hidden;">
          <div style="background:#211C17;padding:28px 32px;">
            <div style="font-family:Georgia,serif;font-size:22px;letter-spacing:0.36em;color:#EDE6D8;">GLYA</div>
          </div>
          <div style="padding:32px 32px 28px;">
            <p style="font-size:15px;color:#4A423A;line-height:1.7;margin:0 0 24px;">
              Use the code below to verify your email address and continue to checkout.
            </p>
            <div style="text-align:center;background:#fff;border:1px solid #E7DFD2;border-radius:4px;padding:28px;">
              <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#6F6557;margin-bottom:12px;">Verification code</div>
              <div style="font-family:Georgia,serif;font-size:38px;letter-spacing:0.28em;color:#211C17;">${otp}</div>
              <div style="font-size:12px;color:#6F6557;margin-top:12px;">Expires in 10 minutes</div>
            </div>
            <p style="font-size:12.5px;color:#6F6557;line-height:1.7;margin:24px 0 0;">
              If you did not request this code, you can safely ignore this email.
            </p>
          </div>
          <div style="background:#F2EDE3;padding:16px 32px;border-top:1px solid #E7DFD2;">
            <p style="font-size:11.5px;color:#6F6557;margin:0;">© GLYA Fine Jewellery — Certified diamonds &amp; 22K gold</p>
          </div>
        </div>
      `,
    });

    return Response.json({ token });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to send OTP.';
    console.error('[GLYA send-otp]', err);
    return Response.json({ error: message }, { status: 500 });
  }
}
