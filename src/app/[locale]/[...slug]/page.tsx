import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { getDonate } from "@/lib/content";
import { hasLocale, locales, plannedPagePaths } from "@/lib/i18n";

import { DonationForm } from "@/components/donate/DonationForm";
import styles from "@/components/donate/donate.module.css";

type DonateProps = { params: Promise<{ locale: string; slug: string[] }> };

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    plannedPagePaths.map((path) => ({ locale, slug: path.split("/") })),
  );
}

export async function generateMetadata({ params }: DonateProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(locale) || slug.join("/") !== "donate") return {};

  return {
    ...getDonate(locale).seo,
    alternates: { languages: { en: "/en/donate", es: "/es/donate" } },
  };
}

export default async function DonatePage({ params }: DonateProps) {
  const { locale, slug } = await params;
  if (!hasLocale(locale) || slug.join("/") !== "donate") notFound();

  const { hero, donation } = getDonate(locale);
  return (
    <main>
      <section aria-labelledby="donate-title" className={styles.hero}>
        <Image alt="" className={styles.heroImage} fill preload sizes="100vw" src={hero.image} />
        <div className={styles.heroInner}>
          <h1 id="donate-title">{hero.title}</h1>
          <p>{hero.statement}</p>
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.copy}>
          <SectionHeading>{donation.title}</SectionHeading>
          <p>{donation.notice}</p>
        </div>
        <DonationForm content={donation.form} locale={locale} />
      </section>
    </main>
  );
}
