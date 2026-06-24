import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
  title: 'Galicia Migrante — Portal de la diáspora gallega',
  description:
    'Ecosistema digital para preservar, reconstruir y transmitir la cultura gallega en la diáspora. Árbol genealógico, comunidad, cultura e identidad.',
};

const ARBOL_URL = 'https://galicia-migrante.vercel.app';

const SERVICES = [
  {
    id: 'arbol',
    emoji: '🌳',
    title: 'Tu árbol genealógico',
    desc: 'Construye y visualiza tu historia familiar. Motor propio sin librerías que fallen. Importa desde GEDCOM, CSV o Excel.',
    href: ARBOL_URL,
    active: true,
    color: 'blue',
  },
  {
    id: 'territorio',
    emoji: '📍',
    title: 'Tu lugar en Galicia',
    desc: 'Explora la parroquia, aldea y concello de tus ancestros. Datos del IGE, ~3.800 parroquias gallegas.',
    href: null,
    active: false,
    color: 'green',
  },
  {
    id: 'asociaciones',
    emoji: '🏛️',
    title: 'Asociaciones gallegas',
    desc: 'Directorio de centros gallegos en Argentina y el mundo. Micrositios propios para cada institución.',
    href: '/asociaciones',
    active: true,
    color: 'gold',
  },
  {
    id: 'blog',
    emoji: '📰',
    title: 'Blog',
    desc: 'Historias, cultura e identidad de la diáspora gallega. Artículos, testimonios y noticias de la comunidad.',
    href: '/blog',
    active: true,
    color: 'blue',
  },
  {
    id: 'biblioteca',
    emoji: '📚',
    title: 'Biblioteca digital',
    desc: 'Libros y documentos sobre emigración gallega. Acceso para miembros del portal.',
    href: null,
    active: false,
    color: 'gold',
  },
  {
    id: 'tramites',
    emoji: '📋',
    title: 'Trámites & Xunta',
    desc: 'Información sobre nacionalidad española, programas de la Xunta de Galicia y ayudas para la diáspora.',
    href: '/xunta',
    active: true,
    color: 'green',
  },
];

const DIFFERENTIALS = [
  {
    icon: '🗺️',
    title: 'Territorialidad gallega',
    desc: 'El único portal que trabaja con parroquia, aldea y concello como campos de primera clase. No texto libre.',
  },
  {
    icon: '⚙️',
    title: 'Motor genealógico propio',
    desc: 'Construimos nuestro motor desde cero. Sin dependencias de terceros que fallen. Árbol robusto y rápido.',
  },
  {
    icon: '🌐',
    title: 'Ecosistema, no solo árbol',
    desc: 'Genealogía, territorio, comunidad, cultura y trámites. Todo en un solo portal pensado para la diáspora.',
  },
];

const EVENTS = [
  { id: 1, date: 'Jul 25', title: 'Día Nacional de Galicia', place: 'Centro Gallego de Buenos Aires', type: 'Cultural' },
  { id: 2, date: 'Ago 3', title: 'Taller de Genealogía', place: 'Online — Galicia Migrante', type: 'Genealogía' },
  { id: 3, date: 'Ago 10', title: 'Festival de Música Gallega', place: 'Asociación Galicia, Córdoba', type: 'Cultural' },
];

