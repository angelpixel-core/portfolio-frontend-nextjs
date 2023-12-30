import "@/css/globals.css";
import "@/css/styles.css";

import { loadThemeSwitcher } from "@/atoms/buttons/theme-switcher-button";

import { Montserrat } from "next/font/google";
import Script from "next/script";
import NavBar from "@/organisms/layout/navbar";
import AnimatedChildren from "@/molecules/layout/animated-children";
import Footer from "@/organisms/layout/footer";

export const metadata = {
  title: {
    template: "%s | Portfolio",
    default: "Portfolio",
  },
  description: "Angel Thunder's Portfolio - Web Developer",
  keywords:
    "Web Developer, Software Developer, Programming, Projects, OTHER_KEYWORDS",
  author: "AngelThunder",
};

export const viewport = {
  width: "device-width",
  initialScale: "1.0",
};

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-mont",
});

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Script id="theme-switcher" strategy="beforeInteractive">
          {loadThemeSwitcher}
        </Script>

        <div className={`layout ${montserrat.variable} font-mont`}>
          <NavBar />

          <AnimatedChildren>{children}</AnimatedChildren>

          <Footer />
        </div>
      </body>
    </html>
  );
}
