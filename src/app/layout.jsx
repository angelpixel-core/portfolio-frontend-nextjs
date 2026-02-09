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

export const metadata = {
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
  title: {
    template: "%s | Portfolio",
    default: "Portfolio",
  },
  description: "Angel Thunder's Portfolio - Web Developer",
  keywords:
    "Web Developer, Software Developer, Programming, Projects, OTHER_KEYWORDS",
  author: "AngelThunder",
  alternates: {
    canonical: "/",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: "1.0",
};

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-mont",
  display: "swap",
});

export default function RootLayout({ children }) {
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
