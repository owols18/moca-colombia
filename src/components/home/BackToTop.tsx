"use client";

import type { Locale } from "@/lib/i18n";
import styles from "./BackToTop.module.css";

export function BackToTop({ locale }: { locale: Locale }) {
  const label = locale === "es" ? "Volver al inicio" : "Back to top";

  return (
    <button
      type="button"
      className={styles.button}
      aria-label={label}
      title={label}
      onClick={() => {
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        });
      }}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
