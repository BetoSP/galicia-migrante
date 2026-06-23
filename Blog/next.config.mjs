import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permite archivos .mdx como páginas y componentes
  pageExtensions: ['js', 'jsx', 'mdx'],
  // Procesa el paquete compartido a través del pipeline de Next.js
  transpilePackages: ['@galicia-migrante/shared'],
};

const withMDX = createMDX({
  // Opciones adicionales de remark/rehype se agregan aquí en el futuro
  options: {},
});

export default withMDX(nextConfig);
