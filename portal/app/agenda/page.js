import styles from './page.module.css';

export const metadata = {
  title: 'Agenda',
  description: 'Eventos culturales, talleres y actividades de la colectividad gallega en Argentina y el mundo.',
};

const EVENTS = [
  { id: 1, date: '25 Jul 2026', dia: 'Sábado', title: 'Día Nacional de Galicia', place: 'Centro Gallego de Buenos Aires', desc: 'Celebración del Día Nacional de Galicia con actos culturales, música tradicional y exposición fotográfica.', type: 'Cultural', color: 'blue' },
  { id: 2, date: '3 Ago 2026', dia: 'Lunes', title: 'Taller: Cómo construir tu árbol genealógico', place: 'Online — Galicia Migrante', desc: 'Introducción práctica a la genealogía gallega. Aprende a usar el portal, importar datos desde GEDCOM y buscar ancestros.', type: 'Genealogía', color: 'gold' },
  { id: 3, date: '10 Ago 2026', dia: 'Lunes', title: 'Festival de Música Tradicional Gallega', place: 'Asociación Galicia, Córdoba', desc: 'Grupos de gaitas, panderos y cantareiras en un festival al aire libre. Entrada libre y gratuita.', type: 'Cultural', color: 'blue' },
  { id: 4, date: '22 Ago 2026', dia: 'Sábado', title: 'Caminata por los orígenes gallegos', place: 'Barrio de La Boca, Buenos Aires', desc: 'Recorrido histórico por los barrios porteños con mayor presencia gallega de principios del siglo XX.', type: 'Historia', color: 'green' },
];

export default function AgendaPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Colectividad</p>
          <h1 className={styles.title}>Agenda</h1>
          <p className={styles.subtitle}>
            Eventos, talleres y actividades de la comunidad gallega. Sumate y participá.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.eventList}>
            {EVENTS.map(e => (
              <article key={e.id} className={`${styles.eventCard} ${styles[`event-${e.color}`]}`}>
                <div className={styles.eventDateBlock}>
                  <span className={styles.eventDateText}>{e.date}</span>
                  <span className={styles.eventDia}>{e.dia}</span>
                </div>
                <div className={styles.eventBody}>
                  <div className={styles.eventHeader}>
                    <h2 className={styles.eventTitle}>{e.title}</h2>
                    <span className={`${styles.eventBadge} ${styles[`badge-${e.color}`]}`}>{e.type}</span>
                  </div>
                  <p className={styles.eventPlace}>📍 {e.place}</p>
                  <p className={styles.eventDesc}>{e.desc}</p>
                </div>
              </article>
            ))}
          </div>
          <div className={styles.notice}>
            <p>¿Tenés un evento para agregar? <a href="mailto:hola@galiciamigrante.com">Contactanos →</a></p>
          </div>
        </div>
      </section>
    </div>
  );
}
