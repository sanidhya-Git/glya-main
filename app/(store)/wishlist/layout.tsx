import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Wishlist',
  description: 'Your saved jewellery pieces from GLYA — Sree Sai Jewellers.',
  robots: { index: false, follow: false },
};

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
