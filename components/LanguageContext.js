'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import esARTranslations from '@/locales/es-AR.json';
import glTranslations from '@/locales/gl.json';
import enTranslations from '@/locales/en.json';
import frTranslations from '@/locales/fr.json';
import deTranslations from '@/locales/de.json';
import itTranslations from '@/locales/it.json';
import { supabase } from '@/lib/supabase';

// FR, DE, IT tienen locale mínimo — las claves faltantes caen a es-AR.
const translations = {
  'es-AR': esARTranslations,
  'gl': glTranslations,
  'en': enTranslations,
  'fr': frTranslations,
  'de': deTranslations,
  'it': itTranslations,
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState('es-AR');
  const [mergedTranslations, setMergedTranslations] = useState(translations);

  useEffect(() => {
    let cancelled = false;

    // 1. Locale inicial desde localStorage o preferencia del navegador
    const savedLocale = localStorage.getItem('gm-locale');
    if (savedLocale && translations[savedLocale]) {
      setLocale(savedLocale);
    } else {
      const browserLang = navigator.language;
      if (browserLang.startsWith('gl')) setLocale('gl');
      else if (browserLang.startsWith('en')) setLocale('en');
    }

    // 2. Overrides manuales desde Supabase (solo texto_custom donde es_manual=true)
    const fetchCustomTranslations = async () => {
      try {
        const { data, error } = await supabase
          .from('traducciones_interfaz')
          .select('clave, idioma, texto_custom')
          .eq('es_manual', true);

        if (cancelled) return;
        if (error) {
          console.warn('Error fetching custom translations:', error.message);
          return;
        }
        if (!data || data.length === 0) return;

        const updated = JSON.parse(JSON.stringify(translations));
        data.forEach(item => {
          if (!item.texto_custom || !updated[item.idioma]) return;
          const keys = item.clave.split('.');
          let obj = updated[item.idioma];
          for (let i = 0; i < keys.length - 1; i++) {
            if (!obj[keys[i]]) obj[keys[i]] = {};
            obj = obj[keys[i]];
          }
          obj[keys[keys.length - 1]] = item.texto_custom;
        });

        setMergedTranslations(updated);
      } catch (err) {
        if (!cancelled) console.warn('Failed to fetch custom translations:', err);
      }
    };

    fetchCustomTranslations();
    return () => { cancelled = true; };
  }, []);

  const changeLocale = (newLocale) => {
    if (translations[newLocale]) {
      setLocale(newLocale);
      localStorage.setItem('gm-locale', newLocale);
    }
  };

  // Helper to fetch nested translation string (e.g., 'nav.inicio')
  const t = (path) => {
    const activeTranslations = mergedTranslations[locale] || mergedTranslations['es-AR'];
    const keys = path.split('.');
    let value = activeTranslations;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return path; // Fallback to path if not found
      }
    }
    return value;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale: changeLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
