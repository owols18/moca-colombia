import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { SharedCta } from "@/components/site/SharedCta";
import { getAboutUs } from "@/lib/content";
import { hasLocale } from "@/lib/i18n";

import { BoardOfDirectors } from "./BoardOfDirectors";
import styles from "./page.module.css";

type AboutUsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: AboutUsPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(locale)) {
    return {};
  }

  const content = getAboutUs(locale);

  return {
    title: content.seo.title,
    description: content.seo.description,
    alternates: {
      languages: {
        en: "/en/about-us",
        es: "/es/about-us",
      },
    },
  };
}

export default async function AboutUsPage({ params }: AboutUsPageProps) {
  const { locale } = await params;

  if (!hasLocale(locale)) {
    notFound();
  }

  const content = getAboutUs(locale);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Image
          alt={content.hero.alt}
          className={styles.heroImage}
          fill
          preload
          sizes="100vw"
          src={content.hero.image}
        />
        <div aria-hidden="true" className={styles.heroScrim} />
        <div className={styles.heroInner}>
          <p>{content.hero.statement}</p>
          <h1>{content.hero.title}</h1>
        </div>
      </section>

      <section className={styles.beliefSection} id={content.belief.id}>
        <div className={styles.beliefCard}>
          <h2>{content.belief.title}</h2>
          <div className={styles.beliefCopy}>
            {content.belief.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p className={styles.pillarsIntro}>{content.belief.intro}</p>
            <ol className={styles.pillars}>
              {content.belief.pillars.map((pillar) => (
                <li key={pillar.title}>
                  <strong>{pillar.title}:</strong> {pillar.body}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <BoardOfDirectors content={content.board} />

      <div className={styles.ctaWrap}>
        <SharedCta content={content.cta} locale={locale} />
      </div>
    </main>
  );
}
