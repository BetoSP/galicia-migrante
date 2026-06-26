'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';
import { useTranslation } from '@/components/LanguageContext';

const FALLBACK_EVENTS = [
  { id: 1, date: '25 Jul 2026', dia: 'Sábado', title: 'Día Nacional de Galicia', place: 'Centro Gallego de Buenos Aires', desc: 'Celebración del Día Nacional de Galicia con actos culturales, música tradicional y exposición fotográfica.', type: 'Cultural', color: 'blue' },
  { id: 2, date: '3 Ago 2026', dia: 'Lunes', title: 'Taller: Cómo construir tu árbol genealógico', place: 'Online — Galicia Migrante', desc: 'Introducción práctica a la genealogía gallega. Aprende a usar el portal, importar datos desde GEDCOM y buscar ancestros.', type: 'Genealogía', color: 'gold' },
  { id: 3, date: '10 Ago 2026', dia: 'Lunes', title: 'Festival de Música Tradicional Gallega', place: 'Asociación Galicia, Córdoba', desc: 'Grupos de gaitas, panderos y cantareiras en un festival al aire libre. Entrada libre y gratuita.', type: 'Cultural', color: 'blue' },
  { id: 4, date: '22 Ago 2026', dia: 'Sábado', title: 'Caminata por los orígenes gallegos', place: 'Barrio de La Boca, Buenos Aires', desc: 'Recorrido histórico por los barrios porteños con mayor presencia gallega de principios del siglo XX.', type: 'Historia', color: 'green' },
];

function formatEventDate(dateString, locale = 'es-AR') {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return { date: dateString, dia: '' };
    
    const dateFormatted = d.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
    const dayName = d.toLocaleDateString(locale, { weekday: 'long' });
    return {
      date: dateFormatted,
      dia: dayName.charAt(0).toUpperCase() + dayName.slice(1)
    };
  } catch (err) {
    return { date: dateString, dia: '' };
  }
}

function getEventColor(type) {
  switch (type?.toLowerCase()) {
    case 'taller':
    case 'genealogia':
      return 'gold';
    case 'musica':
    case 'cultural':
      return 'blue';
    default:
      return 'green';
  }
}

export default function AgendaPage() {
  const { locale, t } = useTranslation();
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dynamicTranslations, setDynamicTranslations] = useState({});

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const { data } = await supabase
          .from('eventos')
          .select('*')
          .eq('publicado', true)
          .order('fecha_inicio', { ascending: true });

        if (data && data.length > 0) {
          setEventsList(data);
        } else {
          setEventsList(FALLBACK_EVENTS);
        }
      } catch (err) {
        console.warn('Error fetching events from Supabase, using local fallback:', err);
        setEventsList(FALLBACK_EVENTS);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Efecto secundario de traducción en caliente
  useEffect(() => {
    if (eventsList.length === 0 || locale === 'es-AR') return;
    const langCode = locale.split('-')[0];

    eventsList.forEach(async (e) => {
      if (e.id === 1 || e.id === 2 || e.id === 3 || e.id === 4) return; // Omitir fallbacks locales estáticos

      const titleField = `titulo_${langCode}`;
      const descField = `descripcion_${langCode}`;

      // Traducir título si no existe
      if (!e[titleField] && e.titulo_es) {
        try {
          const res = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: e.titulo_es, targetLangs: [langCode] })
          });
          const data = await res.json();
          const autoTranslated = data?.translations?.[langCode] || '';
          if (autoTranslated) {
            supabase
              .from('eventos')
              .update({ [titleField]: autoTranslated })
              .eq('id', e.id)
              .then(() => {
                setDynamicTranslations(prev => ({ ...prev, [`${e.id}_title`]: autoTranslated }));
              });
          }
        } catch (err) {
          console.warn(err);
        }
      }

      // Traducir descripción si no existe
      if (!e[descField] && e.descripcion_es) {
        try {
          const res = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: e.descripcion_es, targetLangs: [langCode] })
          });
          const data = await res.json();
          const autoTranslated = data?.translations?.[langCode] || '';
          if (autoTranslated) {
            supabase
              .from('eventos')
              .update({ [descField]: autoTranslated })
              .eq('id', e.id)
              .then(() => {
                setDynamicTranslations(prev => ({ ...prev, [`${e.id}_desc`]: autoTranslated }));
              });
          }
        } catch (err) {
          console.warn(err);
        }
      }
    });
  }, [locale, eventsList]);

  const getEventField = (e, field) => {
    if (locale === 'es-AR') return e[`${field}_es`] || e[field];
    const langCode = locale.split('-')[0];
    const targetField = `${field}_${langCode}`;

    if (dynamicTranslations[`${e.id}_${field}`]) {
      return dynamicTranslations[`${e.id}_${field}`];
    }
    return e[targetField] || e[`${field}_es`] || e[field];
  };

  const getFormattedEvent = (e) => {
    const isMock = e.id === 1 || e.id === 2 || e.id === 3 || e.id === 4;
    const { date, dia } = formatEventDate(isMock ? e.fecha_inicio || new Date() : e.fecha_inicio, locale);
    return {
      id: e.id,
      date: isMock ? e.date : date,
      dia: isMock ? e.dia : dia,
      title: getEventField(e, 'titulo'),
      place: isMock ? e.place : (e.lugar + (e.ciudad ? `, ${e.ciudad}` : '')),
      desc: getEventField(e, 'descripcion'),
      type: e.tipo ? e.tipo.charAt(0).toUpperCase() + e.tipo.slice(1) : 'Evento',
      color: getEventColor(e.tipo)
    };
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '80vh', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)' }}>
        {t('common.loading') || 'Cargando...'}
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>{t('nav.agenda') || 'Axenda'}</p>
          <h1 className={styles.title}>{t('nav.agenda') || 'Agenda'}</h1>
          <p className={styles.subtitle}>
            {t('home.comunidad.desc') || 'Eventos, talleres y actividades de la comunidad gallega. Sumate y participá.'}
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.eventList}>
            {eventsList.map(item => {
              const e = getFormattedEvent(item);
              return (
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
              );
            })}
          </div>
          <div className={styles.notice}>
            <p>{t('agenda.add_event') || '¿Tenés un evento para agregar?'} <a href="mailto:hola@galiciamigrante.com">{t('agenda.contact_us') || 'Contactanos →'}</a></p>
          </div>
        </div>
      </section>
    </div>
  );
}
