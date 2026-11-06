import clsx from "clsx";
import { publicHref } from "@/lib/publicHref";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "light" | "outlineLight";
export type ButtonSize = "small" | "medium" | "large";

type SharedProps = {
  children: ReactNode;
  className?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

export function Button({
  children,
  className,
  size = "medium",
  type = "button",
  variant = "primary",
  ...props
}: SharedProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(styles.button, styles[variant], styles[size], className)}
      type={type}
      {...props}
    >
      <span>{children}</span>
    </button>
  );
}

export function ButtonLink({
  children,
  className,
  size = "medium",
  variant = "primary",
  ...props
}: SharedProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={clsx(styles.button, styles[variant], styles[size], className)} {...props} href={publicHref(props.href)}>
      <span>{children}</span>
    </a>
  );
}
