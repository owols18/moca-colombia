import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { SharedCta } from "@/components/site/SharedCta";
import { ButtonLink } from "@/components/ui/Button";
import { getGetInvolved } from "@/lib/content";
import { hasLocale, localizedHref } from "@/lib/i18n";

import styles from "./page.module.css";

type GetInvolvedPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: GetInvolvedPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(locale)) {
    return {};
  }

  const content = getGetInvolved(locale);

  return {
    title: content.seo.title,
    description: content.seo.description,
    alternates: {
      languages: {
        en: "/en/get-involved",
        es: "/es/get-involved",
      },
    },
  };
}

export default async function GetInvolvedPage({ params }: GetInvolvedPageProps) {
  const { locale } = await params;

  if (!hasLocale(locale)) {
    notFound();
  }

  const content = getGetInvolved(locale);
  const { donate, volunteer, partner } = content.sections;

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

      <section className={styles.donateSection} id={donate.id}>
        <div className={styles.donateBand}>
          <div className={styles.donateInner}>
            <div className={styles.donateCopy}>
              <h2>{donate.title}</h2>
              <p>{donate.body}</p>
              <ButtonLink
                href={localizedHref(locale, donate.action.href)}
                size="small"
                variant="primary"
              >
                {donate.action.label}
              </ButtonLink>
            </div>
            <div className={styles.donateMedia}>
              <Image
                alt={donate.alt}
                fill
                loading="eager"
                sizes="(max-width: 900px) 36rem, (max-width: 2000px) 42.55vw, 51.0625rem"
                src={donate.image}
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.actionPanel} ${styles.volunteer}`} id={volunteer.id}>
        <Image
          alt={volunteer.alt}
          className={styles.panelImage}
          fill
          loading="eager"
          sizes="100vw"
          src={volunteer.image}
          unoptimized
        />
        <div aria-hidden="true" className={styles.panelScrim} />
        <div className={styles.panelInner}>
          <div className={styles.panelCopy}>
            <h2>{volunteer.title}</h2>
            <p>{volunteer.body}</p>
            <ButtonLink
              href={localizedHref(locale, volunteer.action.href)}
              size="small"
              variant="light"
            >
              {volunteer.action.label}
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className={`${styles.actionPanel} ${styles.partner}`} id={partner.id}>
        <Image
          alt={partner.alt}
          className={styles.panelImage}
          fill
          loading="eager"
          sizes="100vw"
          src={partner.image}
          unoptimized
        />
        <div aria-hidden="true" className={styles.panelScrim} />
        <div className={styles.panelInner}>
          <div className={styles.panelCopy}>
            <h2>{partner.title}</h2>
            <p>{partner.body}</p>
            <ButtonLink
              href={localizedHref(locale, partner.action.href)}
              size="small"
              variant="light"
            >
              {partner.action.label}
            </ButtonLink>
          </div>
        </div>
      </section>

      <div className={styles.ctaWrap}>
        <SharedCta content={content.cta} locale={locale} />
      </div>
    </main>
  );
}
