import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

const MAX_TEXT_BYTES = 5000;

// Protege sintaxis Markdown con tags XML-like (<mk0/>) que los motores de traducción
// preservan por diseño (los tratan como marcado HTML/XML, no como texto a traducir).
// Cubre: headings, negrita/cursiva, bullets, blockquotes, HR.
function protectMarkdown(text) {
  const tokens = [];
  let idx = 0;

  const protect = (value) => {
    const tag = `<mk${idx}/>`;
    tokens.push({ tag, value });
    idx++;
    return tag;
  };

  const result = text
    .replace(/^(#{1,6} )/gm,      (m) => protect(m))
    .replace(/(\*{1,2}|_{1,2})/g, (m) => protect(m))
    .replace(/^([*\-+] )/gm,      (m) => protect(m))
    .replace(/^(> ?)/gm,           (m) => protect(m))
    .replace(/^([-*_]{3,})\s*$/gm, (m) => protect(m));

  return { result, tokens };
}

function restoreMarkdown(text, tokens) {
  let out = text;
  tokens.forEach(({ tag, value }) => {
    out = out.replaceAll(tag, value);
  });
  return out;
}

// Motor de traducción real y gratuito (MyMemory API) con fallback
const translateText = async (text, targetLang) => {
  if (!text) return '';

  const cleanText = text
    .replace(/^\[GL Autotraducción\]\s*/i, '')
    .replace(/^\[EN Autotranslation\]\s*/i, '')
    .trim();

  // Proteger sintaxis Markdown antes de enviar a la API
  const { result: protectedText, tokens } = protectMarkdown(cleanText);

  let translated = protectedText;

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(protectedText)}&langpair=es|${targetLang}&de=galiciamigrante2026@gmail.com`;

    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      next: { revalidate: 3600 },
    });

    const data = await response.json();

    if (data?.responseStatus === 200 && data.responseData?.translatedText) {
      translated = data.responseData.translatedText;
    }
  } catch (error) {
    console.error(`Error al traducir al ${targetLang} con MyMemory:`, error);
    // En caso de error de red, devolver el texto original sin traducir
    return cleanText;
  }

  // Restaurar los tokens Markdown protegidos
  return restoreMarkdown(translated, tokens);
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

