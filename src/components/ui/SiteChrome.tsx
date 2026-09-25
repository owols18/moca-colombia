import Image from "next/image";

import { ButtonLink } from "./Button";
import styles from "./SiteChrome.module.css";

export function SiteHeaderPreview() {
  return (
    <header className={styles.header}>
      <button aria-label="Open navigation" className={styles.menu} type="button">
        <span />
        <span />
        <span />
      </button>
      <Image
        alt="Moca Colombia"
        height={102}
        loading="eager"
        src="/brand/moca-colombia-logo.svg"
        width={264}
      />
      <div className={styles.language} aria-label="Language preview">
        <span aria-current="page">EN</span>
        <span>ES</span>
      </div>
    </header>
  );
}

export function SiteFooterPreview() {
  return (
    <footer className={styles.footer}>
      <Image alt="Moca Colombia" height={102} src="/brand/moca-colombia-logo.svg" width={264} />
      <p>© 2026 Moca Colombia. All rights reserved.</p>
    </footer>
  );
}

export function CtaPreview() {
  return (
    <section className={styles.cta}>
      <div>
        <h2>Change a life today</h2>
        <p>
          Support education, healthcare, sustainable livelihoods, and long-term
          community development.
        </p>
      </div>
      <div className={styles.actions}>
        <ButtonLink href="#buttons" size="small" variant="light">
          Donate now
        </ButtonLink>
        <ButtonLink href="#forms" size="small" variant="outlineLight">
          Volunteer with us
        </ButtonLink>
        <ButtonLink href="#surfaces" size="small" variant="outlineLight">
          Let&apos;s partner
        </ButtonLink>
      </div>
    </section>
  );
}
