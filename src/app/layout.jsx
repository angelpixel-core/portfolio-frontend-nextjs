import { Montserrat } from "next/font/google";

import "./globals.css";

import NavBar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import ChildrenComponent from "@/components/ui/children-component";
import Script from "next/script";

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
        <Script id="theme-switcher" strategy="beforeInteractive">
          {`
            if (
              localStorage.theme === "dark" ||
              (!("theme" in localStorage) &&
              window.matchMedia("(prefers-color-scheme: dark)").matches)
            ) {
              document.documentElement.classList.add("dark")
            } else {
              document.documentElement.classList.remove("dark")
            }
          `}
        </Script>

        <div
          className={`
            ${montserrat.variable} font-mont bg-light dark:bg-dark w-full
            min-h-screen
          `}
        >
          <NavBar />

          <ChildrenComponent>{children}</ChildrenComponent>

          <Footer />
        </div>
      </body>
    </html>
  );
}
