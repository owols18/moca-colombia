import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { OtherProjects } from "@/components/site/OtherProjects";
import { SharedCta } from "@/components/site/SharedCta";
import { getMocacao } from "@/lib/content";
import { hasLocale } from "@/lib/i18n";

import styles from "./page.module.css";

type MocacaoPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: MocacaoPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(locale)) {
    return {};
  }

  const content = getMocacao(locale);

  return {
    title: content.seo.title,
    description: content.seo.description,
    alternates: {
      languages: {
        en: "/en/projects/mocacao",
        es: "/es/projects/mocacao",
      },
    },
  };
}

export default async function MocacaoPage({ params }: MocacaoPageProps) {
  const { locale } = await params;

  if (!hasLocale(locale)) {
    notFound();
  }

  const content = getMocacao(locale);
  const { opportunity, whyCacao } = content.sections;

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

      <section className={styles.opportunity} id={opportunity.id}>
        <div className={styles.opportunityCard}>
          <div className={styles.opportunityCopy}>
            <h2>{opportunity.title}</h2>
            {opportunity.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className={styles.opportunityMedia}>
            <Image
              alt={opportunity.alt}
              fill
              sizes="(max-width: 800px) 100vw, (max-width: 2000px) 46vw, 55rem"
              src={opportunity.image}
            />
          </div>
        </div>
      </section>

      <section className={styles.why} id={whyCacao.id}>
        <div className={styles.whyGrid}>
          <div className={styles.whyMedia}>
            <Image
              alt={whyCacao.alt}
              fill
              sizes="(max-width: 800px) 100vw, (max-width: 2000px) 44vw, 50rem"
              src={whyCacao.image}
            />
            <div aria-hidden="true" className={styles.whyScrim} />
            <h2>{whyCacao.title}</h2>
          </div>
          <div className={styles.whyCopy}>
            {whyCacao.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p>{whyCacao.commitmentsIntro}</p>
            <ul>
              {whyCacao.commitments.map((commitment) => (
                <li key={commitment}>{commitment}</li>
              ))}
            </ul>
            <p className={styles.statistic}>{whyCacao.statistic}</p>
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
