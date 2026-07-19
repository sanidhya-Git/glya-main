import type { Metadata } from 'next';
import { fetchAdminJournal } from '@/lib/api';

type Props = { params: Promise<{ slug: string }>; children: React.ReactNode };

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

function readTimeMin(body: string, excerpt: string): number {
  const text = `${body} ${excerpt}`.replace(/<[^>]+>/g, ' ');
  return Math.max(2, Math.ceil(text.trim().split(/\s+/).filter(Boolean).length / 200));
}

export async function generateMetadata({ params }: Omit<Props, 'children'>): Promise<Metadata> {
  const { slug } = await params;
  const posts = await fetchAdminJournal();
  const post = posts.find(p => p.slug === slug || p.id === slug);

  if (!post) {
    return {
      title: 'Journal Article',
      description: 'Expert jewellery guides from Sree Sai Jewellers (GLYA), Pune.',
      robots: { index: false },
    };
  }

  const url = `https://glya.in/journal/${slug}`;
  const rawExcerpt = stripHtml(post.excerpt || '');
  const description = rawExcerpt
    ? `${rawExcerpt.slice(0, 155)} — GLYA Jewellery Journal.`
    : `${post.title} — expert jewellery guide from Sree Sai Jewellers (GLYA), Pune.`;

  const keywords = [
    post.title,
    post.category,
    'jewellery guide India',
    'gold jewellery buying guide',
    'diamond jewellery tips',
    'BIS hallmark guide',
    'GLYA journal',
    'Sree Sai Jewellers blog',
    'fine jewellery India',
  ].filter(Boolean);

  return {
    title: post.title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: `${post.title} | GLYA Jewellery Journal`,
      description,
      images: post.coverImage ? [{ url: post.coverImage, alt: post.title, width: 1200, height: 630 }] : undefined,
      publishedTime: post.date,
      authors: ['GLYA — Sree Sai Jewellers'],
      tags: [post.category, 'jewellery', 'gold', 'fine jewellery India'],
      siteName: 'GLYA — Sree Sai Jewellers',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function JournalArticleLayout({ children, params }: Props) {
  const { slug } = await params;
  const posts = await fetchAdminJournal();
  const post = posts.find(p => p.slug === slug || p.id === slug);

  if (!post) return <>{children}</>;

  const url = `https://glya.in/journal/${slug}`;
  const rawExcerpt = stripHtml(post.excerpt || '');
  const rawBody = stripHtml(post.body || '');
  const readMins = readTimeMin(post.body || '', post.excerpt || '');

  const articleSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: post.title,
        description: rawExcerpt || `${post.title} — jewellery guide by GLYA.`,
        datePublished: post.date,
        dateModified: post.date,
        author: {
          '@type': 'Organization',
          name: 'GLYA — Sree Sai Jewellers',
          url: 'https://glya.in',
        },
        publisher: {
          '@type': 'Organization',
          '@id': 'https://glya.in/#business',
          name: 'GLYA — Sree Sai Jewellers',
          logo: {
            '@type': 'ImageObject',
            url: 'https://glya.in/icon',
            width: 32,
            height: 32,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': url,
        },
        ...(post.coverImage ? {
          image: {
            '@type': 'ImageObject',
            url: post.coverImage,
            name: post.title,
          },
        } : {}),
        articleSection: post.category,
        keywords: `${post.category}, jewellery, gold, fine jewellery India`,
        timeRequired: `PT${readMins}M`,
        wordCount: rawBody.split(/\s+/).filter(Boolean).length || undefined,
        inLanguage: 'en-IN',
        isPartOf: {
          '@type': 'Blog',
          '@id': 'https://glya.in/journal#blog',
          name: 'The GLYA Journal',
          url: 'https://glya.in/journal',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://glya.in' },
          { '@type': 'ListItem', position: 2, name: 'Journal', item: 'https://glya.in/journal' },
          { '@type': 'ListItem', position: 3, name: post.category, item: `https://glya.in/journal?category=${encodeURIComponent(post.category)}` },
          { '@type': 'ListItem', position: 4, name: post.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {children}
    </>
  );
}
