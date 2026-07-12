import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 });
    }

    const body    = `${razorpay_order_id}|${razorpay_payment_id}`;
    const secret  = process.env.RAZORPAY_KEY_SECRET!;
    const digest  = crypto.createHmac('sha256', secret).update(body).digest('hex');

    if (digest !== razorpay_signature) {
      return NextResponse.json({ ok: false, error: 'Signature mismatch' }, { status: 400 });
    }

    return NextResponse.json({ ok: true, paymentId: razorpay_payment_id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Verification failed';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
