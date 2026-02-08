/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Optimize package imports for better tree-shaking
    // Reduces framer-motion bundle size significantly
    optimizePackageImports: ["framer-motion", "@tanstack/react-query"],
  },
  // Compiler optimizations
  compiler: {
    // Remove console.log in production (keeps warn/error)
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["warn", "error"] } : false,
  },
};

module.exports = nextConfig;
