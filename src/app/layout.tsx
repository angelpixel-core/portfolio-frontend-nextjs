import React from "react";
import type { Metadata, Viewport } from "next";
import Script from "next/script";

import "@/styles/globals.css";
import "@/lib/suppressWarnings";
import { RootProvider } from "@/providers";

import { Montserrat, Orbitron, Noto_Serif } from "next/font/google";
import dynamic from "next/dynamic";

import NavBar from "@/organisms/NavBar";
import Auth from "@/organisms/Auth";
import HireFlow from "@/organisms/HireFlow";
import ResumeRequest from "@/organisms/ResumeRequest";
import AnimatedChildren from "@/molecules/AnimatedChildren";

// Lazy load below-the-fold components to reduce render-blocking CSS
// Lighthouse: Eliminate render-blocking resources
const Footer = dynamic(() => import("@/organisms/Footer"), {
  ssr: true,
});

const SITE_AUTHOR_NAME = process.env.NEXT_PUBLIC_AUTHOR_NAME;
const SITE_AUTHOR_ROLE = process.env.NEXT_PUBLIC_AUTHOR_ROLE;
const SITE_TITLE = `Portfolio | ${process.env.NEXT_PUBLIC_AUTHOR_NAME}`;
const SITE_DESCRIPTION = `${SITE_AUTHOR_NAME}'s Portfolio - ${SITE_AUTHOR_ROLE}`;
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
const keywords =
  process.env.NEXT_PUBLIC_SITE_KEYWORDS?.split(",")
    .map((item) => item.trim())
    .filter(Boolean) ?? [];

const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${SITE_AUTHOR_NAME} - ${SITE_AUTHOR_ROLE} Portfolio`,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
  title: {
    template: "%s | Portfolio",
    default: SITE_TITLE,
  },
  description: SITE_DESCRIPTION,
  keywords: keywords,
  authors: [{ name: process.env.NEXT_PUBLIC_AUTHOR_NAME }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: `${SITE_AUTHOR_NAME} Portfolio`,
    images: [OG_IMAGE],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-mont",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-noto-serif",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="en">
      <body>
        {RECAPTCHA_SITE_KEY ? (
          <Script
            src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
            strategy="afterInteractive"
          />
        ) : null}
        <RootProvider>
          <div
            className={`layout ${montserrat.variable} ${orbitron.variable} ${notoSerif.variable} font-mont`}
          >
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>

            <NavBar />

            <main
              id="main-content"
              className="cover-principal"
              tabIndex={-1}
              data-testid="layout-main-content"
            >
              <AnimatedChildren>{children}</AnimatedChildren>
            </main>

            <Footer />

            {/* Global Auth Modal */}
            <Auth />
            <HireFlow />
            <ResumeRequest />
          </div>
        </RootProvider>
      </body>
    </html>
  );
}
