/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server mode for API routes (required for MongoDB backend)
  // output: 'export', // DISABLED: static export breaks /api/* routes
  distDir: '.next',
  images: { unoptimized: true },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    DATABASE_NAME: process.env.DATABASE_NAME || 'openclaw'
  }
}
module.exports = nextConfig