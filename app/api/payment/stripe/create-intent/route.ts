import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-06-24.dahlia' });

export async function POST(req: Request) {
  try {
    const { amount, currency = 'inr', metadata } = await req.json();
    if (!amount || amount < 50) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // paise
      currency,
      metadata: metadata ?? {},
      payment_method_types: ['card'],
    });

    return NextResponse.json({ clientSecret: intent.client_secret });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Payment initialisation failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
