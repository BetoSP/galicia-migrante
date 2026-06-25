import createMDX from '@next/mdx';

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
