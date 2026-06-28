import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { translatePost, ALL_TARGET_LANGS } from '@/lib/translate';

async function requireAdmin(supabase) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return false;
  const { data: isAdmin } = await supabase.rpc('es_admin_general');
  return !!isAdmin;
}

// POST /api/blog/[id]/translate-all
// Traduce titulo, extracto y contenido a los 5 idiomas en paralelo
// y los persiste en blog_post_translations con es_manual = false.
// Devuelve el mapa completo { gl: {...}, en: {...}, fr: {...}, de: {...}, it: {...} }.
export async function POST(request, { params }) {
  const supabase = await createSupabaseServerClient();
  if (!(await requireAdmin(supabase))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;

  const { data: post, error: postError } = await supabase
    .from('blog_posts')
    .select('titulo, extracto, contenido')
    .eq('id', id)
    .maybeSingle();

  if (postError || !post) {
    return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
  }

  const translations = await translatePost(
    post.titulo    || '',
    post.extracto  || '',
    post.contenido || '',
    ALL_TARGET_LANGS,
  );

  const now = new Date().toISOString();
  const rows = ALL_TARGET_LANGS.map((lang) => ({
    post_id:      id,
    lang,
    titulo:       translations[lang].titulo,
    extracto:     translations[lang].extracto,
    contenido:    translations[lang].contenido,
    es_manual:    false,
    traducido_en: now,
  }));

  const { error: upsertError } = await supabase
    .from('blog_post_translations')
    .upsert(rows, { onConflict: 'post_id,lang' });

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, translations });
}
