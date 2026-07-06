import { fetchAdminOrders } from '@/lib/api';
import { adminOrderToOrder } from '@/lib/orders';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  if (!email || !email.includes('@')) {
    return Response.json({ error: 'Invalid email.' }, { status: 400 });
  }
  try {
    const all    = await fetchAdminOrders();
    const orders = all.filter(o => o.email === email).map(adminOrderToOrder);
    return Response.json({ orders });
  } catch {
    return Response.json({ orders: [] });
  }
}
