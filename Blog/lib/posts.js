import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/posts');

/**
 * Devuelve todos los posts ordenados por fecha (más reciente primero).
 */
export function getAllPosts() {
  if (!fs.existsSync(postsDirectory)) return [];

  const fileNames = fs.readdirSync(postsDirectory).filter((f) => f.endsWith('.mdx'));

  const posts = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.mdx$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    return {
      slug,
      title: data.title ?? 'Sin título',
      date: data.date ?? '',
      excerpt: data.excerpt ?? '',
      author: data.author ?? 'Galicia Migrante',
      tags: data.tags ?? [],
      coverImage: data.coverImage ?? null,
    };
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/**
 * Devuelve el contenido y metadata de un post por su slug.
 */
export function getPostBySlug(slug) {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title ?? 'Sin título',
    date: data.date ?? '',
    excerpt: data.excerpt ?? '',
    author: data.author ?? 'Galicia Migrante',
    tags: data.tags ?? [],
    coverImage: data.coverImage ?? null,
    content,
  };
}

/**
 * Devuelve los slugs de todos los posts (para generateStaticParams).
 */
export function getAllPostSlugs() {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}
