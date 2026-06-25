'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import { useTranslation } from '@/components/LanguageContext';

const ARBOL_URL = '/arbol';

const SERVICES = [
  {
    id: 'arbol',
    emoji: '🌳',
    title: 'Tu árbol genealógico',
    desc: 'Construye y visualiza tu historia familiar con un motor propio e independiente de alto rendimiento. Importación rápida desde GEDCOM, CSV o Excel.',
    href: ARBOL_URL,
    active: true,
    color: 'blue',
  },
  {
    id: 'territorio',
    emoji: '📍',
    title: 'Tu lugar en Galicia',
    desc: 'Ubica con precisión la aldea, parroquia y concello original de tus ancestros utilizando bases de datos oficiales de geolocalización gallega.',
    href: '/lugar-galicia',
    active: true,
    color: 'green',
  },
  {
    id: 'asociaciones',
    emoji: '🏛️',
    title: 'Asociaciones gallegas',
    desc: 'Directorio unificado de centros gallegos en Argentina y todo el mundo. Espacios exclusivos para conectar y revivir las costumbres locales.',
    href: '/asociaciones',
    active: true,
    color: 'gold',
  },
  {
    id: 'blog',
    emoji: '📰',
    title: 'Crónicas de la Diáspora',
    desc: 'Historias de vida, cultura, arte y testimonios de la colectividad. El espacio de expresión e identidad gallega en el mundo.',
    href: '/blog',
    active: true,
    color: 'blue',
  },
  {
    id: 'biblioteca',
    emoji: '📚',
    title: 'Biblioteca digital',
    desc: 'Acceso exclusivo a libros históricos, diarios de migración y documentos de valor histórico para miembros del portal.',
    href: null,
    active: false,
    color: 'gold',
  },
  {
    id: 'tramites',
    emoji: '📋',
    title: 'Trámites & Xunta',
    desc: 'Guía informativa actualizada sobre nacionalidad española (Ley de Memoria Democrática), programas de retorno y becas de la Xunta de Galicia.',
    href: '/xunta',
    active: true,
    color: 'green',
  },
];

