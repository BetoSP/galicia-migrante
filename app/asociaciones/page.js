import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
  title: 'Asociaciones gallegas',
  description: 'Directorio de centros gallegos en Argentina y el mundo. Encontrá tu asociación y registrá la tuya.',
};

export const revalidate = 30; // Revalidar cada 30 segundos

const FALLBACK_ASOCIACIONES = [
  { id: 'lalin-buenos-aires', nombre: 'Centro Lalín, Golada y Silleda de Buenos Aires', slug: 'centro-lalin-buenos-aires', ciudad: 'Buenos Aires', pais: 'Argentina', fundacion: 1982 },
  { id: 'sociedad-gallega-rosario', nombre: 'Sociedad Gallega de Socorros Mutuos', slug: 'sociedad-gallega-rosario', ciudad: 'Rosario', pais: 'Argentina', fundacion: 1892 },
  { id: 'casa-de-galicia-montevideo', nombre: 'Casa de Galicia', slug: 'casa-de-galicia-montevideo', ciudad: 'Montevideo', pais: 'Uruguay', fundacion: 1921 },
  { id: 'irmandade-galega-cordoba', nombre: 'Irmandade Galega', slug: 'irmandade-galega-cordoba', ciudad: 'Córdoba', pais: 'Argentina', fundacion: 1934 },
  { id: 'centro-galego-sao-paulo', nombre: 'Centro Galego de São Paulo', slug: 'centro-galego-sao-paulo', ciudad: 'São Paulo', pais: 'Brasil', fundacion: 1903 },
  { id: 'asociacion-galicia-mendoza', nombre: 'Asociación Galicia', slug: 'asociacion-galicia-mendoza', ciudad: 'Mendoza', pais: 'Argentina', fundacion: 1945 },
];

export default async function AsociacionesPage() {
  let list = [];
  try {
    const { data, error } = await supabase
      .from('asociaciones')
      .select('*')
      .eq('activa', true)
      .order('nombre', { ascending: true });

    if (data && data.length > 0) {
      list = data;
    } else {
      list = FALLBACK_ASOCIACIONES;
    }
  } catch (err) {
    console.warn('Error fetching asociaciones from Supabase, using local fallback:', err);
    list = FALLBACK_ASOCIACIONES;
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Comunidad</p>
          <h1 className={styles.title}>Asociaciones gallegas</h1>
          <p className={styles.subtitle}>
            Los centros gallegos son el corazón de nuestra comunidad. Encontrá tu asociación y conectá con tu colectividad.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.topBar}>
            <p className={styles.count}>{list.length} asociaciones registradas</p>
            <Link href="/auth?mode=register&redirect=/admin" className={styles.btnRegister}>
              + Registrar mi asociación
            </Link>
          </div>
          <div className={styles.grid}>
            {list.map(a => (
              <Link href={`/asociaciones/${a.slug}`} key={a.id} className={styles.cardLink}>
                <div className={styles.card}>
                  <div className={styles.cardAvatar}>
                    {a.logo_url ? (
                      <img src={a.logo_url} alt={a.nombre} className={styles.logoImg} />
                    ) : (
                      a.nombre.charAt(0)
                    )}
                  </div>
                  <div className={styles.cardInfo}>
                    <h2 className={styles.cardTitle}>{a.nombre}</h2>
                    <p className={styles.cardMeta}>📍 {a.ciudad}, {a.pais}</p>
                    <p className={styles.cardMeta}>📅 Fundada en {a.fundacion}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className={styles.notice}>
            <p>¿Tu asociación no aparece? <a href="mailto:hola@galiciamigrante.com">Contactanos para registrarla gratuitamente →</a></p>
          </div>
        </div>
      </section>
    </div>
  );
}
