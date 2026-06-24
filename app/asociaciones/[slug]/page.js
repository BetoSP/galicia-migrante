import React from 'react';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import styles from './micrositio.module.css';

export const revalidate = 30; // Revalidate every 30 seconds

// Fallback mockup data for Centro Lalin
const LALIN_MOCK = {
  id: 'a4b87cb3-42eb-4c8d-8fe5-1c3905581977',
  nombre: 'Centro Lalín, Golada y Silleda de Buenos Aires',
  slug: 'centro-lalin-buenos-aires',
  fundacion: 1982,
  descripcion_es: 'Nos complace darle la bienvenida al sitio web del Centro Lalín Golada y Silleda de Galicia en Buenos Aires. Desde el año 1982 nuestra institución mantiene el firme y decidido compromiso de divulgar el origen e identidad gallegas.',
  historia_es: 'El Centro Lalín de Buenos Aires fue constituido por un grupo de entusiastas emigrantes originarios de la comarca del Deza con el objeto de mantener el contacto con su terruño natal y ayudarse mutuamente en la gran urbe porteña.',
  finalidades_es: 'Nuestros objetivos principales consisten en: 1) Divulgar la cultura gallega y de la comarca del Deza. 2) Favorecer la unión e integración social de los descendientes de gallegos en Argentina. 3) Ofrecer actividades culturales, recreativas y formativas.',
  email: 'centrolalin@yahoo.com.ar',
  telefono: '+54 11 4941-2054',
  direccion: 'Moreno 1949',
  ciudad: 'Buenos Aires',
  pais: 'Argentina',
  logo_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80',
  banner_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80',
  directivos: [
    { nombre: 'José González Otero', cargo: 'Presidente' },
    { nombre: 'María del Carmen Deza', cargo: 'Vicepresidenta' },
    { nombre: 'Manuel Varela', cargo: 'Secretario General' },
    { nombre: 'Elena Fernández Cuiña', cargo: 'Tesorera' }
  ],
  noticias: [
    { titulo_es: 'Gran Banquete de la Fiesta del Cocido', contenido_es: 'El Centro Lalín de Buenos Aires celebrará su tradicional Fiesta del Cocido en el salón principal, con danzas folclóricas gallegas y la presencia de autoridades e invitados especiales de la comarca del Deza.', creado: '24/06/2026' },
    { titulo_es: 'Conferencia: Diáspora y Raíces en el Siglo XXI', contenido_es: 'Un coloquio interactivo sobre la historia de la inmigración en Argentina, las leyes de nacionalidad vigentes y el papel de las nuevas generaciones en la conservación de la galleguidad.', creado: '23/06/2026' }
  ]
};

// Generar rutas estáticas
export async function generateStaticParams() {
  try {
    const { data: asociaciones } = await supabase
      .from('asociaciones')
      .select('slug');
    
    if (asociaciones && asociaciones.length > 0) {
      return asociaciones.map((a) => ({ slug: a.slug }));
    }
  } catch (err) {
    console.warn('Error fetching static params:', err);
  }
  return [{ slug: 'centro-lalin-buenos-aires' }];
}

