import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const POST_LIST_FIELDS =
  'slug, autor_nombre, titulo, extracto, categoria, tags, estado, fecha_publicacion';

const POST_FULL_FIELDS =
  'slug, autor_nombre, titulo, extracto, contenido, categoria, tags, estado, fecha_publicacion';

function normalizePost(data) {
  return {
    slug: data.slug,
    title: data.titulo,
    date: data.fecha_publicacion || '',
    excerpt: data.extracto || '',
    author: data.autor_nombre || 'Galicia Migrante',
    tags: data.tags || [],
    category: data.categoria || 'general',
    status: data.estado || 'publicado',
  };
}

export async function getAllPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(POST_LIST_FIELDS)
    .eq('estado', 'publicado')
    .order('fecha_publicacion', { ascending: false });

  if (error) throw new Error(`getAllPosts: ${error.message}`);
  return (data || []).map(normalizePost);
}

export async function getAllPostSlugs() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('estado', 'publicado');

  if (error) throw new Error(`getAllPostSlugs: ${error.message}`);
  return (data || []).map((r) => r.slug);
}

export async function getPostBySlug(slug) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(POST_FULL_FIELDS)
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw new Error(`getPostBySlug(${slug}): ${error.message}`);
  if (!data) return null;

  return {
    ...normalizePost(data),
    content: data.contenido || '',
  };
}
