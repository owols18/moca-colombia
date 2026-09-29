import Image from "next/image";

import { ButtonLink } from "@/components/ui/Button";
import type { SharedCtaContent } from "@/lib/content";
import { localizedHref, type Locale } from "@/lib/i18n";

import styles from "./SharedCta.module.css";

type SharedCtaProps = {
  content: SharedCtaContent;
  locale: Locale;
};

export function SharedCta({ content, locale }: SharedCtaProps) {
  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <Image
          alt=""
          className={styles.image}
          fill
          sizes="(max-width: 768px) 100vw, 92vw"
          src={content.image}
        />
        <div className={styles.scrim} />
        <div className={styles.content}>
          <div>
            {content.title ? <h2>{content.title}</h2> : null}
            <p className={styles.body}>{content.body}</p>
          </div>
          <div className={styles.actions}>
            {content.actions.map((action) => (
              <ButtonLink
                href={localizedHref(locale, action.href)}
                key={action.href}
                size="small"
                variant={action.variant}
              >
                {action.label}
              </ButtonLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
