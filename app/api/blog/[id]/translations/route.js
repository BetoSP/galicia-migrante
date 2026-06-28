import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { translateText } from '@/lib/translate';

async function requireAdmin(supabase) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return false;
  const { data: isAdmin } = await supabase.rpc('es_admin_general');
  return !!isAdmin;
}

// GET /api/blog/[id]/translations
// Devuelve todas las traducciones del post con el flag es_manual.
export async function GET(request, { params }) {
  const supabase = await createSupabaseServerClient();
  if (!(await requireAdmin(supabase))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;

  const { data, error } = await supabase
    .from('blog_post_translations')
    .select('lang, titulo, extracto, contenido, es_manual, traducido_en')
    .eq('post_id', id)
    .order('lang');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ translations: data || [] });
}

// PATCH /api/blog/[id]/translations
// Body A — edición manual:    { lang, titulo?, extracto?, contenido? }
//   → actualiza los campos provistos y marca es_manual = true
// Body B — restablecer auto:  { lang, resetManual: true }
//   → re-traduce desde el español y marca es_manual = false
export async function PATCH(request, { params }) {
  const supabase = await createSupabaseServerClient();
  if (!(await requireAdmin(supabase))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const { lang, resetManual, titulo, extracto, contenido } = body;

  if (!lang) return NextResponse.json({ error: 'lang is required' }, { status: 400 });

  if (resetManual) {
    // Fetch original Spanish content from blog_posts
    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .select('titulo, extracto, contenido')
      .eq('id', id)
      .maybeSingle();

    if (postError || !post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const [tTitle, tExcerpt, tContent] = await Promise.all([
      translateText(post.titulo   || '', lang),
      translateText(post.extracto || '', lang),
      translateText(post.contenido || '', lang),
    ]);

    const { error } = await supabase
      .from('blog_post_translations')
      .upsert({
        post_id:      id,
        lang,
        titulo:       tTitle,
        extracto:     tExcerpt,
        contenido:    tContent,
        es_manual:    false,
        traducido_en: new Date().toISOString(),
      }, { onConflict: 'post_id,lang' });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, lang, es_manual: false, titulo: tTitle, extracto: tExcerpt, contenido: tContent });
  }

  // Manual edit — only update the provided fields
  const updates = { es_manual: true, traducido_en: new Date().toISOString() };
  if (titulo   !== undefined) updates.titulo   = titulo;
  if (extracto !== undefined) updates.extracto = extracto;
  if (contenido !== undefined) updates.contenido = contenido;

  const { error } = await supabase
    .from('blog_post_translations')
    .upsert({ post_id: id, lang, ...updates }, { onConflict: 'post_id,lang' });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, lang, es_manual: true });
}
