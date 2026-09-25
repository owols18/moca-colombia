import clsx from "clsx";
import type { ReactNode } from "react";

import styles from "./SectionHeading.module.css";

type SectionHeadingProps = {
  align?: "left" | "center";
  children: ReactNode;
  className?: string;
  eyebrow?: string;
  inverted?: boolean;
};

export function SectionHeading({
  align = "left",
  children,
  className,
  eyebrow,
  inverted = false,
}: SectionHeadingProps) {
  return (
    <header
      className={clsx(
        styles.heading,
        styles[align],
        inverted && styles.inverted,
        className,
      )}
    >
      {eyebrow ? <p>{eyebrow}</p> : null}
      <h2>{children}</h2>
    </header>
  );
}
