import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

const MAX_TEXT_BYTES = 5000;

// Mapeo de códigos de locale a códigos de API de DeepL.
// DeepL exige variantes regionales para inglés; el resto son código ISO 639-1 en mayúsculas.
const DEEPL_LANG_MAP = {
  en: 'EN-US',
  fr: 'FR',
  de: 'DE',
  it: 'IT',
};

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

// ── Motor 1: DeepL (EN, FR, DE, IT) ─────────────────────────────────────────
// Tag handling nativo con 'xml' — preserva nuestras etiquetas <mk0/> de forma garantizada.
// Calidad de traducción elite, plan gratuito: 500,000 caracteres/mes.
async function translateWithDeepL(text, targetLang) {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    throw new Error('DEEPL_API_KEY no configurada');
  }

  const deeplLang = DEEPL_LANG_MAP[targetLang];
  if (!deeplLang) {
    throw new Error(`Idioma no soportado por DeepL: ${targetLang}`);
  }

  const response = await fetch('https://api-free.deepl.com/v2/translate', {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: [text],
      source_lang: 'ES',
      target_lang: deeplLang,
      tag_handling: 'xml',
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`DeepL error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.translations?.[0]?.text ?? text;
}

// ── Motor 2: Apertium (GL — gallego) ─────────────────────────────────────────
// Open source, gratuito, sin cuotas, especializado en lenguas ibéricas minoritarias.
// spa→glg es uno de sus mejores pares de traducción.
// Los motores RBMT preservan marcado XML por diseño estructural.
async function translateWithApertium(text, targetLang) {
  if (targetLang !== 'gl') {
    throw new Error(`Apertium solo se usa para GL, recibido: ${targetLang}`);
  }

  const url = `https://www.apertium.org/apy/translate?q=${encodeURIComponent(text)}&langpair=spa|glg&markUnknown=no`;

  const response = await fetch(url, {
    headers: { 'User-Agent': 'GaliciaMigrante/1.0 (portal@galiciamigrante.com)' },
  });

  if (!response.ok) {
    throw new Error(`Apertium error ${response.status}`);
  }

  const data = await response.json();
  const translated = data?.responseData?.translatedText;

  if (!translated || translated === 'ERROR') {
    throw new Error('Apertium no devolvió traducción válida');
  }

  return translated;
}

// ── Dispatcher principal ──────────────────────────────────────────────────────
// Para GL: Apertium (especializado). Para EN/FR/DE/IT: DeepL (elite).
// Si DeepL no está configurado (sin API key), cae a MyMemory como fallback.
const translateText = async (text, targetLang) => {
  if (!text) return '';

  const cleanText = text
    .replace(/^\[GL Autotraducción\]\s*/i, '')
    .replace(/^\[EN Autotranslation\]\s*/i, '')
    .trim();

  const { result: protectedText, tokens } = protectMarkdown(cleanText);
  let translated;

  try {
    if (targetLang === 'gl') {
      translated = await translateWithApertium(protectedText, targetLang);
    } else {
      translated = await translateWithDeepL(protectedText, targetLang);
    }
  } catch (primaryError) {
    // Fallback a MyMemory si el motor principal falla (red, cuota, key no configurada)
    console.warn(`[translate] Motor principal falló para '${targetLang}', usando MyMemory:`, primaryError.message);
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(protectedText)}&langpair=es|${targetLang}&de=galiciamigrante2026@gmail.com`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });
      const data = await res.json();
      if (data?.responseStatus === 200 && data.responseData?.translatedText) {
        translated = data.responseData.translatedText;
      } else {
        return cleanText;
      }
    } catch {
      return cleanText;
    }
  }

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
