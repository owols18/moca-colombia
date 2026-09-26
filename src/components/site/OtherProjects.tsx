"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { OtherProjectsContent } from "@/lib/content";
import { localizedHref, type Locale } from "@/lib/i18n";

import styles from "./OtherProjects.module.css";

type OtherProjectsProps = {
  content: OtherProjectsContent;
  locale: Locale;
};

export function OtherProjects({ content, locale }: OtherProjectsProps) {
  const [activeIndex, setActiveIndex] = useState(Math.min(1, content.items.length - 1));
  const itemCount = content.items.length;
  const orderedItems = content.items.map(
    (_, offset) => content.items[(activeIndex - 1 + offset + itemCount) % itemCount],
  );

  function move(direction: -1 | 1) {
    setActiveIndex((current) => (current + direction + itemCount) % itemCount);
  }

  return (
    <section aria-labelledby="other-projects-title" className={styles.section}>
      <div className={styles.inner}>
        <div aria-hidden="true" className={styles.divider} />
        <h2 id="other-projects-title">{content.title}</h2>
        <div aria-live="polite" className={styles.track}>
          {orderedItems.map((project, position) => (
            <Link
              className={clsx(styles.card, position === 1 && styles.activeCard)}
              href={localizedHref(locale, project.href)}
              key={project.href}
            >
              <span className={styles.media}>
                <Image
                  alt={project.alt}
                  fill
                  sizes="(max-width: 700px) 82vw, (max-width: 1200px) 29vw, 31rem"
                  src={project.image}
                />
              </span>
              <span className={styles.cardTitle}>{project.title}</span>
            </Link>
          ))}
        </div>
        <div className={styles.controls}>
          <button aria-label={content.previousLabel} onClick={() => move(-1)} type="button">
            <span aria-hidden="true">&#8592;</span>
          </button>
          <button aria-label={content.nextLabel} onClick={() => move(1)} type="button">
            <span aria-hidden="true">&#8594;</span>
          </button>
        </div>
      </div>
    </section>
  );
}
