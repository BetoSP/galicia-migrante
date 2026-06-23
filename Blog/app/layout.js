import '@galicia-migrante/shared/css/variables.css';
import './globals.css';
import './portal-tokens.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
        <Navbar />
        <main style={{ paddingTop: '72px' }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
