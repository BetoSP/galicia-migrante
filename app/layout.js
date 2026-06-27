import './globals.css';
import { Montserrat } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/components/LanguageContext';
import { ThemeProvider } from '@/components/ThemeContext';
import { AuthProvider } from '@/components/AuthProvider';
import { ToastProvider } from '@/components/Toast';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

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
    <html lang="es" className={montserrat.variable}>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <ToastProvider>
                <Navbar />
                <main style={{ paddingTop: '72px' }}>{children}</main>
                <Footer />
              </ToastProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

