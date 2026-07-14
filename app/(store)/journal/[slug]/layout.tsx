import type { Metadata } from 'next';
import { fetchAdminJournal } from '@/lib/api';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const posts = await fetchAdminJournal();
  const post = posts.find(p => p.slug === slug);

  if (!post) {
    return { title: 'Journal Article' };
  }

  const url = `https://glya.in/journal/${slug}`;
  const description = post.excerpt
    ? `${post.excerpt.slice(0, 155)} — Sree Sai Jewellers Jewellery Journal.`
    : `${post.title} — expert jewellery guide from Sree Sai Jewellers (GLYA), Pune.`;

  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: `${post.title} | GLYA Jewellery Journal`,
      description,
      images: post.coverImage ? [{ url: post.coverImage, alt: post.title }] : undefined,
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default function JournalArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
