import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getHome } from "@/lib/content";
import { hasLocale, localizedHref } from "@/lib/i18n";

import styles from "./page.module.css";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(locale)) {
    return {};
  }

  const content = getHome(locale);
  return {
    title: content.seo.title,
    description: content.seo.description,
    robots: { index: false, follow: false },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  if (!hasLocale(locale)) {
    notFound();
  }

  const content = getHome(locale);
  const missionLabel = locale === "es" ? "Ver Nuestra misión" : "View Our Mission";

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.content}>
          <p>{content.hero.eyebrow}</p>
          <h1>{content.hero.title}</h1>
          <span>{content.notice}</span>
          <Link href={localizedHref(locale, "/our-mission")}>{missionLabel}</Link>
        </div>
      </section>
    </main>
  );
}
