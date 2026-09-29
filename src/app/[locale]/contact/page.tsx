import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { SharedCta } from "@/components/site/SharedCta";
import { getContact } from "@/lib/content";
import { hasLocale } from "@/lib/i18n";

import { ContactForm } from "./ContactForm";
import styles from "./page.module.css";

type ContactPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ interest?: string | string[] }>;
};

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(locale)) {
    return {};
  }

  const content = getContact(locale);

  return {
    title: content.seo.title,
    description: content.seo.description,
    alternates: {
      languages: {
        en: "/en/contact",
        es: "/es/contact",
      },
    },
  };
}

export default async function ContactPage({ params, searchParams }: ContactPageProps) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);

  if (!hasLocale(locale)) {
    notFound();
  }

  const content = getContact(locale);
  const requestedInterest = Array.isArray(query.interest) ? query.interest[0] : query.interest;
  const initialInterest =
    content.form.interestOptions.find((option) => option.value === requestedInterest)?.value ??
    "general";

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

      <section className={styles.contactSection}>
        <Image
          alt={content.intro.alt}
          className={styles.contactImage}
          fill
          loading="eager"
          sizes="100vw"
          src={content.intro.image}
          unoptimized
        />
        <div aria-hidden="true" className={styles.contactScrim} />
        <div className={styles.contactInner}>
          <div className={styles.introCopy}>
            <h2>{content.intro.title}</h2>
            {content.intro.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className={styles.formPanel}>
            <ContactForm
              content={content.form}
              initialInterest={initialInterest}
              locale={locale}
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
