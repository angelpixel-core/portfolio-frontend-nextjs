// Build-time env validation
const useMocks = process.env.NEXT_PUBLIC_USE_MOCKS !== "false";

if (!useMocks) {
  const required = ["NEXT_PUBLIC_API_HOST"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `[env] Missing required variables for production mode (USE_MOCKS=false):\n` +
        missing.map((k) => `  - ${k}`).join("\n")
    );
  }
}

if (process.env.NODE_ENV === "production" && !process.env.SITE_URL) {
  console.warn(
    "[env] SITE_URL not set. Sitemap/robots.txt will use localhost:3000."
  );
}

// Security headers
const isDev = process.env.NODE_ENV === "development";

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    connect-src 'self';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;

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
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
