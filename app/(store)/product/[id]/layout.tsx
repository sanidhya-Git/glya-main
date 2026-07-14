import type { Metadata } from 'next';
import { fetchAdminProducts } from '@/lib/api';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const products = await fetchAdminProducts();
  const p = products.find(x => x.id === Number(id));

  if (!p) {
    return {
      title: 'Product',
      description: 'Fine jewellery from Sree Sai Jewellers (GLYA), Pune.',
    };
  }

  const title = `${p.name} — ${p.karat} ${p.metal}`;
  const description = p.blurb
    ? `${p.blurb.slice(0, 140)} | Sree Sai Jewellers (GLYA), Pune.`
    : `${p.name} — ${p.karat} ${p.metal}${p.gem ? `, ${p.gem}` : ''}. BIS Hallmarked, certified. Shop at Sree Sai Jewellers (GLYA), Pune.`;

  const image = p.images?.[0];
  const url = `https://glya.in/product/${id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      url,
      title: `${title} | GLYA — Sree Sai Jewellers`,
      description,
      images: image ? [{ url: image, alt: p.name }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | GLYA — Sree Sai Jewellers`,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
