'use client';
import { CardElement } from '@stripe/react-stripe-js';

const CARD_OPTS = {
  style: {
    base: {
      color: '#1A1814',
      fontFamily: "'Inter', sans-serif",
      fontSize: '14px',
      '::placeholder': { color: '#9E8E7E' },
    },
    invalid: { color: '#C0392B' },
  },
};

export default function StripeCardForm() {
  return (
    <div style={{ border: '1px solid var(--line)', borderRadius: 2, padding: '14px 16px', background: 'var(--paper)' }}>
      <CardElement options={CARD_OPTS} />
    </div>
  );
}
