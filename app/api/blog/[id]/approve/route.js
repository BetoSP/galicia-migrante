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

    const { data: isAdmin, error: roleError } = await supabase.rpc('es_admin_general');
    if (roleError || !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    // Fetch post content for translation
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

    // Translate to all target languages in parallel
    const translations = await translatePost(
      post.titulo || '',
      post.extracto || '',
      post.contenido || ''
    );

    // Upsert translations into blog_post_translations
    const rows = ALL_TARGET_LANGS.map((lang) => ({
      post_id:     id,
      lang,
      titulo:      translations[lang]?.titulo   ?? null,
      extracto:    translations[lang]?.extracto ?? null,
      contenido:   translations[lang]?.contenido ?? null,
      traducido_en: new Date().toISOString(),
    }));

    const { error: upsertError } = await supabase
      .from('blog_post_translations')
      .upsert(rows, { onConflict: 'post_id,lang' });

    if (upsertError) {
      return NextResponse.json({ error: `Error guardando traducciones: ${upsertError.message}` }, { status: 500 });
    }

    // Mark post as published
    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({ estado: 'publicado', motivo_rechazo: null })
      .eq('id', id);

    if (updateError) {
      return NextResponse.json({ error: `Error publicando post: ${updateError.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, translatedLangs: ALL_TARGET_LANGS });
  } catch (err) {
    console.error('[approve]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
