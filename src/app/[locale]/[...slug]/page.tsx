import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPageStub } from "@/lib/content";
import {
  hasLocale,
  locales,
  plannedPagePaths,
  type PlannedPagePath,
} from "@/lib/i18n";

import styles from "./page.module.css";

type PlannedPageProps = {
  params: Promise<{ locale: string; slug: string[] }>;
};

function isPlannedPage(path: string): path is PlannedPagePath {
  return plannedPagePaths.includes(path as PlannedPagePath);
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    plannedPagePaths.map((path) => ({ locale, slug: path.split("/") })),
  );
}

export async function generateMetadata({ params }: PlannedPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const path = slug.join("/");

  if (!hasLocale(locale) || !isPlannedPage(path)) {
    return {};
  }

  const content = getPageStub(locale, path);
  return {
    title: content.seo.title,
    description: content.seo.description,
    robots: { index: false, follow: false },
  };
}

export default async function PlannedPage({ params }: PlannedPageProps) {
  const { locale, slug } = await params;
  const path = slug.join("/");

  if (!hasLocale(locale) || !isPlannedPage(path)) {
    notFound();
  }

  const content = getPageStub(locale, path);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.inner}>
          <p>{content.hero.eyebrow}</p>
          <h1>{content.hero.title}</h1>
        </div>
      </section>
      <section className={styles.status}>
        <div>
          <p className={styles.label}>{content.status}</p>
          <h2>{content.notice}</h2>
        </div>
      </section>
    </main>
  );
}
