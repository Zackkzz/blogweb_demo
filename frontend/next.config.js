/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Enable high quality images
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    // Disable image optimization for local images if needed, or configure properly
    unoptimized: false,
    // Allow favicon images
    remotePatterns: [],
  },
}
module.exports = nextConfig
