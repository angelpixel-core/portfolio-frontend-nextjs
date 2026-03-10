/** @type {import('tailwindcss').Config} */

const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        mont: ["var(--font-mont)", ...fontFamily.sans],
        orbitron: ["var(--font-orbitron)", ...fontFamily.sans],
      },
      colors: {
        dark: "#1b1b1b",
        light: "#f5f5f5",
        primary: "#B63E96", // 240,86,199
        primaryDark: "#58E6D9", // 80,230,217
        // Brand colors for social network icons (Story 14.12)
        brand: {
          linkedin: "#0A66C2",
          github: "#24292f",
          githubLight: "#f0f6fc",
          twitter: "#1DA1F2",
          dribbble: "#EA4C89",
          whatsapp: "#075E54",
          whatsappDark: "#3A8F87",
          calendar: "#676b74",
          calendarDark: "#006bff",
          telegram: "#0889CC",
          telegramDark: "#2AABEE",
        },
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
      },
      backgroundImage: {
        circularLight:
          "repeating-radial-gradient(rgba(0,0,0,0.4) 2px, #f5f5f5 5px, #f5f5f5 100px);",
        circularDark:
          "repeating-radial-gradient(rgba(255,255,255,0.4) 2px, #1b1b1b 8px, #1b1b1b 100px);",
        circularLightLg:
          "repeating-radial-gradient(rgba(0,0,0,0.4) 2px, #f5f5f5 5px, #f5f5f5 80px);",
        circularDarkLg:
          "repeating-radial-gradient(rgba(255,255,255,0.4) 2px, #1b1b1b 8px, #1b1b1b 80px);",
        circularLightMd:
          "repeating-radial-gradient(rgba(0,0,0,0.4) 2px, #f5f5f5 5px, #f5f5f5 60px);",
        circularDarkMd:
          "repeating-radial-gradient(rgba(255,255,255,0.4) 2px, #1b1b1b 6px, #1b1b1b 60px);",
        circularLightSm:
          "repeating-radial-gradient(rgba(0,0,0,0.4) 2px, #f5f5f5 5px, #f5f5f5 40px);",
        circularDarkSm:
          "repeating-radial-gradient(rgba(255,255,255,0.4) 2px, #1b1b1b 4px, #1b1b1b 40px);",
      },
    },
    screens: {
      // =============================================================
      // SEMANTIC BREAKPOINTS (min-width) — Mobile-first
      // Standard Tailwind mobile-first approach. See docs/layout-system.md
      // Epic 11: Responsive Header & Navigation System
      // Story 14.15: Added phablet/mobile for progressive typography scaling
      // Story 24.4: Removed all legacy max-width breakpoints (sm/md/lg/xl/2xl/xs)
      // =============================================================
      // Base styles (no prefix) apply to all viewports (0px+)
      // Then breakpoints cascade upward with min-width
      phablet: "400px", // => @media (min-width: 400px) { ... } Phablet: 400-479px (small→normal phone)
      mobile: "480px", // => @media (min-width: 480px) { ... } Large Mobile: 480-639px (normal→large phone)
      tablet: "640px", // => @media (min-width: 640px) { ... } Tablet: 640-799px
      // Story 12.1: nav: intermediate layout breakpoint for content scaling
      // Header/mobile-to-desktop menu transition now uses navContent (880px)
      nav: "800px", // => @media (min-width: 800px) { ... } Nav: 800-1024px (intermediate content tier)
      stage: "960px", // => @media (min-width: 960px) { ... } Stage: hero layout swap
      // Story 25.4: Added compact, medium, content, navContent tokens for breakpoint tokenization
      // Token names follow single-word lowercase convention (coherent with existing pattern)
      compact: "560px", // NEW — progressive typography step (phablet → 400 → 560 → mobile)
      medium: "720px", // NEW — tablet content expansion
      content: "768px", // NEW — content layout shifts
      // ⚠️ COUPLED: If changed, also update NAV_BREAKPOINT in MenuFloatingClient and MobileMenuOverlay
      navContent: "880px", // NEW — nav content full display + menu transition threshold
      desktop: "1024px", // => @media (min-width: 1024px) { ... } Desktop: 1024-1439px (normalized Foundation/MaterialDesign)
      wide: "1440px", // => @media (min-width: 1440px) { ... } Wide: ≥1440px (normalized Foundation xxl)
    },
  },
  plugins: [],
};
