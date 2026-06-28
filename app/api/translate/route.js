import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { translateText } from '@/lib/translate';

const MAX_TEXT_BYTES = 5000;

export async function POST(request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { text, targetLangs } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    if (Buffer.byteLength(text, 'utf8') > MAX_TEXT_BYTES) {
      return NextResponse.json({ error: 'Text too long (max 5000 bytes)' }, { status: 413 });
    }

    const langs = targetLangs || ['gl', 'en'];
    const translations = {};

    await Promise.all(
      langs.map(async (lang) => {
        translations[lang] = await translateText(text, lang);
      })
    );

    return NextResponse.json({ translations });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
