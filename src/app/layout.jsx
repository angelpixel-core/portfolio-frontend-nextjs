import "@/css/globals.css";

import { Montserrat } from "next/font/google";

import { Providers } from "@/store";

import { NavBar, Footer } from "@/organisms/layout";
import { AnimatedChildren } from "@/molecules";

// Query
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
        <Providers>
          <div className={`layout ${montserrat.variable} font-mont`}>
            <NavBar />

            <AnimatedChildren>{children}</AnimatedChildren>

            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
