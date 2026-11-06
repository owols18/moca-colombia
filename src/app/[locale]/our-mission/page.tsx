import clsx from "clsx";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { SharedCta } from "@/components/site/SharedCta";
import { getOurMission } from "@/lib/content";
import { hasLocale } from "@/lib/i18n";
import missionHero from "../../../../public/images/our-mission/hero.jpg";

import styles from "./page.module.css";

type OurMissionPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: OurMissionPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(locale)) {
    return {};
  }

  const content = getOurMission(locale);
  return {
    title: content.seo.title,
    description: content.seo.description,
    alternates: {
      languages: {
        en: "/en/our-mission",
        es: "/es/our-mission",
      },
    },
  };
}

export default async function OurMissionPage({ params }: OurMissionPageProps) {
  const { locale } = await params;

  if (!hasLocale(locale)) {
    notFound();
  }

  const content = getOurMission(locale);

  return (
    <main>
      <section className={styles.hero}>
        <Image
          alt={content.hero.alt}
          className={styles.heroImage}
          fill
          preload
          sizes="100vw"
          src={content.hero.image === "/images/our-mission/hero.jpg" ? missionHero : content.hero.image}
        />
        <div className={styles.heroScrim} />
        <div className={styles.heroInner}>
          <h1>{content.hero.title}</h1>
        </div>
      </section>

      {content.sections.map((section) =>
        section.layout === "image-overlay" ? (
          <section className={styles.vision} id={section.id} key={section.id}>
            <Image
              alt={section.alt}
              className={styles.visionImage}
              fill
              sizes="100vw"
              src={section.image}
            />
            <div className={styles.visionScrim} />
            <div className={styles.visionContent}>
              <h2>{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ) : (
          <section
            className={clsx(styles.section, section.theme === "sand" && styles.sandSection)}
            id={section.id}
            key={section.id}
          >
            <div
              className={clsx(
                styles.split,
                section.layout === "media-copy" && styles.mediaFirst,
                section.theme === "sand" && styles.sandCard,
              )}
            >
              <div className={styles.copy}>
                <h2>{section.title}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className={styles.media}>
                <Image
                  alt={section.alt}
                  fill
                  sizes="(max-width: 800px) 100vw, 44vw"
                  src={section.image}
                />
              </div>
            </div>
          </section>
        ),
      )}

      <SharedCta content={content.cta} locale={locale} />
    </main>
  );
}
