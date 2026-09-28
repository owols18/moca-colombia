import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { OtherProjects } from "@/components/site/OtherProjects";
import { SharedCta } from "@/components/site/SharedCta";
import { getMedicalCare } from "@/lib/content";
import { hasLocale } from "@/lib/i18n";

import styles from "./page.module.css";

type MedicalCarePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: MedicalCarePageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(locale)) {
    return {};
  }

  const content = getMedicalCare(locale);

  return {
    title: content.seo.title,
    description: content.seo.description,
    alternates: {
      languages: {
        en: "/en/projects/medical-care",
        es: "/es/projects/medical-care",
      },
    },
  };
}

export default async function MedicalCarePage({ params }: MedicalCarePageProps) {
  const { locale } = await params;

  if (!hasLocale(locale)) {
    notFound();
  }

  const content = getMedicalCare(locale);
  const { accessHealthcare, clinicNoel } = content.sections;

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

      <section className={styles.access} id={accessHealthcare.id}>
        <div className={styles.accessCard}>
          <div className={styles.accessCopy}>
            <h2>{accessHealthcare.title}</h2>
            {accessHealthcare.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className={styles.accessMedia}>
            <Image
              alt={accessHealthcare.alt}
              fill
              sizes="(max-width: 900px) 100vw, (max-width: 2000px) 46vw, 51rem"
              src={accessHealthcare.image}
            />
          </div>
        </div>
      </section>

      <section className={styles.clinic} id={clinicNoel.id}>
        <div className={styles.clinicGrid}>
          <div className={styles.clinicMedia}>
            <Image
              alt={clinicNoel.alt}
              fill
              sizes="(max-width: 900px) 100vw, (max-width: 2000px) 44vw, 50rem"
              src={clinicNoel.image}
            />
            <div aria-hidden="true" className={styles.clinicScrim} />
            <h2>{clinicNoel.title}</h2>
          </div>
          <div className={styles.clinicCopy}>
            {clinicNoel.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p>{clinicNoel.commitmentsIntro}</p>
            <ul>
              {clinicNoel.commitments.map((item) => (
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
