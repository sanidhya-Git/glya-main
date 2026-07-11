import { fetchAdminOrders } from '@/lib/api';
import { adminOrderToOrder } from '@/lib/orders';
import { verifyOtpToken } from '@/lib/otp';

export async function POST(request: Request) {
  try {
    const { email, otp, token } = await request.json();

    const check = verifyOtpToken(email, otp, token);
    if (!check.ok) {
      if (check.soft) return Response.json({ success: false, error: check.error });
      return Response.json({ error: check.error }, { status: 400 });
    }

    // Fetch this user's past orders from the admin backend
    let orders: ReturnType<typeof adminOrderToOrder>[] = [];
    try {
      const all = await fetchAdminOrders();
      orders = all.filter(o => o.email === email).map(adminOrderToOrder);
    } catch { /* non-fatal — client still logs in */ }

    return Response.json({ success: true, orders });
  } catch (err) {
    console.error('[GLYA verify-otp]', err);
    return Response.json({ error: 'Verification failed.' }, { status: 500 });
  }
}
