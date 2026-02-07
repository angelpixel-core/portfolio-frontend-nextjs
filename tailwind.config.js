/** @type {import('tailwindcss').Config} */

const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        mont: ["var(--font-mont)", ...fontFamily.sans],
      },
      colors: {
        dark: "#1b1b1b",
        light: "#f5f5f5",
        primary: "#B63E96", // 240,86,199
        primaryDark: "#58E6D9", // 80,230,217
        primaryWhatsApp: "#075E54",
        primaryDarkWhatsApp: "#3A8F87",
        primaryCalendar: "#676b74",
        primaryDarkCalendar: "#006bff",
        primaryGitHub: "#fff",
        primaryGooglePlus: "#DD4B39",
        primaryDarkGitHub: "#333",
        primaryLinkedIn: "#fff",
        primaryDarkLinkedIn: "#0A66C2",
        primaryTelegram: "#fff",
        primaryDarkTelegram: "#0889CC",
        // Brand colors for social network icons (Story 14.12)
        brand: {
          linkedin: "#0A66C2",
          github: "#24292f",
          twitter: "#1DA1F2",
          dribbble: "#EA4C89",
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
      // LEGACY BREAKPOINTS (max-width) - @deprecated
      // DO NOT USE FOR NEW CODE. These are inverted from Tailwind defaults.
      // Use semantic min-width breakpoints below instead.
      // Kept for backward compatibility - migrate when refactoring components.
      // See ADR-002 for breakpoint standardization decision.
      // =============================================================
      /** @deprecated Use semantic breakpoints instead (phablet:, mobile:, tablet:, etc.) */
      "2xl": { max: "1535px" }, // @deprecated => @media (max-width: 1535px) { ... }
      /** @deprecated Use semantic breakpoints instead */
      xl: { max: "1279px" }, // @deprecated => @media (max-width: 1279px) { ... }
      /** @deprecated Use semantic breakpoints instead */
      lg: { max: "1023px" }, // @deprecated => @media (max-width: 1023px) { ... }
      /** @deprecated Use semantic breakpoints instead */
      md: { max: "767px" }, // @deprecated => @media (max-width: 767px) { ... }
      /** @deprecated Use semantic breakpoints instead */
      sm: { max: "639px" }, // @deprecated => @media (max-width: 639px) { ... }
      /** @deprecated Use semantic breakpoints instead */
      xs: { max: "479px" }, // @deprecated => @media (max-width: 479px) { ... }

      // =============================================================
      // SEMANTIC BREAKPOINTS (min-width) - USE FOR NEW CODE
      // Standard Tailwind mobile-first approach. See docs/layout-system.md
      // Epic 11: Responsive Header & Navigation System
      // Story 14.15: Added phablet/mobile for progressive typography scaling
      // =============================================================
      // Mobile-first: base styles (no prefix) apply to 0-399px
      // Then breakpoints cascade upward with min-width
      phablet: "400px", // => @media (min-width: 400px) { ... } Phablet: 400-479px (small→normal phone)
      mobile: "480px", // => @media (min-width: 480px) { ... } Large Mobile: 480-639px (normal→large phone)
      tablet: "640px", // => @media (min-width: 640px) { ... } Tablet: 640-799px
      // Story 12.1: nav: breakpoint where hamburger disappears and full nav appears
      // Chosen based on content analysis: nav items + logo + theme button fit at this width
      // ⚠️ COUPLED: If changed, also update NAV_BREAKPOINT in MenuFloatingClient/index.jsx
      nav: "800px", // => @media (min-width: 800px) { ... } Nav: 800-1024px (burger→nav transition)
      stage: "960px", // => @media (min-width: 960px) { ... } Stage: hero layout swap
      desktop: "1025px", // => @media (min-width: 1025px) { ... } Desktop: 1025-1440px
      wide: "1441px", // => @media (min-width: 1441px) { ... } Wide: ≥1441px
    },
  },
  plugins: [],
};
