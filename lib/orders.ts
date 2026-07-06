import type { AdminOrderPayload } from './api';
import type { Order, OrderLine, OrderStatus } from './store';

export function adminOrderToOrder(o: AdminOrderPayload): Order {
  const nameParts = (o.customer || '').trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName  = nameParts.slice(1).join(' ') || '';

  const lines: OrderLine[] = (o.lines || []).map(l => {
    const metaParts = l.meta.split(' · ');
    const metalStr  = metaParts[0] || '';
    const sizeMatch = l.meta.match(/Size\s+(\S+)/);
    const rawPrice  = parseInt((l.priceStr || '').replace(/[₹,\s]/g, ''), 10) || 0;
    const unitPrice = l.qty > 0 ? Math.round(rawPrice / l.qty) : rawPrice;
    return {
      productId: 0,
      name:      l.name,
      karat:     metalStr.split(' ')[0] || '',
      metal:     metalStr.includes('Gold') ? 'Gold' : metalStr.includes('Silver') ? 'Silver' : 'Platinum',
      size:      sizeMatch ? sizeMatch[1] : null,
      engraving: '',
      qty:       l.qty,
      unitPrice,
    };
  });

  let date = o.isoDate || '';
  if (!date && o.date) {
    try {
      const parsed = new Date(`${o.date} ${new Date().getFullYear()}`);
      if (!isNaN(parsed.getTime())) date = parsed.toISOString();
    } catch { /* ignore */ }
  }
  if (!date) date = new Date().toISOString();

  const addrStr  = o.address || '';
  const parts    = addrStr.split(', ');
  const len      = parts.length;

  return {
    orderNo:       o.no,
    date,
    lines,
    subtotal:      o.totalNum,
    discount:      0,
    deliveryCost:  0,
    giftWrapCost:  0,
    insuranceCost: 0,
    total:         o.totalNum,
    couponCode:    '',
    address: {
      firstName,
      lastName,
      mobile:  '',
      line1:   parts[0]          || '',
      line2:   len > 4 ? parts[1] : '',
      city:    len >= 4 ? parts[len - 4] : '',
      state:   len >= 3 ? parts[len - 3] : '',
      country: len >= 2 ? parts[len - 2] : '',
      pincode: len >= 1 ? parts[len - 1] : '',
    },
    deliveryMethod: '',
    payment:        o.payment || '',
    status:         (o.status || 'Confirmed') as OrderStatus,
  };
}
