import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const rzp = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { amount, orderNo } = await req.json();
    if (!amount || amount < 1) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const order = await rzp.orders.create({
      amount:   Math.round(amount * 100), // paise
      currency: 'INR',
      receipt:  orderNo ?? `GLY${Date.now()}`,
    });

    return NextResponse.json({
      orderId:  order.id,
      amount:   order.amount,
      currency: order.currency,
      keyId:    process.env.RAZORPAY_KEY_ID,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Payment initialisation failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
