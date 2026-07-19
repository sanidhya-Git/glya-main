import type { Metadata } from 'next';
import { fetchAdminProducts, fetchAdminPricing } from '@/lib/api';
import { priceOf, karatLabel } from '@/lib/catalog';

type Props = { params: Promise<{ id: string }>; children: React.ReactNode };

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

export async function generateMetadata({ params }: Omit<Props, 'children'>): Promise<Metadata> {
  const { id } = await params;
  const products = await fetchAdminProducts();
  const p = products.find(x => x.id === Number(id));

  if (!p) {
    return {
      title: 'Product Not Found',
      description: 'This jewellery piece may have been retired. Browse our full collection.',
      robots: { index: false },
    };
  }

  const karat = p.karat;
  const metalStr = karatLabel(karat);
  const title = `${p.name} — ${metalStr}`;
  const rawBlurb = stripHtml(p.blurb || '');
  const desc = rawBlurb
    ? `${rawBlurb.slice(0, 150)}. BIS Hallmarked — Sree Sai Jewellers (GLYA), Pune.`
    : `Buy ${p.name} — ${metalStr}${p.gem ? `, ${p.gem}` : ''}. BIS Hallmarked, IGI certified. Free insured shipping across India.`;

  const image = p.images?.[0];
  const url = `https://glya.in/product/${id}`;

  const keywords = [
    p.name,
    `${metalStr}`,
    `${p.cat} jewellery`,
    `buy ${p.cat.toLowerCase()} online India`,
    `${p.metal.toLowerCase()} jewellery Pune`,
    `BIS hallmarked ${p.metal.toLowerCase()} jewellery`,
    `${karat} ${p.cat.toLowerCase()}`,
    ...(p.gem ? [p.gem, `${p.gem} ${p.cat.toLowerCase()}`] : []),
    ...(p.col ? [`${p.col} collection jewellery`] : []),
    'Sree Sai Jewellers',
    'GLYA fine jewellery',
    'certified jewellery India',
  ];

  return {
    title,
    description: desc,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: `${p.name} — ${metalStr} | GLYA — Sree Sai Jewellers`,
      description: desc,
      images: image
        ? [{ url: image, alt: p.name, width: 800, height: 800 }]
        : undefined,
      siteName: 'GLYA — Sree Sai Jewellers',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${p.name} — ${metalStr} | GLYA`,
      description: desc,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductLayout({ children, params }: Props) {
  const { id } = await params;

  const [products, pricing] = await Promise.all([
    fetchAdminProducts(),
    fetchAdminPricing(),
  ]);

  const p = products.find(x => x.id === Number(id));
  if (!p) return <>{children}</>;

  const goldRate = pricing?.goldRate24k ?? 7200;
  const silverRate = pricing?.silverRate ?? 94;
  const platinumRate = pricing?.platinumRate ?? 3380;
  const pr = priceOf(p, p.karat, { gold: goldRate, silver: silverRate, platinum: platinumRate });

  const url = `https://glya.in/product/${id}`;
  const image = p.images?.[0];
  const priceValidUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const rawBlurb = stripHtml(p.blurb || '');
  const metalStr = karatLabel(p.karat);

  const productSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        '@id': `${url}#product`,
        name: p.name,
        description: rawBlurb || `${p.name} — ${metalStr}${p.gem ? `, ${p.gem}` : ''}. BIS Hallmarked fine jewellery from Sree Sai Jewellers, Pune.`,
        sku: `GLYA-${id}`,
        mpn: `GLYA-${id}`,
        brand: {
          '@type': 'Brand',
          name: 'GLYA — Sree Sai Jewellers',
          url: 'https://glya.in',
        },
        manufacturer: {
          '@type': 'Organization',
          name: 'Sree Sai Jewellers',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Koregaon Park',
            addressLocality: 'Pune',
            addressRegion: 'Maharashtra',
            postalCode: '411001',
            addressCountry: 'IN',
          },
        },
        material: `${p.metal} (${p.karat})`,
        color: p.metal === 'Gold' && p.karat === '22K' ? 'Yellow Gold' : p.metal === 'Silver' ? 'Silver' : p.metal,
        weight: {
          '@type': 'QuantitativeValue',
          value: p.weightG,
          unitCode: 'GRM',
          unitText: 'grams',
        },
        category: `Jewellery > ${p.cat}`,
        ...(image ? {
          image: [
            { '@type': 'ImageObject', '@id': `${url}#image-0`, url: image, name: p.name, description: `${p.name} — ${metalStr}` },
            ...(p.images?.slice(1, 4).map((img, i) => ({
              '@type': 'ImageObject',
              '@id': `${url}#image-${i + 1}`,
              url: img,
              name: p.name,
            })) ?? []),
          ],
        } : {}),
        offers: {
          '@type': 'Offer',
          '@id': `${url}#offer`,
          url,
          priceCurrency: 'INR',
          price: pr.total,
          priceValidUntil,
          availability: 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: {
            '@type': 'Organization',
            name: 'GLYA — Sree Sai Jewellers',
            url: 'https://glya.in',
          },
          hasMerchantReturnPolicy: {
            '@type': 'MerchantReturnPolicy',
            applicableCountry: 'IN',
            returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
            merchantReturnDays: 30,
            returnMethod: 'https://schema.org/ReturnByMail',
            returnFees: 'https://schema.org/FreeReturn',
          },
          shippingDetails: {
            '@type': 'OfferShippingDetails',
            shippingRate: {
              '@type': 'MonetaryAmount',
              value: '0',
              currency: 'INR',
            },
            shippingDestination: {
              '@type': 'DefinedRegion',
              addressCountry: 'IN',
            },
            deliveryTime: {
              '@type': 'ShippingDeliveryTime',
              handlingTime: {
                '@type': 'QuantitativeValue',
                minValue: 1,
                maxValue: 2,
                unitCode: 'DAY',
              },
              transitTime: {
                '@type': 'QuantitativeValue',
                minValue: 3,
                maxValue: 5,
                unitCode: 'DAY',
              },
            },
          },
        },
        ...(p.rating > 0 ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: p.rating.toFixed(1),
            reviewCount: Math.max(p.reviews, 1),
            bestRating: '5',
            worstRating: '1',
          },
        } : {}),
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'Metal', value: p.metal },
          { '@type': 'PropertyValue', name: 'Purity', value: p.karat },
          { '@type': 'PropertyValue', name: 'Weight', value: `${p.weightG}g` },
          { '@type': 'PropertyValue', name: 'BIS Hallmarked', value: 'Yes' },
          ...(p.gem ? [{ '@type': 'PropertyValue', name: 'Gemstone', value: p.gem }] : []),
          ...(p.col ? [{ '@type': 'PropertyValue', name: 'Collection', value: p.col }] : []),
        ],
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://glya.in' },
          { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://glya.in/browse' },
          { '@type': 'ListItem', position: 3, name: p.cat, item: `https://glya.in/browse?cat=${encodeURIComponent(p.cat)}` },
          { '@type': 'ListItem', position: 4, name: p.name, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {children}
    </>
  );
}
