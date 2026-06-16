const path = require("path");

// Build-time env validation
const useMocks = process.env.NEXT_PUBLIC_USE_MOCKS !== "false";
const isProduction = process.env.NODE_ENV === "production";

const buildApiOrigin = () => {
  const apiHost = process.env.NEXT_PUBLIC_API_HOST?.trim();

  if (!apiHost) {
    return null;
  }

  const backendPort = process.env.NEXT_PUBLIC_BACKEND_PORT?.trim();

  const normalizedHost = apiHost.replace(/\/+$/, "");

  if (/^https?:\/\//i.test(normalizedHost)) {
    const url = new URL(normalizedHost);

    if (backendPort && !url.port) {
      url.port = backendPort;
    }

    return url.origin;
  }

  const protocol = isProduction ? "https" : "http";
  return backendPort
    ? `${protocol}://${normalizedHost}:${backendPort}`
    : `${protocol}://${normalizedHost}`;
};

const apiOrigin = buildApiOrigin();

if (process.env.NODE_ENV === "production" && !process.env.SITE_URL) {
  console.warn(
    "[env] SITE_URL not set. Sitemap/robots.txt will use localhost:3000."
  );
}

// Security headers
const isDev = process.env.NODE_ENV === "development";

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.google.com https://www.gstatic.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' https: blob: data:;
    font-src 'self';
    object-src 'none';
    connect-src 'self' https://www.google.com https://www.gstatic.com${apiOrigin ? ` ${apiOrigin}` : ""};
    frame-src 'self' https://www.google.com https://www.gstatic.com;
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    ${isDev ? "" : "upgrade-insecure-requests;"}
`;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // On Vercel this app is checked out at /vercel/path0. Using a broader
  // tracing root can resolve outside the project and break route manifest
  // lookup during deployment packaging.
  outputFileTracingRoot: process.env.VERCEL
    ? path.resolve(__dirname)
    : path.resolve(__dirname, "../../../../"),
  // Enable source maps in production for better debugging
  // Lighthouse best-practice: helps debug minified code
  productionBrowserSourceMaps: true,
  // Standalone output for Docker builds (activated via NEXT_OUTPUT=standalone)
  output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined,
  // Custom image sizes for better optimization
  // Includes sizes matching hero image responsive breakpoints (280px, 450px)
  images: {
    deviceSizes: [280, 450, 640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
    ],
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
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["warn", "error"] }
        : false,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\s{2,}/g, " ").trim(),
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
