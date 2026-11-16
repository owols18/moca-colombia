import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import impactHero from "../../../../public/images/impact/hero.jpg";
import { SharedCta } from "@/components/site/SharedCta";
import { getImpact } from "@/lib/content";
import { hasLocale } from "@/lib/i18n";

import { ImpactStories } from "./ImpactStories";
import styles from "./page.module.css";

type ImpactPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ImpactPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(locale)) {
    return {};
  }

  const content = getImpact(locale);

  return {
    title: content.seo.title,
    description: content.seo.description,
    alternates: {
      languages: {
        en: "/en/impact",
        es: "/es/impact",
      },
    },
  };
}

export default async function ImpactPage({ params }: ImpactPageProps) {
  const { locale } = await params;

  if (!hasLocale(locale)) {
    notFound();
  }

  const content = getImpact(locale);
  const { storiesOfChange } = content.sections;

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Image
          alt={content.hero.alt}
          className={styles.heroImage}
          fill
          preload
          sizes="100vw"
          src={impactHero}
        />
        <div aria-hidden="true" className={styles.heroScrim} />
        <div className={styles.heroInner}>
          <h1>{content.hero.title}</h1>
          <p>{content.hero.statement}</p>
        </div>
      </section>

      <ImpactStories content={storiesOfChange} />

      <div className={styles.ctaWrap}>
        <SharedCta content={content.cta} locale={locale} />
      </div>
    </main>
  );
}
