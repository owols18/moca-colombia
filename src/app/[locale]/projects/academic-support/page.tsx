import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { OtherProjects } from "@/components/site/OtherProjects";
import { SharedCta } from "@/components/site/SharedCta";
import { getAcademicSupport } from "@/lib/content";
import { hasLocale } from "@/lib/i18n";

import styles from "./page.module.css";

type AcademicSupportPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: AcademicSupportPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(locale)) {
    return {};
  }

  const content = getAcademicSupport(locale);

  return {
    title: content.seo.title,
    description: content.seo.description,
    alternates: {
      languages: {
        en: "/en/projects/academic-support",
        es: "/es/projects/academic-support",
      },
    },
  };
}

export default async function AcademicSupportPage({ params }: AcademicSupportPageProps) {
  const { locale } = await params;

  if (!hasLocale(locale)) {
    notFound();
  }

  const content = getAcademicSupport(locale);
  const { culture, empoweringEducation } = content.sections;

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

      <section className={styles.empowering} id={empoweringEducation.id}>
        <div className={styles.empoweringCard}>
          <div className={styles.empoweringCopy}>
            <h2>{empoweringEducation.title}</h2>
            {empoweringEducation.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className={styles.empoweringMedia}>
            <Image
              alt={empoweringEducation.alt}
              fill
              sizes="(max-width: 900px) 100vw, (max-width: 2000px) 46vw, 51rem"
              src={empoweringEducation.image}
            />
          </div>
        </div>
      </section>

      <section className={styles.culture} id={culture.id}>
        <div className={styles.cultureGrid}>
          <div className={styles.cultureMedia}>
            <Image
              alt={culture.alt}
              fill
              sizes="(max-width: 900px) 100vw, (max-width: 2000px) 44vw, 50rem"
              src={culture.image}
            />
            <div aria-hidden="true" className={styles.cultureScrim} />
            <h2>{culture.title}</h2>
          </div>
          <div className={styles.cultureCopy}>
            {culture.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p>{culture.commitmentsIntro}</p>
            <ul>
              {culture.commitments.map((item) => (
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
