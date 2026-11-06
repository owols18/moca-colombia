"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties, MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";

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

function MenuLetters({ text, row = 0 }: { text: string; row?: number }) {
  let index = 0;
  return <span aria-hidden="true">{text.split(" ").map((word, wordIndex) => (
    <span key={wordIndex}>
      {wordIndex > 0 ? " " : null}
      <span className={styles.word}>{Array.from(word).map((letter) => {
        const letterIndex = index++;
        return <span className={styles.letter} key={letterIndex}
          style={{ "--letter-delay": `${row * 80 + letterIndex * 25}ms` } as CSSProperties}>{letter}</span>;
      })}</span>
    </span>
  ))}</span>;
}

export function SiteHeader({ locale, navigation }: SiteHeaderProps) {
  const pathname = usePathname();
  const isAnimatedHome = /^\/(en|es)\/?$/.test(pathname);
  const [isOpen, setIsOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
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
        setProjectsOpen(false);
        menuButtonRef.current?.focus();
      }
      if (event.key === "Tab") {
        const controls = [headerRef.current, overlayRef.current].flatMap(root =>
          Array.from(root?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [])
            .filter(element => element.getClientRects().length > 0 && !element.closest("[hidden]")));
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
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

  const closeMenu = () => {
    setIsOpen(false);
    setProjectsOpen(false);
  };

  return (
    <>
      <header ref={headerRef} className={styles.header} data-home={isAnimatedHome || undefined} data-menu-open={isOpen || undefined}>
        <button
          ref={menuButtonRef}
          aria-controls="site-navigation"
          aria-expanded={isOpen}
          aria-label={isOpen ? navigation.menuClose : navigation.menuOpen}
          className={styles.menuButton}
          onClick={() => { setProjectsOpen(false); setIsOpen((current) => !current); }}
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

      <div ref={overlayRef} className={styles.overlay} data-open={isOpen || undefined} inert={!isOpen}>
        <nav aria-label={locale === "es" ? "Navegación principal" : "Main navigation"} className={styles.navigation} id="site-navigation">
          {[navigation.items.slice(0, 4), navigation.items.slice(4)].map((column, columnIndex) => <ul key={columnIndex}>
            {column.map((item, row) => (
              <li className={styles.navigationItem} key={item.id}>
                {item.href ? (
                  <Link href={localizedHref(locale, item.href)} onClick={closeMenu} aria-label={item.label}>
                    <MenuLetters text={item.label} row={row} />
                  </Link>
                ) : (
                  <>
                    <button type="button" className={styles.groupLabel}
                      aria-label={item.label} aria-expanded={projectsOpen} aria-controls="navigation-projects"
                      onClick={() => setProjectsOpen(open => !open)}>
                      <MenuLetters text={item.label} row={row} />
                      <svg className={styles.chevron} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <ul id="navigation-projects" className={styles.projectLinks} hidden={!projectsOpen}>
                      {item.children?.map((child, index) => (
                        <li key={child.href}>
                          <Link href={localizedHref(locale, child.href)} onClick={closeMenu} aria-label={child.label}>
                            <MenuLetters text={child.label} row={index} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </li>
            ))}
          </ul>)}
        </nav>
      </div>
    </>
  );
}
