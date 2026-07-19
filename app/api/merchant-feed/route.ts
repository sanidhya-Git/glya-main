import { NextResponse } from 'next/server';
import { fetchAdminProducts, fetchAdminPricing } from '@/lib/api';
import { priceOf, karatLabel } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

function availability(stock?: number): string {
  if (stock === undefined) return 'in_stock';
  return stock > 0 ? 'in_stock' : 'out_of_stock';
}

export async function GET() {
  const [products, pricing] = await Promise.all([
    fetchAdminProducts(),
    fetchAdminPricing(),
  ]);

  const goldRate = pricing?.goldRate24k ?? 7200;
  const silverRate = pricing?.silverRate ?? 94;
  const platinumRate = pricing?.platinumRate ?? 3380;

  const BASE = 'https://glya.in';

  const items = products.map(p => {
    const pr = priceOf(p, p.karat, { gold: goldRate, silver: silverRate, platinum: platinumRate });
    const priceINR = pr.total.toFixed(2);
    const image = p.images?.[0] ?? '';
    const link = `${BASE}/product/${p.id}`;
    const blurb = esc(stripHtml(p.blurb || `${p.name} — ${karatLabel(p.karat)} jewellery from Sree Sai Jewellers, Pune.`).slice(0, 4999));
    const title = esc(`${p.name} — ${karatLabel(p.karat)}`);
    const condition = 'new';
    const brand = 'GLYA — Sree Sai Jewellers';
    const gtin = '';
    const mpn = `GLYA-${p.id}`;

    const additionalImages = (p.images ?? []).slice(1, 10).map(img => `
      <g:additional_image_link>${esc(img)}</g:additional_image_link>`).join('');

    return `
    <item>
      <g:id>${esc(mpn)}</g:id>
      <g:title>${title}</g:title>
      <g:description>${blurb}</g:description>
      <g:link>${esc(link)}</g:link>
      ${image ? `<g:image_link>${esc(image)}</g:image_link>` : ''}${additionalImages}
      <g:availability>${availability(p.stock)}</g:availability>
      <g:price>${priceINR} INR</g:price>
      <g:condition>${condition}</g:condition>
      <g:brand>${esc(brand)}</g:brand>
      <g:mpn>${esc(mpn)}</g:mpn>
      ${gtin ? `<g:gtin>${esc(gtin)}</g:gtin>` : ''}
      <g:product_type>Jewellery &gt; ${esc(p.cat)}</g:product_type>
      <g:google_product_category>188</g:google_product_category>
      <g:material>${esc(p.gem ? `${p.gem} set ${p.metal}` : p.metal)}</g:material>
      <g:identifier_exists>false</g:identifier_exists>
      <g:shipping>
        <g:country>IN</g:country>
        <g:service>Standard Insured Shipping</g:service>
        <g:price>0 INR</g:price>
      </g:shipping>
      <g:tax>
        <g:country>IN</g:country>
        <g:rate>3</g:rate>
        <g:tax_ship>no</g:tax_ship>
      </g:tax>
      <g:custom_label_0>${esc(p.metal)}</g:custom_label_0>
      <g:custom_label_1>${esc(p.karat)}</g:custom_label_1>
      <g:custom_label_2>${esc(p.cat)}</g:custom_label_2>
      <g:custom_label_3>${esc(p.col || '')}</g:custom_label_3>
    </item>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>GLYA — Sree Sai Jewellers</title>
    <link>${BASE}</link>
    <description>Certified fine gold, diamond &amp; precious stone jewellery from Sree Sai Jewellers, Pune. BIS Hallmarked, IGI/GIA certified.</description>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
