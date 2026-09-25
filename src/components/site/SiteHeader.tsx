"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
import { useEffect, useState } from "react";

import type { NavigationContent } from "@/lib/content";
import {
  localizedHref,
  type Locale,
  replaceLocaleInPathname,
} from "@/lib/i18n";

import styles from "./SiteHeader.module.css";

type SiteHeaderProps = {
  locale: Locale;
  navigation: NavigationContent;
};

export function SiteHeader({ locale, navigation }: SiteHeaderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [pendingLanguage, setPendingLanguage] = useState<{
    locale: Locale;
    href: string;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!pendingLanguage) {
      return;
    }

    document.cookie = `moca_locale=${pendingLanguage.locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
    window.location.assign(pendingLanguage.href);
  }, [pendingLanguage]);

  const switchLanguage = (event: MouseEvent<HTMLAnchorElement>, nextLocale: Locale) => {
    event.preventDefault();
    setIsOpen(false);
    setPendingLanguage({
      locale: nextLocale,
      href: replaceLocaleInPathname(pathname, nextLocale),
    });
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <header className={styles.header} data-menu-open={isOpen || undefined}>
        <button
          aria-controls="site-navigation"
          aria-expanded={isOpen}
          aria-label={isOpen ? navigation.menuClose : navigation.menuOpen}
          className={styles.menuButton}
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          <span />
          <span />
          <span />
        </button>

        <div aria-label={navigation.languageLabel} className={styles.languages}>
          {(["en", "es"] as const).map((language) => (
            <Link
              aria-current={language === locale ? "page" : undefined}
              href={replaceLocaleInPathname(pathname, language)}
              key={language}
              onClick={(event) => switchLanguage(event, language)}
              prefetch={false}
            >
              {language.toUpperCase()}
            </Link>
          ))}
        </div>

        <Link
          aria-label="Moca Colombia"
          className={styles.logo}
          href={localizedHref(locale, "/")}
          onClick={closeMenu}
        >
          <Image
            alt="Moca Colombia"
            height={102}
            loading="eager"
            src="/brand/moca-colombia-logo.svg"
            width={264}
          />
        </Link>
      </header>

      <div className={styles.overlay} data-open={isOpen || undefined}>
        <nav aria-label="Primary" className={styles.navigation} id="site-navigation">
          <ul>
            {navigation.items.map((item) => (
              <li className={styles.navigationItem} key={item.id}>
                {item.href ? (
                  <Link href={localizedHref(locale, item.href)} onClick={closeMenu}>
                    {item.label}
                  </Link>
                ) : (
                  <>
                    <span className={styles.groupLabel}>{item.label}</span>
                    <ul className={styles.projectLinks}>
                      {item.children?.map((child) => (
                        <li key={child.href}>
                          <Link href={localizedHref(locale, child.href)} onClick={closeMenu}>
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
