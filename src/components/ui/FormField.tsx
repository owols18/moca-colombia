import clsx from "clsx";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

import styles from "./FormField.module.css";

type SharedProps = {
  error?: string;
  hint?: string;
  label: string;
};

export function TextField({
  className,
  error,
  hint,
  id,
  label,
  ...props
}: SharedProps & InputHTMLAttributes<HTMLInputElement>) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={clsx(styles.field, className)}>
      <label htmlFor={id}>{label}</label>
      <input
        aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
        aria-invalid={Boolean(error)}
        className={clsx(error && styles.invalid)}
        id={id}
        {...props}
      />
      {hint ? <span id={hintId}>{hint}</span> : null}
      {error ? (
        <span className={styles.error} id={errorId} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}

export function TextAreaField({
  className,
  error,
  hint,
  id,
  label,
  ...props
}: SharedProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={clsx(styles.field, className)}>
      <label htmlFor={id}>{label}</label>
      <textarea
        aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
        aria-invalid={Boolean(error)}
        className={clsx(error && styles.invalid)}
        id={id}
        {...props}
      />
      {hint ? <span id={hintId}>{hint}</span> : null}
      {error ? (
        <span className={styles.error} id={errorId} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