export default function HomePage() {
  return (
    <>
      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className={styles.hero} aria-label="Presentación del portal">
        <div className={styles.heroBg}>
          <Image
            src="/hero-galicia.png"
            alt="Costa de Galicia con sus rías y aldeas"
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
            <span>Ecosistema digital gallego</span>
            <span className={styles.eyebrowLine} />
          </div>
          <h1 className={styles.heroTitle}>
            Tus raíces,<br />
            <em>tu historia,</em><br />
            tu identidad.
          </h1>
          <p className={styles.heroDesc}>
            Galicia Migrante es el lugar donde la diáspora gallega preserva su memoria,
            reconstruye su genealogía y se reconecta con la Galicia de sus ancestros.
          </p>
          <div className={styles.heroCtas}>
            <a href={ARBOL_URL} className={styles.ctaPrimary} id="hero-cta-arbol">
              🌳 Construye tu árbol
            </a>
            <Link href="/quienes-somos" className={styles.ctaSecondary} id="hero-cta-conocer">
              Conocer más
            </Link>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}><strong>3.800+</strong><span>parroquias gallegas</span></div>
            <div className={styles.statDiv} />
            <div className={styles.stat}><strong>GEDCOM</strong><span>importación completa</span></div>
            <div className={styles.statDiv} />
            <div className={styles.stat}><strong>3 idiomas</strong><span>ES · GL · EN</span></div>
          </div>
        </div>
        <div className={styles.heroScroll} aria-hidden="true">
          <span>↓</span>
        </div>
      </section>

      {/* ── SERVICIOS ─────────────────────────────────────────── */}
      <section className={`${styles.section} ${styles.servicesSection}`} aria-labelledby="services-title">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>El ecosistema</p>
            <h2 id="services-title" className={styles.sectionTitle}>Todo lo que necesitás en un solo portal</h2>
            <p className={styles.sectionDesc}>Desde genealogía hasta trámites consulares — construido para la diáspora gallega.</p>
          </div>
          <div className={styles.servicesGrid}>
            {SERVICES.map((s) => {
              const Card = (
                <div key={s.id} className={`${styles.serviceCard} ${styles[`card-${s.color}`]} ${!s.active ? styles.cardSoon : ''}`}>
                  <div className={styles.serviceEmoji}>{s.emoji}</div>
                  <h3 className={styles.serviceTitle}>
                    {s.title}
                    {!s.active && <span className="badge-soon">Próximamente</span>}
                  </h3>
                  <p className={styles.serviceDesc}>{s.desc}</p>
                  {s.active && <span className={styles.serviceArrow}>→</span>}
                </div>
              );
              if (!s.active || !s.href) return Card;
              if (s.href.startsWith('http')) return <a key={s.id} href={s.href} className={styles.serviceLink}>{Card}</a>;
              return <Link key={s.id} href={s.href} className={styles.serviceLink}>{Card}</Link>;
            })}
          </div>
        </div>
      </section>

      {/* ── DIFERENCIAL ───────────────────────────────────────── */}
      <section className={`${styles.section} ${styles.diffSection}`} aria-labelledby="diff-title">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow} style={{ color: 'var(--gm-gold)' }}>Por qué elegirnos</p>
            <h2 id="diff-title" className={styles.sectionTitle} style={{ color: '#fff' }}>
              Lo que nos hace distintos
            </h2>
          </div>
          <div className={styles.diffGrid}>
            {DIFFERENTIALS.map((d, i) => (
              <div key={i} className={styles.diffCard}>
                <div className={styles.diffIcon}>{d.icon}</div>
                <h3 className={styles.diffTitle}>{d.title}</h3>
                <p className={styles.diffDesc}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AGENDA TEASER ─────────────────────────────────────── */}
      <section className={`${styles.section} ${styles.agendaSection}`} aria-labelledby="agenda-title">
        <div className={styles.container}>
          <div className={styles.agendaHeader}>
            <div>
              <p className={styles.sectionEyebrow}>Colectividad</p>
              <h2 id="agenda-title" className={styles.sectionTitle}>Próximos eventos</h2>
            </div>
            <Link href="/agenda" className={styles.agendaLink}>Ver agenda completa →</Link>
          </div>
          <div className={styles.eventList}>
            {EVENTS.map((e) => (
              <div key={e.id} className={styles.eventCard}>
                <div className={styles.eventDate}>{e.date}</div>
                <div className={styles.eventInfo}>
                  <h3 className={styles.eventTitle}>{e.title}</h3>
                  <p className={styles.eventPlace}>📍 {e.place}</p>
                </div>
                <span className={styles.eventType}>{e.type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────────── */}
      <section className={`${styles.section} ${styles.ctaSection}`} aria-labelledby="cta-title">
        <div className={styles.ctaInner}>
          <h2 id="cta-title" className={styles.ctaTitle}>
            Galicia tiene algo<br />que ver con vos.
          </h2>
          <p className={styles.ctaDesc}>
            Sumate al ecosistema digital de la diáspora gallega.<br />
            Empieza con tu árbol genealógico, es gratuito.
          </p>
          <a href={`${ARBOL_URL}/auth?mode=register`} className={styles.ctaPrimaryLg} id="final-cta-btn">
            Registrarme gratis →
          </a>
        </div>
      </section>
    </>
  );
}
