import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Track Your Order',
  description: 'Track the delivery status of your GLYA jewellery order.',
  robots: { index: false, follow: false },
};

export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
