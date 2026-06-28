// Lógica de traducción compartida entre /api/translate y /api/blog/[id]/approve.
// Motor GL → MyMemory. Motor EN/FR/DE/IT → DeepL con fallback a MyMemory.

const DEEPL_LANG_MAP = {
  en: 'EN-US',
  fr: 'FR',
  de: 'DE',
  it: 'IT',
};

export const ALL_TARGET_LANGS = ['gl', 'en', 'fr', 'de', 'it'];

// Protege tokens de Markdown con tags XML que los motores de traducción preservan
// por diseño (los tratan como marcado HTML/XML, no como texto a traducir).
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
    .replace(/^(#{1,6} )/gm,       (m) => protect(m))
    .replace(/(\*{1,2}|_{1,2})/g,  (m) => protect(m))
    .replace(/^([*\-+] )/gm,       (m) => protect(m))
    .replace(/^(> ?)/gm,            (m) => protect(m))
    .replace(/^([-*_]{3,})\s*$/gm, (m) => protect(m));

  return { result, tokens };
}

function restoreMarkdown(text, tokens) {
  let out = text;
  tokens.forEach(({ tag, value }) => { out = out.replaceAll(tag, value); });
  return out;
}

async function translateWithDeepL(text, targetLang) {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) throw new Error('DEEPL_API_KEY no configurada');

  const deeplLang = DEEPL_LANG_MAP[targetLang];
  if (!deeplLang) throw new Error(`Idioma no soportado por DeepL: ${targetLang}`);

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

async function translateWithMyMemory(text, targetLang) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|${targetLang}&de=galiciamigrante2026@gmail.com`;

  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
  });

  if (!response.ok) throw new Error(`MyMemory error ${response.status}`);

  const data = await response.json();
  if (data?.responseStatus === 200 && data.responseData?.translatedText) {
    return data.responseData.translatedText;
  }
  throw new Error(`MyMemory respuesta inválida: ${data?.responseStatus}`);
}

// Limpia prefijos de auto-traducción previos para re-traducción
function cleanText(text) {
  return text
    .replace(/^\[GL Autotraducción\]\s*/i, '')
    .replace(/^\[EN Autotranslation\]\s*/i, '')
    .trim();
}

export async function translateText(text, targetLang) {
  if (!text) return '';

  const { result: protectedText, tokens } = protectMarkdown(cleanText(text));

  let translated;
  try {
    if (targetLang === 'gl') {
      translated = await translateWithMyMemory(protectedText, targetLang);
    } else {
      translated = await translateWithDeepL(protectedText, targetLang);
    }
  } catch (primaryError) {
    console.warn(`[translate] Motor principal falló para '${targetLang}', usando MyMemory:`, primaryError.message);
    try {
      translated = await translateWithMyMemory(protectedText, targetLang);
    } catch {
      return cleanText(text);
    }
  }

  return restoreMarkdown(translated, tokens);
}

// Traduce titulo, extracto y contenido a los idiomas indicados (por defecto todos).
// Devuelve { gl: { titulo, extracto, contenido }, en: {...}, ... }
export async function translatePost(titulo, extracto, contenido, langs = ALL_TARGET_LANGS) {
  const results = await Promise.all(
    langs.map(async (lang) => {
      const [t, e, c] = await Promise.all([
        translateText(titulo, lang),
        translateText(extracto, lang),
        translateText(contenido, lang),
      ]);
      return { lang, titulo: t, extracto: e, contenido: c };
    })
  );

  return Object.fromEntries(results.map(({ lang, ...fields }) => [lang, fields]));
}
