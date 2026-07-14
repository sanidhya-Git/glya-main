import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { computeServerTotal, type ServerCartItem } from '@/lib/serverPricing';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-06-24.dahlia' });

export async function POST(req: Request) {
  // 5 create-intent attempts per IP per minute
  if (!rateLimit(`stripe-create:${getClientIp(req)}`, 5, 60_000)) {
    return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { cartItems, couponCode, giftWrap, insurance, orderNo } = body as {
      cartItems:   ServerCartItem[];
      couponCode?: string;
      giftWrap?:   boolean;
      insurance?:  boolean;
      orderNo?:    string;
    };

    // Compute total server-side — client-sent amounts are NOT trusted
    const { total, error } = await computeServerTotal(
      cartItems,
      { couponCode, giftWrap: Boolean(giftWrap), insurance: Boolean(insurance) },
    );
    if (error) return NextResponse.json({ error }, { status: 400 });
    if (total < 100) {
      return NextResponse.json({ error: 'Minimum order amount is ₹100.' }, { status: 400 });
    }

    const amountPaise = Math.round(total * 100);
    const intent = await stripe.paymentIntents.create({
      amount:               amountPaise,
      currency:             'inr',
      payment_method_types: ['card'],
      metadata:             { orderNo: orderNo ?? '' },
    });

    return NextResponse.json({ clientSecret: intent.client_secret });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Payment initialisation failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
