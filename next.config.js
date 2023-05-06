/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // THESE 2 below ARE KEY for static pages to generate in /out directory!
  output: 'export',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
