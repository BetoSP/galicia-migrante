'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import esARTranslations from '@/locales/es-AR.json';
import glTranslations from '@/locales/gl.json';
import enTranslations from '@/locales/en.json';
import { supabase } from '@/lib/supabase';

const translations = {
  'es-AR': esARTranslations,
  'gl': glTranslations,
  'en': enTranslations,
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState('es-AR');
  const [mounted, setMounted] = useState(false);
  const [mergedTranslations, setMergedTranslations] = useState(translations);

  useEffect(() => {
    // 1. Local storage settings
    const savedLocale = localStorage.getItem('gm-locale');
    if (savedLocale && translations[savedLocale]) {
      setLocale(savedLocale);
    } else {
      const browserLang = navigator.language;
      if (browserLang.startsWith('gl')) {
        setLocale('gl');
      } else if (browserLang.startsWith('en')) {
        setLocale('en');
      }
    }

    // 2. Fetch custom translations from Supabase
    const fetchCustomTranslations = async () => {
      try {
        const { data, error } = await supabase
          .from('traducciones_interfaz')
          .select('clave, idioma, texto_custom');

        if (error) {
          console.warn('Error fetching custom translations from Supabase:', error.message);
          return;
        }

        if (data && data.length > 0) {
          // Deep copy local translations to override them
          const updated = JSON.parse(JSON.stringify(translations));

          data.forEach(item => {
            if (item.texto_custom && updated[item.idioma]) {
              const keys = item.clave.split('.');
              let obj = updated[item.idioma];

              // Traverse keys to set value
              for (let i = 0; i < keys.length - 1; i++) {
                const k = keys[i];
                if (!obj[k]) {
                  obj[k] = {};
                }
                obj = obj[k];
              }
              obj[keys[keys.length - 1]] = item.texto_custom;
            }
          });

          setMergedTranslations(updated);
        }
      } catch (err) {
        console.warn('Failed to fetch custom translations:', err);
      } finally {
        setMounted(true);
      }
    };

    fetchCustomTranslations();
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
      <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
        {children}
      </div>
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
