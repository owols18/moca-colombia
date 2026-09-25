import type { Metadata } from "next";
import type { ReactNode } from "react";

import { comfortaa, manrope } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Moca Colombia",
    template: "%s | Moca Colombia",
  },
  description:
    "Moca Colombia supports education, healthcare, nutrition, and sustainable livelihoods.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${comfortaa.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
