import { Montserrat } from "next/font/google";

import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-mont",
});

export default function RootLayout({ children }) {
  return (
    <html>
      <body className={`${montserrat.variable} font-mont`}>{children}</body>
    </html>
  );
}
