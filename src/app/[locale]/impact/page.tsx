import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { SharedCta } from "@/components/site/SharedCta";
import { getImpact } from "@/lib/content";
import { hasLocale } from "@/lib/i18n";

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
  const { keyFigures, storiesOfChange } = content.sections;

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
          <h1>{content.hero.title}</h1>
          <p>{content.hero.statement}</p>
        </div>
      </section>

      <section className={styles.keyFigures} id={keyFigures.id}>
        <div className={styles.keyFiguresCard}>
          <div className={styles.keyFiguresMedia}>
            <Image
              alt={keyFigures.alt}
              fill
              sizes="(max-width: 900px) 86vw, (max-width: 2000px) 38vw, 43rem"
              src={keyFigures.image}
            />
          </div>
          <div className={styles.keyFiguresCopy}>
            <h2>{keyFigures.title}</h2>
            {keyFigures.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.stories} id={storiesOfChange.id}>
        <div className={styles.storiesCard}>
          <div className={styles.storiesCopy}>
            <h2>{storiesOfChange.title}</h2>
            {storiesOfChange.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className={styles.storiesMedia}>
            <Image
              alt={storiesOfChange.alt}
              fill
              sizes="(max-width: 900px) 100vw, (max-width: 2000px) 46vw, 51rem"
              src={storiesOfChange.image}
            />
          </div>
        </div>
      </section>

      <div className={styles.ctaWrap}>
        <SharedCta content={content.cta} locale={locale} />
      </div>
    </main>
  );
}
