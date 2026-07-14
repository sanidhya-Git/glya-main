import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { computeServerTotal, type ServerCartItem } from '@/lib/serverPricing';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import { trackPendingRzpOrder } from '@/lib/paymentStore';

const rzp = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  // 5 create-order attempts per IP per minute
  if (!rateLimit(`rzp-create:${getClientIp(req)}`, 5, 60_000)) {
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
    const safeReceipt = (orderNo ?? '').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 40) || `GLY${Date.now()}`;

    const order = await rzp.orders.create({
      amount:   amountPaise,
      currency: 'INR',
      receipt:  safeReceipt,
    });

    // Store expected amount so verify step can cross-check
    trackPendingRzpOrder(order.id, amountPaise);

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
