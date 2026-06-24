import { supabase } from './supabase';

/**
 * Devuelve todos los posts ordenados por fecha (más reciente primero).
 */
export async function getAllPosts() {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, autor_nombre, titulo, extracto, categoria, tags, estado, fecha_publicacion')
      .order('fecha_publicacion', { ascending: false });

    if (error) {
      console.error('Error fetching posts from Supabase:', error.message);
      return [];
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
    console.error('Failed to get posts:', err);
    return [];
  }
}

/**
 * Devuelve el contenido y metadata de un post por su slug.
 */
export async function getPostBySlug(slug) {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, autor_nombre, titulo, extracto, contenido, categoria, tags, estado, fecha_publicacion')
      .eq('slug', slug)
      .maybeSingle(); // Use maybeSingle to avoid 406/PGRST116 errors if not found

    if (error) {
      console.error(`Error fetching post by slug ${slug} from Supabase:`, error.message);
      return null;
    }

    if (!data) return null;

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
    console.error(`Failed to get post by slug ${slug}:`, err);
    return null;
  }
}

/**
 * Devuelve los slugs de todos los posts (para generateStaticParams).
 */
export async function getAllPostSlugs() {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug');

    if (error) {
      console.error('Error fetching post slugs from Supabase:', error.message);
      return [];
    }

    return (data || []).map(item => item.slug);
  } catch (err) {
    console.error('Failed to get post slugs:', err);
    return [];
  }
}
