import { notFound } from 'next/navigation';
import { getPostBySlug, getPostTranslations } from '@/lib/blog/posts';
import PostContent from './components/PostContent';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} — Galicia Migrante`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const translations = await getPostTranslations(post.id);

  return <PostContent post={post} translations={translations} />;
}
