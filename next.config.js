/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable source maps in production for better debugging
  // Lighthouse best-practice: helps debug minified code
  productionBrowserSourceMaps: true,
  // Custom image sizes for better optimization
  // Includes sizes matching hero image responsive breakpoints (280px, 450px)
  images: {
    deviceSizes: [280, 450, 640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    // Optimize package imports for better tree-shaking
    // Reduces bundle size for large packages
    optimizePackageImports: [
      "framer-motion",
      "@tanstack/react-query",
      "zod",
      "immer",
    ],
    // Enable critical CSS extraction with critters
    // Inlines critical CSS and defers non-critical styles
    optimizeCss: true,
  },
  // Compiler optimizations
  compiler: {
    // Remove console.log in production (keeps warn/error)
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["warn", "error"] } : false,
  },
};

module.exports = nextConfig;