const EVENTS = [
  { id: 1, date: '25 Jul', title: 'Día Nacional de Galicia', location: 'Centro Gallego de Buenos Aires', type: 'Cultural' },
  { id: 2, date: '03 Ago', title: 'Taller Práctico de Genealogía', location: 'Online — Portal Galicia Migrante', type: 'Genealogía' },
  { id: 3, date: '10 Ago', title: 'Gran Banquete & Romería', location: 'Asociación Gallega de Córdoba', type: 'Social' },
];

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <>
      {/* ── 1. HERO SECTION ───────────────────────────────────────── */}
      <section className={styles.hero} aria-label="Presentación del portal">
        <div className={styles.heroBg}>
          <Image
            src="/hero-galicia.png"
            alt="Costas de Galicia"
            fill
            priority
            quality={90}
            style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
          />
          <div className={styles.heroOverlay} />
        </div>
        <div className={styles.heroContent}>
          <div className={styles.heroEyebrow}>
            <span className={styles.eyebrowLine} />
            <span>{t('home.eyebrow')}</span>
            <span className={styles.eyebrowLine} />
          </div>
          <h1 className={styles.heroTitle}>
            {t('home.roots')}<br />
            <em>{t('home.history')}</em><br />
            {t('home.identity')}
          </h1>
          <p className={styles.heroDesc}>
            {t('home.desc')}
          </p>
          <div className={styles.heroCtas}>
            <Link href={ARBOL_URL} className={styles.ctaPrimary} id="hero-cta-arbol">
              {t('home.cta_arbol')}
            </Link>
            <Link href="/quienes-somos" className={styles.ctaSecondary} id="hero-cta-conocer">
              {t('home.cta_conocer')}
            </Link>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <strong>3.800+</strong>
              <span>{t('home.stat_parroquias')}</span>
            </div>
            <div className={styles.statDiv} />
            <div className={styles.stat}>
              <strong>GEDCOM</strong>
              <span>{t('home.stat_gedcom')}</span>
            </div>
            <div className={styles.statDiv} />
            <div className={styles.stat}>
              <strong>3 Idiomas</strong>
              <span>{t('home.stat_languages')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. EL ECOSISTEMA (SERVICIOS) ──────────────────────────── */}
      <section className={styles.section} aria-labelledby="services-title">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>Todo en un solo lugar</p>
            <h2 id="services-title" className={styles.sectionTitle}>El Ecosistema Digital</h2>
            <p className={styles.sectionDesc}>
              Herramientas especialmente diseñadas para ayudarte a reconstruir tu historia familiar, reencontrar tus orígenes y mantener viva la cultura gallega.
            </p>
          </div>

          <div className={styles.servicesGrid}>
            {SERVICES.map((s) => {
              const cardContent = (
                <div className={`${styles.serviceCard} ${s.color === 'blue' ? styles.cardBlue : s.color === 'green' ? styles.cardGreen : styles.cardGold} ${!s.active ? styles.cardSoon : ''}`}>
                  <div className={styles.serviceEmoji}>{s.emoji}</div>
                  <h3 className={styles.serviceTitle}>
                    {s.title}
                    {!s.active && <span className={styles.badgeSoon}>Próximamente</span>}
                  </h3>
                  <p className={styles.serviceDesc}>{s.desc}</p>
                  {s.active && <span className={styles.serviceArrow}>→</span>}
                </div>
              );

              if (!s.active || !s.href) {
                return <div key={s.id}>{cardContent}</div>;
              }
              return (
                <Link key={s.id} href={s.href} className={styles.serviceLink}>
                  {cardContent}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. DETALLE: MOTOR GENEALÓGICO PROPIO ──────────────────── */}
      <section className={`${styles.section} ${styles.featureSection}`} aria-labelledby="feature-tree-title">
        <div className={styles.container}>
          <div className={styles.splitLayout}>
            <div className={styles.featureInfo}>
              <p className={styles.sectionEyebrow} style={{ color: 'var(--gm-green)' }}>Tecnología de Vanguardia</p>
              <h2 id="feature-tree-title" className={styles.featureTitle}>Un motor de genealogía robusto y a medida</h2>
              <p className={styles.featureDesc}>
                Diseñamos y programamos nuestro propio motor gráfico y de base de datos desde cero. Sin depender de librerías externas genéricas que se rompen o desactualizan.
              </p>
              <div className={styles.featurePoints}>
                <div className={styles.pointItem}>
                  <div className={styles.pointIcon}>✓</div>
                  <div className={styles.pointText}>
                    <h4>100% Basado en Datos Relacionales</h4>
                    <p>Toda la información se almacena en esquemas SQL robustos, permitiendo búsquedas rápidas y conexiones dinámicas instantáneas.</p>
                  </div>
                </div>
                <div className={styles.pointItem}>
                  <div className={styles.pointIcon}>✓</div>
                  <div className={styles.pointText}>
                    <h4>Visualización Gráfica Interactiva</h4>
                    <p>Explora tu árbol genealógico en un lienzo interactivo con zoom fluido, perfiles laterales, arrastre y reajuste automático de jerarquías.</p>
                  </div>
                </div>
                <div className={styles.pointItem}>
                  <div className={styles.pointIcon}>✓</div>
                  <div className={styles.pointText}>
                    <h4>Condición Migratoria Destacada</h4>
                    <p>Identifica visualmente en el árbol quiénes nacieron en Galicia, quiénes emigraron y quiénes forman parte de la diáspora retornada.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mockup visual de Árbol Genealógico */}
            <div className={styles.treePreviewWrapper}>
              <div className={styles.treePreviewCanvas}>
                {/* Líneas de conexión */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                  <path d="M 125,75 L 295,75" className={`${styles.treeLine} ${styles.treeLineSpouse}`} />
                  <path d="M 210,75 L 210,170" className={styles.treeLine} />
                  <path d="M 210,170 L 210,230" className={styles.treeLine} />
                </svg>

                {/* Nodo Padre */}
                <div className={`${styles.previewNode} ${styles.nodeMale}`} style={{ top: '30px', left: '15px' }}>
                  <span className={styles.nodeName}>Manuel Castro Novo</span>
                  <span className={styles.nodeDates}>1892 – 1968</span>
                  <span className={`${styles.nodeCondition} ${styles.tagGaliciaBorn}`}>Nacido en Galicia</span>
                </div>

                {/* Nodo Madre */}
                <div className={`${styles.previewNode} ${styles.nodeFemale}`} style={{ top: '30px', left: '260px' }}>
                  <span className={styles.nodeName}>María Varela Otero</span>
                  <span className={styles.nodeDates}>1898 – 1974</span>
                  <span className={`${styles.nodeCondition} ${styles.tagGaliciaBorn}`}>Nacida en Galicia</span>
                </div>

                {/* Nodo Hijo */}
                <div className={`${styles.previewNode} ${styles.nodeMale}`} style={{ top: '230px', left: '125px' }}>
                  <span className={styles.nodeName}>José Castro Varela</span>
                  <span className={styles.nodeDates}>1924 – 2005</span>
                  <span className={`${styles.nodeCondition} ${styles.tagDiaspora}`}>Diáspora (Argentina)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. DETALLE: BÚSQUEDA TERRITORIAL PENSADA ──────────────── */}
      <section className={`${styles.section} ${styles.featureSection} ${styles.featureSectionAlt}`} aria-labelledby="feature-territory-title">
        <div className={styles.container}>
          <div className={styles.splitLayout}>
            {/* Mockup Búsqueda Territorial */}
            <div className={styles.territoryWrapper}>
              <div className={styles.territoryHeader}>
                <span className={styles.territoryPin}>📍</span>
                <div>
                  <h4 style={{ fontWeight: 700, color: 'var(--gm-navy)' }}>Raíces Territoriales</h4>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Galicia, España</p>
                </div>
              </div>
              <div className={styles.territorySearchBox}>
                <div className={styles.searchField}>
                  <label>Provincia</label>
                  <select className={`${styles.searchSelect} ${styles.searchSelectActive}`} disabled>
                    <option>Pontevedra</option>
                  </select>
                </div>
                <div className={styles.searchField}>
                  <label>Concello (Municipio)</label>
                  <select className={`${styles.searchSelect} ${styles.searchSelectActive}`} disabled>
                    <option>Lalín</option>
                  </select>
                </div>
                <div className={styles.searchField}>
                  <label>Parroquia</label>
                  <select className={`${styles.searchSelect} ${styles.searchSelectActive}`} disabled>
                    <option>Donramiro (Santa María)</option>
                  </select>
                </div>
                <span className={styles.resultsTag}>✓ 12 personas vinculadas a esta parroquia</span>
              </div>
            </div>

            <div className={styles.featureInfo}>
              <p className={styles.sectionEyebrow} style={{ color: 'var(--gm-blue-dark)' }}>Fidelidad Geográfica</p>
              <h2 id="feature-territory-title" className={styles.featureTitle}>Conexión geográfica real con la tierra</h2>
              <p className={styles.featureDesc}>
                La emigración gallega no se explica con campos de texto libre generales. Para encontrar el origen real de tu familia necesitas bajar al máximo detalle administrativo gallego.
              </p>
              <div className={styles.featurePoints}>
                <div className={styles.pointItem}>
                  <div className={styles.pointIcon}>✓</div>
                  <div className={styles.pointText}>
                    <h4>Base de datos oficial integrada</h4>
                    <p>Trabajamos con la estructura territorial oficial de Galicia con sus 4 provincias, 313 concellos y más de 3.800 parroquias históricas.</p>
                  </div>
                </div>
                <div className={styles.pointItem}>
                  <div className={styles.pointIcon}>✓</div>
                  <div className={styles.pointText}>
                    <h4>Sin Errores de Escritura</h4>
                    <p>Al seleccionar opciones normalizadas en vez de escribir texto libre, garantizamos que los registros coincidan de forma exacta entre diferentes ramas de la comunidad.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. COMUNIDAD: BLOG & AGENDA ───────────────────────────── */}
      <section className={`${styles.section} ${styles.communitySection}`} aria-labelledby="community-title">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>Vida Comunitaria</p>
            <h2 id="community-title" className={styles.sectionTitle}>Conectados en la diáspora</h2>
            <p className={styles.sectionDesc}>
              Entérate de las actividades de los centros gallegos y disfruta de artículos sobre la historia, el arte y el presente de nuestra colectividad.
            </p>
          </div>

          <div className={styles.communityGrid}>
            {/* Destacado del Blog */}
            <div>
              <Link href="/blog" className={styles.serviceLink}>
                <article className={styles.blogCardLarge}>
                  <div className={styles.blogImageWrapper}>
                    <Image
                      src="/hero-galicia.png"
                      alt="Historia gallega"
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                    <span className={styles.blogTag}>Cultura</span>
                  </div>
                  <div className={styles.blogContent}>
                    <h3 className={styles.blogTitle}>La huella de la emigración gallega en Sudamérica</h3>
                    <p className={styles.blogExcerpt}>
                      Un recorrido histórico sobre los primeros centros gallegos fundados a fines del siglo XIX en Argentina y Uruguay, su rol mutual y la preservación de la lengua gallega.
                    </p>
                    <div className={styles.blogMeta}>
                      <span>Publicado recientemente en Crónicas</span>
                      <span className={styles.readMoreLink}>Leer artículo →</span>
                    </div>
                  </div>
                </article>
              </Link>
            </div>

            {/* Agenda */}
            <div className={styles.agendaColumn}>
              <div className={styles.agendaTitleRow}>
                <h3>Próximos eventos</h3>
                <Link href="/agenda" className={styles.agendaLinkAll}>
                  Ver todos →
                </Link>
              </div>

              <div className={styles.eventList}>
                {EVENTS.map((e) => (
                  <div key={e.id} className={styles.eventCard}>
                    <div className={styles.eventDate}>
                      {e.date}
                    </div>
                    <div className={styles.eventInfo}>
                      <h4 className={styles.eventTitle}>{e.title}</h4>
                      <p className={styles.eventLocation}>📍 {e.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. CTA FINAL ──────────────────────────────────────────── */}
      <section className={styles.ctaSection} aria-labelledby="cta-title">
        <div className={styles.ctaInner}>
          <h2 id="cta-title" className={styles.ctaTitle}>
            Tu historia familiar<br />te espera en <em>Galicia</em>.
          </h2>
          <p className={styles.ctaDesc}>
            Formá parte hoy del primer y único portal diseñado en exclusiva para reconstruir, resguardar y transmitir las raíces y la cultura de la diáspora gallega.
          </p>
          <Link href="/auth?mode=register" className={styles.ctaButton} id="final-cta-btn">
            Registrarme gratis →
          </Link>
        </div>
      </section>
    </>
  );
}
