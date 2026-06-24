'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('auto'); // 'light' | 'dark' | 'auto'
  const [resolvedTheme, setResolvedTheme] = useState('light'); // 'light' | 'dark' (actual applied theme)
  const [mounted, setMounted] = useState(false);

  // Apply theme to document element
  const applyTheme = (themeValue, isDarkSystem) => {
    let active = 'light';
    if (themeValue === 'dark') {
      active = 'dark';
    } else if (themeValue === 'light') {
      active = 'light';
    } else {
      active = isDarkSystem ? 'dark' : 'light';
    }

    setResolvedTheme(active);
    document.documentElement.setAttribute('data-theme', active);
    document.documentElement.setAttribute('data-theme-preference', themeValue);
  };

  useEffect(() => {
    // 1. Get saved theme or default to auto
    const savedTheme = localStorage.getItem('gm-theme') || 'auto';
    setTheme(savedTheme);

    // 2. Set up system prefers-color-scheme listener
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e) => {
      if (localStorage.getItem('gm-theme') === 'auto' || !localStorage.getItem('gm-theme')) {
        applyTheme('auto', e.matches);
      }
    };
    mediaQuery.addEventListener('change', handleSystemChange);

    // 3. Initial apply
    applyTheme(savedTheme, mediaQuery.matches);
    setMounted(true);

    // 4. Ambient Light Sensor API Integration (Auto mode only)
    let sensor = null;
    if (savedTheme === 'auto' && 'AmbientLightSensor' in window) {
      try {
        // We use a try-catch because permissions or browser security settings might block it
        sensor = new window.AmbientLightSensor({ frequency: 0.5 }); // check every 2 seconds
        
        const handleSensorReading = () => {
          // lux levels: < 15 lux is typical for dim/dark rooms
          const isDarkRoom = sensor.illuminance < 15;
          applyTheme('auto', isDarkRoom);
        };

        sensor.addEventListener('reading', handleSensorReading);
        sensor.addEventListener('error', (event) => {
          console.warn('AmbientLightSensor error:', event.error.name, event.error.message);
        });
        
        sensor.start();
      } catch (err) {
        console.warn('AmbientLightSensor failed to initialize:', err);
      }
    }

    return () => {
      mediaQuery.removeEventListener('change', handleSystemChange);
      if (sensor) {
        try {
          sensor.stop();
        } catch (e) {}
      }
    };
  }, [theme]);

  const changeTheme = (newTheme) => {
    if (['light', 'dark', 'auto'].includes(newTheme)) {
      setTheme(newTheme);
      localStorage.setItem('gm-theme', newTheme);
      
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(newTheme, mediaQuery.matches);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme: changeTheme }}>
      <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
