import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

const MAX_TEXT_BYTES = 5000;

// Motor de traducción real y gratuito (MyMemory API) con fallback
const translateText = async (text, targetLang) => {
  if (!text) return '';
  
  // Limpiar etiquetas de autotraducción previas si existieran para evitar acumulación
  const cleanText = text
    .replace(/^\[GL Autotraducción\]\s*/i, '')
    .replace(/^\[EN Autotranslation\]\s*/i, '')
    .trim();

  try {
    // MyMemory usa pares de idiomas (ej: es|gl, es|en). Asumimos origen español (es)
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanText)}&langpair=es|${targetLang}&de=galiciamigrante2026@gmail.com`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      next: { revalidate: 3600 } // Opciones de caché para Next.js
    });

    const data = await response.json();

    if (data && data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText;
    }
  } catch (error) {
    console.error(`Error al traducir al ${targetLang} con MyMemory:`, error);
  }

  // Fallback simple por si falla la red o la API
  if (targetLang === 'gl') {
    return cleanText
      .replace(/ y /gi, ' e ')
      .replace(/buenos aires/gi, 'Bos Aires')
      .replace(/nos complace/gi, 'prácenos')
      .replace(/bienvenida/gi, 'benvida')
      .replace(/nuestra/gi, 'a nosa')
      .replace(/institución/gi, 'institución');
  } else if (targetLang === 'en') {
    return cleanText
      .replace(/nos complace/gi, 'we are pleased to')
      .replace(/bienvenida/gi, 'welcome')
      .replace(/buenos aires/gi, 'Buenos Aires')
      .replace(/nuestra/gi, 'our')
      .replace(/institución/gi, 'institution');
  }
  return cleanText;
};

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

    // Limitar tamaño del payload para evitar abuso
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

