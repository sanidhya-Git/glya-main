import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import { usedPaymentIds } from '@/lib/paymentStore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-06-24.dahlia' });

export async function POST(req: Request) {
  // 10 verify attempts per IP per minute
  if (!rateLimit(`stripe-verify:${getClientIp(req)}`, 10, 60_000)) {
    return NextResponse.json({ ok: false, error: 'Too many requests. Please wait a moment.' }, { status: 429 });
  }

  try {
    const { paymentIntentId } = await req.json();

    if (!paymentIntentId || typeof paymentIntentId !== 'string' || !paymentIntentId.startsWith('pi_')) {
      return NextResponse.json({ ok: false, error: 'Invalid payment intent ID' }, { status: 400 });
    }

    // Replay attack prevention
    if (usedPaymentIds.has(paymentIntentId)) {
      return NextResponse.json({ ok: false, error: 'Payment already used' }, { status: 400 });
    }

    // Retrieve payment intent directly from Stripe — cannot be spoofed
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (intent.status !== 'succeeded') {
      return NextResponse.json({ ok: false, error: 'Payment not completed' }, { status: 400 });
    }

    if (intent.currency !== 'inr') {
      return NextResponse.json({ ok: false, error: 'Invalid currency' }, { status: 400 });
    }

    // Mark payment as used to block replay attacks
    usedPaymentIds.add(paymentIntentId);

    return NextResponse.json({ ok: true, paymentId: paymentIntentId });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Verification failed';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
