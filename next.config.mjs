import createMDX from '@next/mdx';

// Avast SSL inspection intercepts HTTPS and replaces the cert with its own.
// Node.js doesn't trust it by default, causing fetch to fail in dev.
// Production (Vercel) is unaffected — this guard runs only locally.
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx'],
  images: {
    qualities: [75, 90, 100],
  },
};

const withMDX = createMDX({
  options: {},
});

export default withMDX(nextConfig);
