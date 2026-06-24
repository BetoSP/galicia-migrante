import '@galicia-migrante/shared/css/variables.css';
import './globals.css';
import './portal-tokens.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/components/LanguageContext';
import { ThemeProvider } from '@/components/ThemeContext';

export const metadata = {
  title: {
    default: 'Blog — Galicia Migrante',
    template: '%s | Galicia Migrante',
  },
  description:
    'Historias, cultura e identidad de la diáspora gallega en el mundo.',
  metadataBase: new URL('https://galiciamigrante.com'),
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <Navbar />
            <main style={{ paddingTop: '72px' }}>{children}</main>
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
