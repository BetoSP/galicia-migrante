'use client';

import React, { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from './micrositio.module.css';
import { useTranslation } from '@/components/LanguageContext';
import { getLocalizedField } from '@/lib/localization';

// Fallback mockup data for Centro Lalin
const LALIN_MOCK = {
  id: 'a4b87cb3-42eb-4c8d-8fe5-1c3905581977',
  nombre: 'Centro Lalín, Golada y Silleda de Buenos Aires',
  slug: 'centro-lalin-buenos-aires',
  fundacion: 1982,
  descripcion_es: 'Nos complace darle la bienvenida al sitio web del Centro Lalín Golada y Silleda de Galicia en Buenos Aires. Desde el año 1982 nuestra institución mantiene el firme y decidido compromiso de divulgar el origen e identidad gallegas.',
  descripcion_gl: 'Prácenos darlle a benvida ao sitio web del Centro Lalín Golada e Silleda de Galicia en Buenos Aires. Desde o ano 1982 a nosa institución mantén o firme e decidido compromiso de divulgar a orixe e identidade galegas.',
  descripcion_en: 'We are pleased to welcome you to the website of the Lalín Golada and Silleda Center of Galicia in Buenos Aires. Since 1982, our institution has maintained a firm and determined commitment to promoting Galician origin and identity.',
  historia_es: 'El Centro Lalín de Buenos Aires fue constituido por un grupo de entusiastas emigrantes originarios de la comarca del Deza con el objeto de mantener el contacto con su terruño natal y ayudarse mutuamente en la gran urbe porteña.',
  historia_gl: 'O Centro Lalín de Buenos Aires foi constituído por un grupo de entusiastas emigrantes orixinarios da comarca do Deza co obxecto de manter o contacto co seu terrón natal e axudarse mutuamente na gran urbe porteña.',
  historia_en: 'The Lalín Center of Buenos Aires was established by a group of enthusiastic emigrants originally from the Deza region in order to maintain contact with their native homeland and help each other in the big city.',
  finalidades_es: 'Nuestros objetivos principales consisten en: 1) Divulgar la cultura gallega y de la comarca del Deza. 2) Favorecer la unión e integración social de los descendientes de gallegos en Argentina. 3) Ofrecer actividades culturales, recreativas y formativas.',
  finalidades_gl: 'Os nosos obxectivos principais consisten en: 1) Divulgar a cultura galega e da comarca do Deza. 2) Favorecer a unión e integración social dos descendentes de galegos en Arxentina. 3) Ofrecer actividades culturais, recreativas e formativas.',
  finalidades_en: 'Our main goals consist of: 1) Promoting Galician culture and the Deza region. 2) Supporting the social union and integration of Galician descendants in Argentina. 3) Offering cultural, recreational, and training activities.',
  email: 'centrolalin@yahoo.com.ar',
  telefono: '+54 11 4941-2054',
  direccion: 'Moreno 1949',
  ciudad: 'Buenos Aires',
  pais: 'Argentina',
  logo_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80',
  banner_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80',
  directivos: [
    { nombre: 'José González Otero', cargo_es: 'Presidente', cargo_gl: 'Presidente', cargo_en: 'President' },
    { nombre: 'María del Carmen Deza', cargo_es: 'Vicepresidenta', cargo_gl: 'Vicepresidenta', cargo_en: 'Vice President' },
    { nombre: 'Manuel Varela', cargo_es: 'Secretario General', cargo_gl: 'Secretario Xeral', cargo_en: 'General Secretary' },
    { nombre: 'Elena Fernández Cuiña', cargo_es: 'Tesorera', cargo_gl: 'Tesoureira', cargo_en: 'Treasurer' }
  ],
  noticias: [
    { titulo_es: 'Gran Banquete de la Fiesta del Cocido', titulo_gl: 'Gran Banquete de la Festa do Cocido', titulo_en: 'Grand Banquet of the Cocido Festival', contenido_es: 'El Centro Lalín de Buenos Aires celebrará su tradicional Fiesta del Cocido en el salón principal, con danzas folclóricas gallegas y la presencia de autoridades e invitados especiales de la comarca del Deza.', contenido_gl: 'O Centro Lalín de Buenos Aires celebrará a súa tradicional Festa do Cocido no salón principal, con danzas folclóricas galegas e a presenza de autoridades e invitados especiais da comarca do Deza.', contenido_en: 'The Lalín Center of Buenos Aires will celebrate its traditional Cocido Festival in the main hall, with Galician folk dances and the presence of authorities and special guests from the Deza region.', creado: '24/06/2026' },
    { titulo_es: 'Conferencia: Diáspora y Raíces en el Siglo XXI', titulo_gl: 'Conferencia: Diáspora e Raíces no Século XXI', titulo_en: 'Conference: Diaspora and Roots in the 21st Century', contenido_es: 'Un coloquio interactivo sobre la historia de la inmigración en Argentina, las leyes de nacionalidad vigentes y el papel de las nuevas generaciones en la conservación de la galleguidad.', contenido_gl: 'Un coloquio interactivo sobre a historia da inmigración en Arxentina, as leis de nacionalidade vixentes e o papel das novas xeracións na conservación da galeguidade.', contenido_en: 'An interactive colloquium on the history of immigration in Argentina, current nationality laws, and the role of new generations in preserving Galician identity.', creado: '23/06/2026' }
  ]
};

export default function AssociationMicrositePage({ params: paramsPromise }) {
  const { locale, t } = useTranslation();
  const [slug, setSlug] = useState('');
  const [asociacion, setAsociacion] = useState(null);
  const [directivos, setDirectivos] = useState([]);
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);

  // Desempaquetar params en el cliente
  useEffect(() => {
    paramsPromise.then(p => setSlug(p.slug));
  }, [paramsPromise]);

  useEffect(() => {
    if (!slug) return;

    const loadData = async () => {
      try {
        const { data } = await supabase
          .from('asociaciones')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (data) {
          setAsociacion(data);

          const { data: dirData } = await supabase
            .from('asociaciones_directivos')
            .select('*')
            .eq('asociacion_id', data.id)
            .order('orden', { ascending: true });
          if (dirData) setDirectivos(dirData);

          const { data: notData } = await supabase
            .from('asociaciones_noticias')
            .select('*')
            .eq('asociacion_id', data.id)
            .eq('publicado', true)
            .order('created_at', { ascending: false });
          if (notData) setNoticias(notData);
        } else if (slug === 'centro-lalin-buenos-aires') {
          // Fallback a mockup para Centro Lalin si la base de datos no está poblada
          setAsociacion(LALIN_MOCK);
          setDirectivos(LALIN_MOCK.directivos);
          setNoticias(LALIN_MOCK.noticias);
        }
      } catch (err) {
        console.warn('Database error while loading microsite, using mockup fallback:', err);
        if (slug === 'centro-lalin-buenos-aires') {
          setAsociacion(LALIN_MOCK);
          setDirectivos(LALIN_MOCK.directivos);
          setNoticias(LALIN_MOCK.noticias);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  const esReclamado = asociacion ? asociacion.reclamada !== false : false;

  // Estados locales para las traducciones calculadas dinámicamente en caliente
  const [localizedTexts, setLocalizedTexts] = useState({
    nombre: asociacion ? (asociacion.nombre || '') : '',
    descripcion: '',
    historia: '',
    finalidades: ''
  });

  useEffect(() => {
    if (!asociacion) return;
    const translateAllMissing = async () => {
      const getOrTranslate = async (fieldBase) => {
        const originalVal = asociacion[`${fieldBase}_es`] || asociacion[fieldBase] || '';
        if (!originalVal) return '';

        // Si el idioma es español, mostramos el original
        if (locale === 'es-AR') return originalVal;

        const langCode = locale.split('-')[0]; // gl o en
        const targetField = `${fieldBase}_${langCode}`;
        const currentTranslation = asociacion[targetField];

        // Si ya existe la traducción en la BD, la retornamos directamente
        if (currentTranslation && currentTranslation.trim() !== '') return currentTranslation;

        // Si no existe (es null/vacío), llamamos a la API para generarla de verdad en caliente
        try {
          const res = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: originalVal, targetLangs: [langCode] })
          });
          const data = await res.json();
          const autoTranslated = data?.translations?.[langCode] || '';

          if (autoTranslated) {
            // Persistir de forma transparente y asíncrona en la base de datos para futuras visitas
            supabase
              .from('asociaciones')
              .update({ [targetField]: autoTranslated })
              .eq('id', asociacion.id)
              .then(() => {
                // Actualizar localmente el objeto cargado en el estado para evitar re-fetch
                asociacion[targetField] = autoTranslated;
              });
            return autoTranslated;
          }
        } catch (err) {
          console.warn('Fallo en traducción en caliente:', err);
        }

        return originalVal; // Fallback al original si falla la llamada
      };

      const nombre = await getOrTranslate('nombre');
      const descripcion = await getOrTranslate('descripcion');
      const historia = await getOrTranslate('historia');
      const finalidades = await getOrTranslate('finalidades');

      setLocalizedTexts({ nombre, descripcion, historia, finalidades });
    };

    translateAllMissing();
  }, [locale, asociacion]);

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '80vh', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)' }}>
        {t('common.loading') || 'Cargando...'}
      </div>
    );
  }

  if (!asociacion) {
    notFound();
  }

  const nombreAsoc = localizedTexts.nombre || asociacion.nombre;
  
  const descripcion = localizedTexts.descripcion || (esReclamado 
    ? '' 
    : t('associations.default_description') || 'Nos complace darle la bienvenida al portal de nuestra institución. Esta página sirve como espacio de encuentro y comunicación de la colectividad en la diáspora.');

  const historia = localizedTexts.historia || (esReclamado
    ? ''
    : t('associations.default_history') || `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit animi id est laborum.

[Modelo] Esta sección de historia sirve de guía visual. Una vez que el micrositio sea reclamado y activado por los administradores autorizados de la institución, este espacio reflejará los hitos, fundación y el recorrido histórico particular de la asociación.`);

  const finalidades = localizedTexts.finalidades || (esReclamado
    ? ''
    : t('associations.default_objectives') || `Nuestros objetivos principales consisten en (Modelo):
1) Preservar, alentar y difundir la cultura, costumbres e identidad gallega en la región.
2) Fomentar la unión, el intercambio intergeneracional y el apoyo mutuo entre los descendientes y la colectividad.
3) Ofrecer y organizar talleres recreativos, conferencias académicas, actividades artísticas y eventos de la diáspora.`);

  const logoUrl = asociacion.logo_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80';
  const bannerUrl = asociacion.banner_url || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80';

  // Helper para obtener campos localizados de objetos dinámicos (directivos, noticias) y traducirlos si faltan
  const [newsTranslations, setNewsTranslations] = useState({});
  const [boardTranslations, setBoardTranslations] = useState({});

  useEffect(() => {
    if (!asociacion) return;
    if (locale === 'es-AR') return;
    const langCode = locale.split('-')[0];

    // Traducir cargos de directivos que falten
    directivos.forEach(async (d) => {
      const targetField = `cargo_${langCode}`;
      if (!d[targetField] && d.cargo_es) {
        try {
          const res = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: d.cargo_es, targetLangs: [langCode] })
          });
          const data = await res.json();
          const autoTranslated = data?.translations?.[langCode] || '';
          if (autoTranslated) {
            // Guardar en la base de datos
            supabase
              .from('asociaciones_directivos')
              .update({ [targetField]: autoTranslated })
              .eq('id', d.id)
              .then(() => {
                setBoardTranslations(prev => ({ ...prev, [`${d.id}_cargo`]: autoTranslated }));
              });
          }
        } catch (e) {
          console.warn(e);
        }
      }
    });

    // Traducir noticias que falten (título y contenido)
    noticias.forEach(async (n) => {
      const titleField = `titulo_${langCode}`;
      const contentField = `contenido_${langCode}`;

      if (!n[titleField] && n.titulo_es) {
        try {
          const res = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: n.titulo_es, targetLangs: [langCode] })
          });
          const data = await res.json();
          const autoTranslated = data?.translations?.[langCode] || '';
          if (autoTranslated) {
            supabase
              .from('asociaciones_noticias')
              .update({ [titleField]: autoTranslated })
              .eq('id', n.id)
              .then(() => {
                setNewsTranslations(prev => ({ ...prev, [`${n.id}_titulo`]: autoTranslated }));
              });
          }
        } catch (e) {
          console.warn(e);
        }
      }

      if (!n[contentField] && n.contenido_es) {
        try {
          const res = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: n.contenido_es, targetLangs: [langCode] })
          });
          const data = await res.json();
          const autoTranslated = data?.translations?.[langCode] || '';
          if (autoTranslated) {
            supabase
              .from('asociaciones_noticias')
              .update({ [contentField]: autoTranslated })
              .eq('id', n.id)
              .then(() => {
                setNewsTranslations(prev => ({ ...prev, [`${n.id}_contenido`]: autoTranslated }));
              });
          }
        } catch (e) {
          console.warn(e);
        }
      }
    });
  }, [locale, directivos, noticias, asociacion]);

  const getFieldByLocale = (obj, field, type = 'board') => {
    if (locale === 'es-AR') return obj[`${field}_es`] || obj[field];
    const langCode = locale.split('-')[0];
    const targetField = `${field}_${langCode}`;

    if (type === 'board' && boardTranslations[`${obj.id}_${field}`]) {
      return boardTranslations[`${obj.id}_${field}`];
    }
    if (type === 'news' && newsTranslations[`${obj.id}_${field}`]) {
      return newsTranslations[`${obj.id}_${field}`];
    }

    return obj[targetField] || obj[`${field}_es`] || obj[field];
  };

  return (
    <div className={styles.microsite}>
      {/* Banner de Cabecera */}
      <div className={styles.banner} style={{ backgroundImage: `url(${bannerUrl})` }}>
        <div className={styles.bannerOverlay} />
        <div className={styles.bannerContent}>
          <div className={styles.logoWrapper}>
            <img src={logoUrl} alt={nombreAsoc} className={styles.logo} />
          </div>
          <h1 className={styles.title}>{nombreAsoc}</h1>
          <p className={styles.meta}>
            📍 {asociacion.ciudad}, {asociacion.pais} {asociacion.fundacion ? `· ${t('associations.founded_in') || 'Fundada en'} ${asociacion.fundacion}` : ''}
          </p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Columna Principal */}
          <div className={styles.mainCol}>
            
            {/* Banner de Reclamación para micrositios pendientes */}
            {!esReclamado && (
              <div className={styles.claimBanner}>
                <span className={styles.claimIcon}>📌</span>
                <div className={styles.claimContent}>
                  <h3>{t('associations.claim_title') || 'Micrositio pendiente de activación'}</h3>
                  <p>{t('associations.claim_desc') || 'Esta página contiene la información de contacto registrada oficialmente para la institución. Si sos miembro de la comisión directiva de esta asociación, podés registrarte y reclamar el control de este micrositio de forma gratuita para personalizar la historia, cargar directivos y publicar noticias.'}</p>
                  <Link href="/auth?mode=register&redirect=/admin" className={styles.claimBtn}>
                    {t('associations.claim_btn') || 'Reclamar micrositio'}
                  </Link>
                </div>
              </div>
            )}
            
            {/* Sección Bienvenido */}
            {descripcion && (
              <section className={styles.card}>
                <span className={styles.sectionBadge}>{t('associations.badge_welcome') || 'Bienvenido'}</span>
                <p className={styles.welcomeText}>{descripcion}</p>
              </section>
            )}
 
            {/* Historia */}
            {historia && (
              <section className={styles.card}>
                <span className={styles.sectionBadge}>{t('associations.badge_history') || 'Nuestra Historia'}</span>
                <h2 className={styles.sectionTitle}>
                  {t('associations.history_title_since') || 'Desde'} {asociacion.fundacion || t('associations.history_title_origins') || 'nuestros orígenes'} {t('associations.history_title_to_today') || 'hasta hoy'}
                </h2>
                <p className={styles.bodyText}>{historia}</p>
              </section>
            )}
 
            {/* Fines y Finalidades */}
            {finalidades && (
              <section className={styles.card}>
                <span className={styles.sectionBadge}>{t('associations.badge_objectives') || 'Finalidades y Objetivos'}</span>
                <h2 className={styles.sectionTitle}>{t('associations.objectives_title') || '¿Qué hacemos?'}</h2>
                <p className={styles.bodyText}>{finalidades}</p>
              </section>
            )}

            {/* Comisión Directiva */}
            <section className={styles.card}>
              <span className={styles.sectionBadge}>{t('associations.badge_organization') || 'Organización'}</span>
              <h2 className={styles.sectionTitle}>{t('associations.board_title') || 'Comisión Directiva'}</h2>
              <div className={styles.boardGrid}>
                {directivos.length === 0 ? (
                  <p className={styles.mutedText}>{t('associations.board_empty') || 'Comisión directiva en proceso de actualización.'}</p>
                ) : (
                  directivos.map((d, index) => (
                    <div key={index} className={styles.boardMember}>
                      <div className={styles.memberAvatar}>{d.nombre.charAt(0)}</div>
                      <div>
                        <div className={styles.memberName}>{d.nombre}</div>
                        <div className={styles.memberRole}>{getFieldByLocale(d, 'cargo')}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Columna Lateral (Noticias, Contacto, Mapa) */}
          <div className={styles.sideCol}>
            
            {/* Información de Contacto */}
            <section className={styles.sideCard}>
              <h3>{t('associations.contact_title') || 'Contacto y Localización'}</h3>
              <ul className={styles.contactList}>
                {asociacion.direccion && (
                  <li>
                    <span className={styles.contactIcon}>📍</span>
                    <div>
                      <strong>{t('associations.contact_address') || 'Dirección'}:</strong>
                      <p>{asociacion.direccion}, {asociacion.ciudad}</p>
                    </div>
                  </li>
                )}
                {asociacion.telefono && (
                  <li>
                    <span className={styles.contactIcon}>📞</span>
                    <div>
                      <strong>{t('associations.contact_phone') || 'Teléfono'}:</strong>
                      <p>{asociacion.telefono}</p>
                    </div>
                  </li>
                )}
                {asociacion.email && (
                  <li>
                    <span className={styles.contactIcon}>✉</span>
                    <div>
                      <strong>Email:</strong>
                      <p><a href={`mailto:${asociacion.email}`} className={styles.link}>{asociacion.email}</a></p>
                    </div>
                  </li>
                )}
                {asociacion.web_propia && (
                  <li>
                    <span className={styles.contactIcon}>🌐</span>
                    <div>
                      <strong>{t('associations.contact_website') || 'Sitio Web'}:</strong>
                      <p><a href={asociacion.web_propia} target="_blank" className={styles.link} rel="noopener noreferrer">{asociacion.web_propia}</a></p>
                    </div>
                  </li>
                )}
              </ul>
            </section>

            {/* Noticias y Eventos */}
            <section className={styles.sideCard}>
              <h3>{t('associations.news_title') || 'Noticias y Actividades'}</h3>
              <div className={styles.newsList}>
                {noticias.length === 0 ? (
                  <p className={styles.mutedText}>{t('associations.news_empty') || 'No hay novedades recientes publicadas por este centro.'}</p>
                ) : (
                  noticias.map((n, index) => (
                    <article key={index} className={styles.newsItem}>
                      <h4 className={styles.newsTitle}>{getFieldByLocale(n, 'titulo', 'news')}</h4>
                      <p className={styles.newsContent}>{getFieldByLocale(n, 'contenido', 'news')}</p>
                      <span className={styles.newsDate}>{n.creado || new Date(n.created_at).toLocaleDateString(locale)}</span>
                    </article>
                  ))
                )}
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
