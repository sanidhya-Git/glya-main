import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/checkout', '/account', '/cart', '/wishlist', '/track'],
      },
    ],
    sitemap: 'https://glya.in/sitemap.xml',
    host: 'https://glya.in',
  };
}
