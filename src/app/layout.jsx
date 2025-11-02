import "@/styles/globals.css";
import { RootProvider } from "@/providers";

import { Montserrat } from "next/font/google";

import { NavBar, Footer } from "@/organisms";
import { AnimatedChildren } from "@/molecules";

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
        <RootProvider>
          <div className={`layout ${montserrat.variable} font-mont`}>
            <NavBar />

            <AnimatedChildren>{children}</AnimatedChildren>

            <Footer />
          </div>
        </RootProvider>
      </body>
    </html>
  );
}
