import React from "react";
import type { Metadata, Viewport } from "next";

import "@/styles/globals.css";
import "@/lib/suppressWarnings";
import { RootProvider } from "@/providers";

import { Montserrat } from "next/font/google";
import dynamic from "next/dynamic";

import NavBar from "@/organisms/NavBar";
import AnimatedChildren from "@/molecules/AnimatedChildren";

// Lazy load below-the-fold components to reduce render-blocking CSS
// Lighthouse: Eliminate render-blocking resources
const Footer = dynamic(() => import("@/organisms/Footer"), {
  ssr: true,
});
const Auth = dynamic(() => import("@/organisms/Auth"), {
  ssr: false, // Auth modal is client-only
});

const SITE_TITLE = "Portfolio | Angel Thunder";
const SITE_DESCRIPTION = "Angel Thunder's Portfolio - Web Developer";
const OG_IMAGE = {
  url: "/images/og-image.png",
  width: 1200,
  height: 630,
  alt: "Angel Thunder - Web Developer Portfolio",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
  title: {
    template: "%s | Portfolio",
    default: SITE_TITLE,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Web Developer",
    "Full Stack Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Portfolio",
    "Software Engineer",
    "Frontend Developer",
  ],
  authors: [{ name: "AngelThunder" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: "Angel Thunder Portfolio",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="en">
      <body>
        <RootProvider>
          <div className={`layout ${montserrat.variable} font-mont`}>
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
          </div>
        </RootProvider>
      </body>
    </html>
  );
}
