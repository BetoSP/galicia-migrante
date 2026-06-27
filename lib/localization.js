/**
 * Devuelve el campo localizado de un objeto de BD.
 * Busca `field_gl` / `field_en` según el locale activo,
 * con fallback a `field_es` o `field` si no existe traducción.
 *
 * @param {object} obj    - Fila de la BD (asociacion, noticia, etc.)
 * @param {string} field  - Nombre base del campo (sin sufijo de idioma)
 * @param {string} locale - Locale activo ('es-AR', 'gl', 'en')
 * @returns {string}
 */
export function getLocalizedField(obj, field, locale) {
  if (!obj) return '';
  if (locale === 'es-AR') return obj[`${field}_es`] ?? obj[field] ?? '';
  const langCode = locale.split('-')[0];
  return obj[`${field}_${langCode}`] || obj[`${field}_es`] || obj[field] || '';
}
