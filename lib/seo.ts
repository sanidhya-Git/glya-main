export const SITE_URL = 'https://glya.in';
export const SITE_NAME = 'GLYA — Sree Sai Jewellers';
export const SITE_DESCRIPTION =
  'Certified 22K gold, diamond & precious stone jewellery from Sree Sai Jewellers, Pune. BIS Hallmarked, IGI/GIA certified.';

/** Generate a URL slug from a product name + id for future SEO-friendly URLs */
export function productSlug(name: string, id: number): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60);
  return `${base}-${id}`;
}

/** Extract numeric ID from a slug that ends with the ID (e.g. "22k-gold-ring-42" → 42) */
export function idFromSlug(slug: string): number {
  const parts = slug.split('-');
  const last = parseInt(parts[parts.length - 1], 10);
  return isNaN(last) ? parseInt(slug, 10) : last;
}

/** Safe HTML → plain text (strips all tags) */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

/** Truncate to maxLength at a word boundary */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).replace(/\s+\S*$/, '') + '…';
}

/** Standard breadcrumb schema */
export function breadcrumbSchema(items: { name: string; url?: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}
