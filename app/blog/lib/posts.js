import { supabase } from '@/lib/supabase';

/**
 * Devuelve todos los posts ordenados por fecha.
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
    console.error('Error in getAllPosts:', err.message);
    return [];
  }
}

/**
 * Devuelve el contenido de un post por su slug.
 */
export async function getPostBySlug(slug) {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, autor_nombre, titulo, extracto, contenido, categoria, tags, estado, fecha_publicacion')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching post by slug ${slug} from Supabase:`, error.message);
      return null;
    }

    if (!data) {
      return null;
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
    console.error('Error in getPostBySlug:', err.message);
    return null;
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
      console.error('Error fetching post slugs from Supabase:', error.message);
      return [];
    }

    return (data || []).map(item => item.slug);
  } catch (err) {
    console.error('Error in getAllPostSlugs:', err.message);
    return [];
  }
}
