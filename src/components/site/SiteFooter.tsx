import Image from "next/image";
import Link from "next/link";

import type { NavigationContent } from "@/lib/content";
import { localizedHref, type Locale } from "@/lib/i18n";

import styles from "./SiteFooter.module.css";

type SiteFooterProps = {
  locale: Locale;
  navigation: NavigationContent;
};

export function SiteFooter({ locale, navigation }: SiteFooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <Link aria-label="Moca Colombia" href={localizedHref(locale, "/")}>
          <Image
            alt="Moca Colombia"
            height={102}
            src="/brand/moca-colombia-logo.svg"
            width={264}
          />
        </Link>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} {navigation.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
