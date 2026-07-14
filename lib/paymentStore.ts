/**
 * In-memory stores shared across payment routes within the same server process.
 * Provides a best-effort extra security layer — primary security is enforced via
 * Razorpay/Stripe API calls in the verify endpoints.
 */

/** rzpOrderId → expected amount in paise (populated on create-order, consumed on verify) */
export const pendingRzpOrders = new Map<string, number>();

/** Set of payment IDs already used to finalise an order — prevents replay attacks */
export const usedPaymentIds = new Set<string>();

/** Auto-expire a pending Razorpay order entry after 15 minutes */
export function trackPendingRzpOrder(rzpOrderId: string, amountPaise: number) {
  pendingRzpOrders.set(rzpOrderId, amountPaise);
  setTimeout(() => pendingRzpOrders.delete(rzpOrderId), 15 * 60 * 1000);
}
