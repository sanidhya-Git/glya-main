import { createHmac } from 'crypto';

const SECRET = process.env.OTP_SECRET || 'glya-otp-fallback-secret';

export async function POST(request: Request) {
  try {
    const { email, otp, token } = await request.json();

    if (!email || !otp || !token) {
      return Response.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const parts = String(token).split('.');
    if (parts.length !== 2) {
      return Response.json({ error: 'Malformed token.' }, { status: 400 });
    }

    const [encoded, sig] = parts;
    let payload: string;
    try {
      payload = Buffer.from(encoded, 'base64url').toString();
    } catch {
      return Response.json({ error: 'Malformed token.' }, { status: 400 });
    }

    const expected = createHmac('sha256', SECRET).update(payload).digest('hex');
    if (sig !== expected) {
      return Response.json({ error: 'Invalid token.' }, { status: 400 });
    }

    const [tokenEmail, tokenOtp, expiresStr] = payload.split(':');

    if (Date.now() > Number(expiresStr)) {
      return Response.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 });
    }

    if (tokenEmail !== email) {
      return Response.json({ error: 'Token email mismatch.' }, { status: 400 });
    }

    if (tokenOtp !== String(otp)) {
      return Response.json({ success: false, error: 'Invalid OTP. Please try again.' });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error('[GLYA verify-otp]', err);
    return Response.json({ error: 'Verification failed.' }, { status: 500 });
  }
}
