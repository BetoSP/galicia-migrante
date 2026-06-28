import { createSupabaseServerClient } from '../supabase-server.js';

const POST_LIST_FIELDS =
  'id, slug, autor_id, autor_nombre, titulo, extracto, categoria, tags, estado, fecha_publicacion, created_at';

const POST_FULL_FIELDS =
  'id, slug, autor_id, autor_nombre, titulo, extracto, contenido, categoria, tags, estado, motivo_rechazo, fecha_publicacion, created_at';

function normalizePost(data) {
  return {
    id: data.id,
    slug: data.slug,
    autorId: data.autor_id,
    title: data.titulo,
    date: data.fecha_publicacion || '',
    excerpt: data.extracto || '',
    author: data.autor_nombre || 'Galicia Migrante',
    tags: data.tags || [],
    category: data.categoria || 'general',
    status: data.estado || 'borrador',
    createdAt: data.created_at,
  };
}

// ── Lecturas públicas (Server Components) ────────────────────────────────────

export async function getAllPosts() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select(POST_LIST_FIELDS)
    .eq('estado', 'publicado')
    .order('fecha_publicacion', { ascending: false });

  if (error) throw new Error(`getAllPosts: ${error.message}`);
  return (data || []).map(normalizePost);
}

export async function getAllPostSlugs() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('estado', 'publicado');

  if (error) throw new Error(`getAllPostSlugs: ${error.message}`);
  return (data || []).map((r) => r.slug);
}

export async function getPostBySlug(slug) {
  const supabase = await createSupabaseServerClient();
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
    motivoRechazo: data.motivo_rechazo || null,
  };
}

// Devuelve mapa de traducciones para el blog público: { gl: { title, excerpt, content }, en: {...}, ... }
// Vacío si el post no tiene traducciones almacenadas (publicado antes de migración 022).
export async function getPostTranslations(postId) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from('blog_post_translations')
    .select('lang, titulo, extracto, contenido')
    .eq('post_id', postId);

  if (!data || data.length === 0) return {};

  return Object.fromEntries(
    data.map(({ lang, titulo, extracto, contenido }) => [
      lang,
      { title: titulo || '', excerpt: extracto || '', content: contenido || '' },
    ])
  );
}

// Versión para el panel admin: incluye el flag es_manual por idioma.
export async function getPostTranslationsAdmin(postId) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from('blog_post_translations')
    .select('lang, titulo, extracto, contenido, es_manual, traducido_en')
    .eq('post_id', postId)
    .order('lang');

  return data || [];
}

// ── Admin: cola de moderación ─────────────────────────────────────────────────

export async function getPostsPendingReview() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select(POST_LIST_FIELDS)
    .eq('estado', 'en_revision')
    .order('created_at', { ascending: true });

  if (error) throw new Error(`getPostsPendingReview: ${error.message}`);
  return (data || []).map(normalizePost);
}

export async function getAllPostsForAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select(POST_LIST_FIELDS)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`getAllPostsForAdmin: ${error.message}`);
  return (data || []).map(normalizePost);
}
