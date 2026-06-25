import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'app/blog/content/posts');

// ─── LOCAL FALLBACK IMPLEMENTATION ─────────────────────────────────────────

function getLocalAllPosts() {
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
      category: data.category ?? data.categoria ?? 'general',
      status: data.status ?? data.estado ?? 'publicado',
    };
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

function getLocalPostBySlug(slug) {
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
    category: data.category ?? data.categoria ?? 'general',
    status: data.status ?? data.estado ?? 'publicado',
    content,
  };
}

function getLocalPostSlugs() {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}


// ─── API EXPORTS WITH AUTOMATIC DB FALLBACK ─────────────────────────────────

/**
 * Devuelve todos los posts ordenados por fecha.
 * Si la tabla 'blog_posts' no existe o falla la conexión, lee los MDX locales.
 */
export async function getAllPosts() {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, autor_nombre, titulo, extracto, categoria, tags, estado, fecha_publicacion')
      .order('fecha_publicacion', { ascending: false });

    if (error) {
      // Si la tabla no está creada en Supabase, recurre al disco local en silencio para no romper el desarrollo local
      if (error.message && (error.message.includes('relation "blog_posts" does not exist') || error.message.includes('schema cache'))) {
        console.warn('Supabase: La tabla blog_posts no existe aún. Leyendo posts locales en mdx.');
        return getLocalAllPosts();
      }
      console.error('Error fetching posts from Supabase:', error.message);
      return getLocalAllPosts();
    }

    return (data || []).map(post => ({
      slug: post.slug,
      title: post.titulo,
      date: post.fecha_publicacion || '',
      excerpt: post.extracto || '',
      author: post.autor_nombre || 'Galicia Migrante',
      tags: post.tags || [],
      category: post.categoria || 'general',
      status: post.estado || 'publicado',
    }));
  } catch (err) {
    console.warn('Error al conectar con Supabase. Usando posts en mdx locales.');
    return getLocalAllPosts();
  }
}

/**
 * Devuelve el contenido de un post por su slug.
 * Si falla la consulta, busca en los MDX locales.
 */
export async function getPostBySlug(slug) {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, autor_nombre, titulo, extracto, contenido, categoria, tags, estado, fecha_publicacion')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      if (error.message && (error.message.includes('relation "blog_posts" does not exist') || error.message.includes('schema cache'))) {
        return getLocalPostBySlug(slug);
      }
      console.error(`Error fetching post by slug ${slug} from Supabase:`, error.message);
      return getLocalPostBySlug(slug);
    }

    if (!data) {
      return getLocalPostBySlug(slug);
    }

    return {
      slug: data.slug,
      title: data.titulo,
      date: data.fecha_publicacion || '',
      excerpt: data.extracto || '',
      author: data.autor_nombre || 'Galicia Migrante',
      tags: data.tags || [],
      category: data.categoria || 'general',
      status: data.estado || 'publicado',
      content: data.contenido || '',
    };
  } catch (err) {
    return getLocalPostBySlug(slug);
  }
}

/**
 * Devuelve todos los slugs.
 */
export async function getAllPostSlugs() {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug');

    if (error) {
      if (error.message && (error.message.includes('relation "blog_posts" does not exist') || error.message.includes('schema cache'))) {
        return getLocalPostSlugs();
      }
      console.error('Error fetching post slugs from Supabase:', error.message);
      return getLocalPostSlugs();
    }

    return (data || []).map(item => item.slug);
  } catch (err) {
    return getLocalPostSlugs();
  }
}
