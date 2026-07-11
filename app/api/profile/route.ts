import { verifyOtpToken } from '@/lib/otp';

const BASE = process.env.NEXT_PUBLIC_GLYA_API_BASE ?? process.env.NEXT_PUBLIC_ADMIN_API ?? 'http://localhost:3001';
const KEY  = process.env.STOREFRONT_API_KEY;

function adminHeaders(): Record<string, string> {
  return { 'Content-Type': 'application/json', ...(KEY ? { 'x-storefront-key': KEY } : {}) };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email') || '';
  if (!email.includes('@')) {
    return Response.json({ error: 'Invalid email.' }, { status: 400 });
  }
  try {
    const res  = await fetch(`${BASE}/api/storefront/profile?email=${encodeURIComponent(email)}`, {
      headers: adminHeaders(),
      cache: 'no-store',
    });
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch {
    return Response.json({ error: 'Could not load profile.' }, { status: 502 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email:  string = String(body.email  || '');
    const action: string = String(body.action || '');
    if (!email.includes('@')) {
      return Response.json({ error: 'Invalid email.' }, { status: 400 });
    }

    /* OTP gate for sensitive changes:
       - phone change → code sent to the account email
       - email change → code sent to the OLD email */
    if (action === 'change-email' || (action === 'update' && body.phone !== undefined)) {
      const check = verifyOtpToken(email, String(body.otp ?? ''), String(body.token ?? ''));
      if (!check.ok) {
        return Response.json({ error: check.error }, { status: 400 });
      }
    }

    const allowed = ['update', 'change-email', 'add-address', 'delete-address', 'set-default'];
    if (!allowed.includes(action)) {
      return Response.json({ error: 'Unknown action.' }, { status: 400 });
    }

    const res  = await fetch(`${BASE}/api/storefront/profile`, {
      method: 'POST',
      headers: adminHeaders(),
      body: JSON.stringify({
        email,
        action,
        name:      body.name,
        phone:     body.phone,
        newEmail:  body.newEmail,
        address:   body.address,
        addressId: body.addressId,
      }),
    });
    const data = await res.json().catch(() => ({}));
    return Response.json(data, { status: res.status });
  } catch (err) {
    console.error('[GLYA profile]', err);
    return Response.json({ error: 'Profile update failed.' }, { status: 500 });
  }
}
