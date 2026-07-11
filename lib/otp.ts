import { createHmac } from 'crypto';

const SECRET = process.env.OTP_SECRET || 'glya-otp-fallback-secret';

export type OtpCheck =
  | { ok: true }
  /* soft = wrong code (user typo, retryable); hard errors mean a bad/expired token */
  | { ok: false; error: string; soft?: boolean };

/** Validates an HMAC-signed OTP token issued by /api/send-otp against the given email + code. */
export function verifyOtpToken(email: string, otp: string, token: string): OtpCheck {
  if (!email || !otp || !token) return { ok: false, error: 'Missing required fields.' };

  const parts = String(token).split('.');
  if (parts.length !== 2) return { ok: false, error: 'Malformed token.' };

  const [encoded, sig] = parts;
  let payload: string;
  try {
    payload = Buffer.from(encoded, 'base64url').toString();
  } catch {
    return { ok: false, error: 'Malformed token.' };
  }

  const expected = createHmac('sha256', SECRET).update(payload).digest('hex');
  if (sig !== expected) return { ok: false, error: 'Invalid token.' };

  const [tokenEmail, tokenOtp, expiresStr] = payload.split(':');

  if (Date.now() > Number(expiresStr)) {
    return { ok: false, error: 'OTP has expired. Please request a new one.' };
  }
  if (tokenEmail !== email) return { ok: false, error: 'Token email mismatch.' };
  if (tokenOtp !== String(otp)) return { ok: false, error: 'Invalid OTP. Please try again.', soft: true };

  return { ok: true };
}
