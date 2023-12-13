import { Montserrat } from "next/font/google";

import "./globals.css";

import NavBar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-mont",
});

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

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <div
          className={`
            ${montserrat.variable} font-mont bg-light dark:bg-dark w-full
            min-h-screen
          `}
        >
          <NavBar />

          {children}

          <Footer />
        </div>
      </body>
    </html>
  );
}
