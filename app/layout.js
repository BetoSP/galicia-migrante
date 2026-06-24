import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/components/LanguageContext';
import { ThemeProvider } from '@/components/ThemeContext';
import { AuthProvider } from '@/components/AuthProvider';

export const metadata = {
  title: {
    default: 'Galicia Migrante — Portal de la diáspora gallega',
    template: '%s | Galicia Migrante',
  },
  description:
    'Ecosistema digital para preservar, reconstruir y transmitir la cultura gallega en la diáspora. Construye tu árbol genealógico, conecta con tu comunidad y redescubre tus raíces gallegas.',
  keywords: ['galicia', 'genealogía', 'diáspora gallega', 'árbol genealógico', 'cultura gallega', 'emigrantes gallegos'],
  metadataBase: new URL('https://portal.galiciamigrante.com'),
  openGraph: {
    title: 'Galicia Migrante',
    description: 'Tu ecosistema digital de raíces gallegas',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <Navbar />
              <main style={{ paddingTop: '72px' }}>{children}</main>
              <Footer />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

