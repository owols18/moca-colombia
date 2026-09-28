import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { OtherProjects } from "@/components/site/OtherProjects";
import { SharedCta } from "@/components/site/SharedCta";
import { getNutrition } from "@/lib/content";
import { hasLocale } from "@/lib/i18n";

import styles from "./page.module.css";

type NutritionPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: NutritionPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(locale)) {
    return {};
  }

  const content = getNutrition(locale);

  return {
    title: content.seo.title,
    description: content.seo.description,
    alternates: {
      languages: {
        en: "/en/projects/nutrition",
        es: "/es/projects/nutrition",
      },
    },
  };
}

export default async function NutritionPage({ params }: NutritionPageProps) {
  const { locale } = await params;

  if (!hasLocale(locale)) {
    notFound();
  }

  const content = getNutrition(locale);
  const { combatingMalnourishment, commitment } = content.sections;

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
        </div>
      </section>

      <section className={styles.combating} id={combatingMalnourishment.id}>
        <div className={styles.combatingCard}>
          <div className={styles.combatingCopy}>
            <h2>{combatingMalnourishment.title}</h2>
            {combatingMalnourishment.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className={styles.combatingMedia}>
            <Image
              alt={combatingMalnourishment.alt}
              fill
              sizes="(max-width: 900px) 100vw, (max-width: 2000px) 46vw, 51rem"
              src={combatingMalnourishment.image}
            />
          </div>
        </div>
      </section>

      <section className={styles.commitment} id={commitment.id}>
        <div className={styles.commitmentGrid}>
          <div className={styles.commitmentMedia}>
            <Image
              alt={commitment.alt}
              fill
              sizes="(max-width: 900px) 100vw, (max-width: 2000px) 44vw, 50rem"
              src={commitment.image}
            />
            <div aria-hidden="true" className={styles.commitmentScrim} />
            <h2>{commitment.title}</h2>
          </div>
          <div className={styles.commitmentCopy}>
            {commitment.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p>{commitment.commitmentsIntro}</p>
            <ul>
              {commitment.commitments.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <OtherProjects content={content.otherProjects} locale={locale} />

      <div className={styles.ctaWrap}>
        <SharedCta content={content.cta} locale={locale} />
      </div>
    </main>
  );
}
