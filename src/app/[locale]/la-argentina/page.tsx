import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { SharedCta } from "@/components/site/SharedCta";
import { getLaArgentina } from "@/lib/content";
import { hasLocale } from "@/lib/i18n";

import styles from "./page.module.css";

type LaArgentinaPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: LaArgentinaPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(locale)) {
    return {};
  }

  const content = getLaArgentina(locale);

  return {
    title: content.seo.title,
    description: content.seo.description,
    alternates: {
      languages: {
        en: "/en/la-argentina",
        es: "/es/la-argentina",
      },
    },
  };
}

export default async function LaArgentinaPage({ params }: LaArgentinaPageProps) {
  const { locale } = await params;

  if (!hasLocale(locale)) {
    notFound();
  }

  const content = getLaArgentina(locale);
  const { communityContext, location, whyItMatters } = content.sections;

  return (
    <main>
      <div className={styles.narrative}>
        <Image
          alt={content.hero.alt}
          className={styles.backgroundImage}
          fill
          preload
          sizes="100vw"
          src={content.hero.image}
        />
        <div aria-hidden="true" className={styles.backgroundScrim} />

        <section className={styles.hero}>
          <p className={styles.heroStatement}>
            {content.hero.intro}
            <span>
              {content.hero.statement} <strong>{content.hero.emphasis}</strong>
            </span>
          </p>
          <div className={styles.heroInner}>
            <h1>{content.hero.title}</h1>
          </div>
        </section>

        <section className={styles.context} id={communityContext.id}>
          <div className={styles.contextBand}>
            <div className={styles.contextInner}>
              <div className={styles.contextCopy}>
                <h2>{communityContext.title}</h2>
                {communityContext.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className={styles.communityMedia}>
                <Image
                  alt={communityContext.alt}
                  fill
                  sizes="(max-width: 800px) 88vw, (max-width: 1600px) 44vw, 50rem"
                  src={communityContext.image}
                />
              </div>
            </div>
          </div>
        </section>

        <section className={styles.location} id={location.id}>
          <div aria-hidden="true" className={styles.cocoaMark}>
            <Image alt="" height={398} src="/brand/icon-cocoa.svg" width={427} />
          </div>
          <div className={styles.locationCopy}>
            <h2>{location.title}</h2>
            {location.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className={styles.why} id={whyItMatters.id}>
          <div className={styles.whyCopy}>
            <h2>{whyItMatters.title}</h2>
            {whyItMatters.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      </div>

      <SharedCta content={content.cta} locale={locale} />
    </main>
  );
}
