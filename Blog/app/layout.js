import '@galicia-migrante/shared/css/variables.css';
import './globals.css';

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
      <body>{children}</body>
    </html>
  );
}
