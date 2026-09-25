import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getNavigation } from "@/lib/content";
import { hasLocale, locales } from "@/lib/i18n";

import { comfortaa, manrope } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "Moca Colombia",
    template: "%s | Moca Colombia",
  },
  description:
    "Moca Colombia supports education, healthcare, nutrition, and sustainable livelihoods.",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(locale)) {
    notFound();
  }

  const navigation = getNavigation(locale);

  return (
    <html lang={locale} className={`${comfortaa.variable} ${manrope.variable}`}>
      <body>
        <SiteHeader locale={locale} navigation={navigation} />
        {children}
        <SiteFooter locale={locale} navigation={navigation} />
      </body>
    </html>
  );
}
