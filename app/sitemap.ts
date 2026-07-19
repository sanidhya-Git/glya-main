import type { MetadataRoute } from 'next';
import { fetchAdminProducts, fetchAdminJournal } from '@/lib/api';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://glya.in';
  const now = new Date();

  const [products, posts] = await Promise.all([
    fetchAdminProducts(),
    fetchAdminJournal(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: base,                    lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${base}/browse`,        lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${base}/about`,         lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/contact`,       lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/journal`,       lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${base}/faq`,           lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/returns`,       lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${base}/terms`,         lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/privacy`,       lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ];

  const productPages: MetadataRoute.Sitemap = products.map(p => ({
    url: `${base}/product/${p.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const journalPages: MetadataRoute.Sitemap = posts.map(p => {
    let lastMod = now;
    try { lastMod = new Date(p.date); } catch { /* ignore */ }
    return {
      url: `${base}/journal/${p.slug || p.id}`,
      lastModified: lastMod,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    };
  });

  return [...staticPages, ...productPages, ...journalPages];
}