export default async function AssociationMicrositePage({ params }) {
  const { slug } = await params;
  let asociacion = null;
  let directivos = [];
  let noticias = [];

  try {
    const { data } = await supabase
      .from('asociaciones')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (data) {
      asociacion = data;

      // Obtener directivos
      const { data: dirData } = await supabase
        .from('asociaciones_directivos')
        .select('*')
        .eq('asociacion_id', asociacion.id)
        .order('orden', { ascending: true });
      if (dirData) directivos = dirData;

      // Obtener noticias
      const { data: notData } = await supabase
        .from('asociaciones_noticias')
        .select('*')
        .eq('asociacion_id', asociacion.id)
        .eq('publicado', true)
        .order('created_at', { ascending: false });
      if (notData) noticias = notData;
    }
  } catch (err) {
    console.warn('Database error while loading microsite, using mockup fallback:', err);
  }

  // Fallback a mockup para Centro Lalin si la base de datos no está poblada
  if (!asociacion && slug === 'centro-lalin-buenos-aires') {
    asociacion = LALIN_MOCK;
    directivos = LALIN_MOCK.directivos;
    noticias = LALIN_MOCK.noticias;
  }

  if (!asociacion) {
    notFound();
  }

  const esReclamado = asociacion.reclamada !== false;
  
  const descripcion = asociacion.descripcion_es || (esReclamado 
    ? '' 
    : 'Nos complace darle la bienvenida al portal de nuestra institución. Esta página sirve como espacio de encuentro y comunicación de la colectividad en la diáspora.');

  const historia = asociacion.historia_es || (esReclamado
    ? ''
    : `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit animi id est laborum.

[Modelo] Esta sección de historia sirve de guía visual. Una vez que el micrositio sea reclamado y activado por los administradores autorizados de la institución, este espacio reflejará los hitos, fundación y el recorrido histórico particular de la asociación.`);

  const finalidades = asociacion.finalidades_es || (esReclamado
    ? ''
    : `Nuestros objetivos principales consisten en (Modelo):
1) Preservar, alentar y difundir la cultura, costumbres e identidad gallega en la región.
2) Fomentar la unión, el intercambio intergeneracional y el apoyo mutuo entre los descendientes y la colectividad.
3) Ofrecer y organizar talleres recreativos, conferencias académicas, actividades artísticas y eventos de la diáspora.`);

  const logoUrl = asociacion.logo_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80';
  const bannerUrl = asociacion.banner_url || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80';

  return (
    <div className={styles.microsite}>
      {/* Banner de Cabecera */}
      <div className={styles.banner} style={{ backgroundImage: `url(${bannerUrl})` }}>
        <div className={styles.bannerOverlay} />
        <div className={styles.bannerContent}>
          <div className={styles.logoWrapper}>
            <img src={logoUrl} alt={asociacion.nombre} className={styles.logo} />
          </div>
          <h1 className={styles.title}>{asociacion.nombre}</h1>
          <p className={styles.meta}>📍 {asociacion.ciudad}, {asociacion.pais} {asociacion.fundacion ? `· Fundada en ${asociacion.fundacion}` : ''}</p>
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
                  <h3>Micrositio pendiente de activación</h3>
                  <p>Esta página contiene la información de contacto registrada oficialmente para la institución. Si sos miembro de la comisión directiva de esta asociación, podés registrarte y reclamar el control de este micrositio de forma gratuita para personalizar la historia, cargar directivos y publicar noticias.</p>
                  <Link href="/auth?mode=register&redirect=/admin" className={styles.claimBtn}>
                    Reclamar micrositio
                  </Link>
                </div>
              </div>
            )}
            
            {/* Sección Bienvenido */}
            {descripcion && (
              <section className={styles.card}>
                <span className={styles.sectionBadge}>Bienvenido</span>
                <p className={styles.welcomeText}>{descripcion}</p>
              </section>
            )}
 
            {/* Historia */}
            {historia && (
              <section className={styles.card}>
                <span className={styles.sectionBadge}>Nuestra Historia</span>
                <h2 className={styles.sectionTitle}>Desde {asociacion.fundacion || 'nuestros orígenes'} hasta hoy</h2>
                <p className={styles.bodyText}>{historia}</p>
              </section>
            )}
 
            {/* Fines y Finalidades */}
            {finalidades && (
              <section className={styles.card}>
                <span className={styles.sectionBadge}>Finalidades y Objetivos</span>
                <h2 className={styles.sectionTitle}>¿Qué hacemos?</h2>
                <p className={styles.bodyText}>{finalidades}</p>
              </section>
            )}

            {/* Comisión Directiva */}
            <section className={styles.card}>
              <span className={styles.sectionBadge}>Organización</span>
              <h2 className={styles.sectionTitle}>Comisión Directiva</h2>
              <div className={styles.boardGrid}>
                {directivos.length === 0 ? (
                  <p className={styles.mutedText}>Comisión directiva en proceso de actualización.</p>
                ) : (
                  directivos.map((d, index) => (
                    <div key={index} className={styles.boardMember}>
                      <div className={styles.memberAvatar}>{d.nombre.charAt(0)}</div>
                      <div>
                        <div className={styles.memberName}>{d.nombre}</div>
                        <div className={styles.memberRole}>{d.cargo}</div>
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
              <h3>Contacto y Localización</h3>
              <ul className={styles.contactList}>
                {asociacion.direccion && (
                  <li>
                    <span className={styles.contactIcon}>📍</span>
                    <div>
                      <strong>Dirección:</strong>
                      <p>{asociacion.direccion}, {asociacion.ciudad}</p>
                    </div>
                  </li>
                )}
                {asociacion.telefono && (
                  <li>
                    <span className={styles.contactIcon}>📞</span>
                    <div>
                      <strong>Teléfono:</strong>
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
                      <strong>Sitio Web:</strong>
                      <p><a href={asociacion.web_propia} target="_blank" className={styles.link}>{asociacion.web_propia}</a></p>
                    </div>
                  </li>
                )}
              </ul>
            </section>

            {/* Noticias y Eventos */}
            <section className={styles.sideCard}>
              <h3>Noticias y Actividades</h3>
              <div className={styles.newsList}>
                {noticias.length === 0 ? (
                  <p className={styles.mutedText}>No hay novedades recientes publicadas por este centro.</p>
                ) : (
                  noticias.map((n, index) => (
                    <article key={index} className={styles.newsItem}>
                      <h4 className={styles.newsTitle}>{n.titulo_es}</h4>
                      <p className={styles.newsContent}>{n.contenido_es}</p>
                      <span className={styles.newsDate}>{n.creado || new Date(n.created_at).toLocaleDateString()}</span>
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
