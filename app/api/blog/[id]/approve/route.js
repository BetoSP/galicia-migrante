import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { translatePost, ALL_TARGET_LANGS } from '@/lib/translate';

export async function POST(request, { params }) {
  try {
    const supabase = await createSupabaseServerClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: isAdmin } = await supabase.rpc('es_admin_general');
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .select('id, titulo, extracto, contenido, estado')
      .eq('id', id)
      .maybeSingle();

    if (postError || !post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (post.estado === 'publicado') {
      return NextResponse.json({ error: 'Post already published' }, { status: 409 });
    }

    // Determine which langs have manual translations — those are preserved
    const { data: existing } = await supabase
      .from('blog_post_translations')
      .select('lang, es_manual')
      .eq('post_id', id);

    const manualLangs = new Set(
      (existing || []).filter((r) => r.es_manual).map((r) => r.lang)
    );

    const langsToTranslate = ALL_TARGET_LANGS.filter((l) => !manualLangs.has(l));

    let translatedLangs = [...manualLangs];

    if (langsToTranslate.length > 0) {
      const translations = await translatePost(
        post.titulo || '',
        post.extracto || '',
        post.contenido || '',
        langsToTranslate
      );

      const rows = langsToTranslate.map((lang) => ({
        post_id:      id,
        lang,
        titulo:       translations[lang]?.titulo   ?? null,
        extracto:     translations[lang]?.extracto ?? null,
        contenido:    translations[lang]?.contenido ?? null,
        es_manual:    false,
        traducido_en: new Date().toISOString(),
      }));

      const { error: upsertError } = await supabase
        .from('blog_post_translations')
        .upsert(rows, { onConflict: 'post_id,lang' });

      if (upsertError) {
        return NextResponse.json({ error: `Error guardando traducciones: ${upsertError.message}` }, { status: 500 });
      }

      translatedLangs = [...translatedLangs, ...langsToTranslate];
    }

    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({ estado: 'publicado', motivo_rechazo: null })
      .eq('id', id);

    if (updateError) {
      return NextResponse.json({ error: `Error publicando post: ${updateError.message}` }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      translatedLangs,
      preservedManual: [...manualLangs],
    });
  } catch (err) {
    console.error('[approve]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
