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
    titleKey: 'home.servicios.arbol.title',
    descKey: 'home.servicios.arbol.desc',
    href: ARBOL_URL,
    active: true,
    color: 'blue',
  },
  {
    id: 'territorio',
    emoji: '📍',
    titleKey: 'home.servicios.territorio.title',
    descKey: 'home.servicios.territorio.desc',
    href: '/lugar-galicia',
    active: true,
    color: 'green',
  },
  {
    id: 'asociaciones',
    emoji: '🏛️',
    titleKey: 'home.servicios.asociaciones.title',
    descKey: 'home.servicios.asociaciones.desc',
    href: '/asociaciones',
    active: true,
    color: 'gold',
  },
  {
    id: 'blog',
    emoji: '📰',
    titleKey: 'home.servicios.blog.title',
    descKey: 'home.servicios.blog.desc',
    href: '/blog',
    active: true,
    color: 'blue',
  },
  {
    id: 'biblioteca',
    emoji: '📚',
    titleKey: 'home.servicios.biblioteca.title',
    descKey: 'home.servicios.biblioteca.desc',
    href: null,
    active: false,
    color: 'gold',
  },
  {
    id: 'tramites',
    emoji: '📋',
    titleKey: 'home.servicios.tramites.title',
    descKey: 'home.servicios.tramites.desc',
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
              <strong>3 {t('home.stat_languages')}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. EL ECOSISTEMA (SERVICIOS) ──────────────────────────── */}
      <section className={styles.section} aria-labelledby="services-title">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>{t('home.todo_un_solo_lugar')}</p>
            <h2 id="services-title" className={styles.sectionTitle}>{t('home.ecosistema_digital')}</h2>
            <p className={styles.sectionDesc}>
              {t('home.herramientas_disenadas')}
            </p>
          </div>

          <div className={styles.servicesGrid}>
            {SERVICES.map((s) => {
              const cardContent = (
                <div className={`${styles.serviceCard} ${s.color === 'blue' ? styles.cardBlue : s.color === 'green' ? styles.cardGreen : styles.cardGold} ${!s.active ? styles.cardSoon : ''}`}>
                  <div className={styles.serviceEmoji}>{s.emoji}</div>
                  <h3 className={styles.serviceTitle}>
                    {t(s.titleKey)}
                    {!s.active && <span className={styles.badgeSoon}>{t('nav.proximamente')}</span>}
                  </h3>
                  <p className={styles.serviceDesc}>{t(s.descKey)}</p>
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
              <p className={styles.sectionEyebrow} style={{ color: 'var(--gm-green)' }}>{t('home.motor.eyebrow')}</p>
              <h2 id="feature-tree-title" className={styles.featureTitle}>{t('home.motor.title')}</h2>
              <p className={styles.featureDesc}>
                {t('home.motor.desc')}
              </p>
              <div className={styles.featurePoints}>
                <div className={styles.pointItem}>
                  <div className={styles.pointIcon}>✓</div>
                  <div className={styles.pointText}>
                    <h4>{t('home.motor.punto1_title')}</h4>
                    <p>{t('home.motor.punto1_desc')}</p>
                  </div>
                </div>
                <div className={styles.pointItem}>
                  <div className={styles.pointIcon}>✓</div>
                  <div className={styles.pointText}>
                    <h4>{t('home.motor.punto2_title')}</h4>
                    <p>{t('home.motor.punto2_desc')}</p>
                  </div>
                </div>
                <div className={styles.pointItem}>
                  <div className={styles.pointIcon}>✓</div>
                  <div className={styles.pointText}>
                    <h4>{t('home.motor.punto3_title')}</h4>
                    <p>{t('home.motor.punto3_desc')}</p>
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
                  <span className={`${styles.nodeCondition} ${styles.tagGaliciaBorn}`}>{t('home.motor.mockup_nacido_galicia')}</span>
                </div>

                {/* Nodo Madre */}
                <div className={`${styles.previewNode} ${styles.nodeFemale}`} style={{ top: '30px', left: '260px' }}>
                  <span className={styles.nodeName}>María Varela Otero</span>
                  <span className={styles.nodeDates}>1898 – 1974</span>
                  <span className={`${styles.nodeCondition} ${styles.tagGaliciaBorn}`}>{t('home.motor.mockup_nacida_galicia')}</span>
                </div>

                {/* Nodo Hijo */}
                <div className={`${styles.previewNode} ${styles.nodeMale}`} style={{ top: '230px', left: '125px' }}>
                  <span className={styles.nodeName}>José Castro Varela</span>
                  <span className={styles.nodeDates}>1924 – 2005</span>
                  <span className={`${styles.nodeCondition} ${styles.tagDiaspora}`}>{t('home.motor.mockup_diaspora')}</span>
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
                  <h4 style={{ fontWeight: 700, color: 'var(--gm-navy)' }}>{t('home.geografia.mockup_titulo')}</h4>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t('home.geografia.mockup_subtitulo')}</p>
                </div>
              </div>
              <div className={styles.territorySearchBox}>
                <div className={styles.searchField}>
                  <label>{t('home.geografia.mockup_provincia')}</label>
                  <select className={`${styles.searchSelect} ${styles.searchSelectActive}`} disabled>
                    <option>Pontevedra</option>
                  </select>
                </div>
                <div className={styles.searchField}>
                  <label>{t('home.geografia.mockup_concello')}</label>
                  <select className={`${styles.searchSelect} ${styles.searchSelectActive}`} disabled>
                    <option>Lalín</option>
                  </select>
                </div>
                <div className={styles.searchField}>
                  <label>{t('home.geografia.mockup_parroquia')}</label>
                  <select className={`${styles.searchSelect} ${styles.searchSelectActive}`} disabled>
                    <option>Donramiro (Santa María)</option>
                  </select>
                </div>
                <span className={styles.resultsTag}>{t('home.geografia.mockup_personas_vinculadas')}</span>
              </div>
            </div>

            <div className={styles.featureInfo}>
              <p className={styles.sectionEyebrow} style={{ color: 'var(--gm-blue-dark)' }}>{t('home.geografia.eyebrow')}</p>
              <h2 id="feature-territory-title" className={styles.featureTitle}>{t('home.geografia.title')}</h2>
              <p className={styles.featureDesc}>
                {t('home.geografia.desc')}
              </p>
              <div className={styles.featurePoints}>
                <div className={styles.pointItem}>
                  <div className={styles.pointIcon}>✓</div>
                  <div className={styles.pointText}>
                    <h4>{t('home.geografia.punto1_title')}</h4>
                    <p>{t('home.geografia.punto1_desc')}</p>
                  </div>
                </div>
                <div className={styles.pointItem}>
                  <div className={styles.pointIcon}>✓</div>
                  <div className={styles.pointText}>
                    <h4>{t('home.geografia.punto2_title')}</h4>
                    <p>{t('home.geografia.punto2_desc')}</p>
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
            <p className={styles.sectionEyebrow}>{t('home.comunidad.eyebrow')}</p>
            <h2 id="community-title" className={styles.sectionTitle}>{t('home.comunidad.title')}</h2>
            <p className={styles.sectionDesc}>
              {t('home.comunidad.desc')}
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
                    <span className={styles.blogTag}>{t('home.comunidad.blog_tag')}</span>
                  </div>
                  <div className={styles.blogContent}>
                    <h3 className={styles.blogTitle}>{t('home.comunidad.blog_title')}</h3>
                    <p className={styles.blogExcerpt}>
                      {t('home.comunidad.blog_desc')}
                    </p>
                    <div className={styles.blogMeta}>
                      <span>{t('home.comunidad.blog_meta')}</span>
                      <span className={styles.readMoreLink}>{t('home.comunidad.blog_leer')}</span>
                    </div>
                  </div>
                </article>
              </Link>
            </div>

            {/* Agenda */}
            <div className={styles.agendaColumn}>
              <div className={styles.agendaTitleRow}>
                <h3>{t('home.comunidad.eventos_titulo')}</h3>
                <Link href="/agenda" className={styles.agendaLinkAll}>
                  {t('home.comunidad.eventos_ver_todos')}
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
            {t('home.cta_final.titulo')}
          </h2>
          <p className={styles.ctaDesc}>
            {t('home.cta_final.desc')}
          </p>
          <Link href="/auth?mode=register" className={styles.ctaButton} id="final-cta-btn">
            {t('home.cta_final.boton')}
          </Link>
        </div>
      </section>
    </>
  );
}

