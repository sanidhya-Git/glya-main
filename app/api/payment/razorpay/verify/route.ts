import { NextResponse } from 'next/server';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import { pendingRzpOrders, usedPaymentIds } from '@/lib/paymentStore';

const rzp = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  // 10 verify attempts per IP per minute
  if (!rateLimit(`rzp-verify:${getClientIp(req)}`, 10, 60_000)) {
    return NextResponse.json({ ok: false, error: 'Too many requests. Please wait a moment.' }, { status: 429 });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature ||
        typeof razorpay_order_id !== 'string' ||
        typeof razorpay_payment_id !== 'string' ||
        typeof razorpay_signature !== 'string') {
      return NextResponse.json({ ok: false, error: 'Missing or invalid fields' }, { status: 400 });
    }

    // Replay attack prevention — one payment ID per order only
    if (usedPaymentIds.has(razorpay_payment_id)) {
      return NextResponse.json({ ok: false, error: 'Payment already used' }, { status: 400 });
    }

    // 1. Verify HMAC signature using timing-safe comparison
    const secret  = process.env.RAZORPAY_KEY_SECRET!;
    const body    = `${razorpay_order_id}|${razorpay_payment_id}`;
    const digest  = crypto.createHmac('sha256', secret).update(body).digest('hex');
    const sigBuf  = Buffer.from(razorpay_signature, 'hex');
    const digBuf  = Buffer.from(digest, 'hex');

    // Length must match before timingSafeEqual to avoid exceptions
    if (sigBuf.length !== digBuf.length || !crypto.timingSafeEqual(digBuf, sigBuf)) {
      return NextResponse.json({ ok: false, error: 'Signature mismatch' }, { status: 400 });
    }

    // 2. Fetch the actual payment from Razorpay API to verify status and amount
    const payment = await rzp.payments.fetch(razorpay_payment_id) as {
      id: string; status: string; amount: number; order_id: string; currency: string;
    };

    if (payment.order_id !== razorpay_order_id) {
      return NextResponse.json({ ok: false, error: 'Order ID mismatch' }, { status: 400 });
    }

    // Accept 'captured' (auto-capture) or 'authorized' (manual-capture accounts)
    if (payment.status !== 'captured' && payment.status !== 'authorized') {
      return NextResponse.json({ ok: false, error: 'Payment not completed' }, { status: 400 });
    }

    if (payment.currency !== 'INR') {
      return NextResponse.json({ ok: false, error: 'Invalid currency' }, { status: 400 });
    }

    // 3. Cross-check amount with what server originally created the order for
    const expectedPaise = pendingRzpOrders.get(razorpay_order_id);
    if (expectedPaise !== undefined && payment.amount !== expectedPaise) {
      return NextResponse.json({ ok: false, error: 'Payment amount does not match order' }, { status: 400 });
    }

    // Mark payment as used to block replays
    usedPaymentIds.add(razorpay_payment_id);
    pendingRzpOrders.delete(razorpay_order_id);

    return NextResponse.json({ ok: true, paymentId: razorpay_payment_id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Verification failed';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
