"use client";

import type { Locale } from "@/lib/i18n";
import styles from "./DonateSticker.module.css";

// Rounded scallops drawn as a vector, crisp at every screen size.
const points = Array.from({ length: 24 }, (_, i) => {
  const angle = i * Math.PI / 12 - Math.PI / 2;
  const radius = i % 2 === 0 ? 49 : 42;
  return { x: 50 + Math.cos(angle) * radius, y: 50 + Math.sin(angle) * radius };
});
const midpoint = (a: typeof points[number], b: typeof points[number]) =>
  `${(a.x + b.x) / 2} ${(a.y + b.y) / 2}`;
const outline = `M ${midpoint(points[23], points[0])} ${points.map((point, i) =>
  `Q ${point.x} ${point.y} ${midpoint(point, points[(i + 1) % points.length])}`).join(" ")} Z`;

export function DonateSticker({ locale }: { locale: Locale }) {
  const words = locale === "es" ? ["Dona", "ahora"] : ["Donate", "now"];
  return (
    <a
      href="#"
      className={styles.sticker}
      aria-label={words.join(" ")}
      title={words.join(" ")}
      onClick={event => event.preventDefault()}
    >
      <svg className={styles.shape} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
        <path d={outline} fill="var(--color-gold)" stroke="var(--color-ivory)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className={styles.label} aria-hidden="true">
        {words.map(word => <span key={word}>{word}</span>)}
      </span>
    </a>
  );
}
