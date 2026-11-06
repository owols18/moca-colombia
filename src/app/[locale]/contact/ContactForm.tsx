"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import type { ContactContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

import styles from "./page.module.css";

type ContactFormProps = {
  content: ContactContent["form"];
  initialInterest: string;
  locale: Locale;
};

type SubmitState = "idle" | "submitting" | "success" | "error" | "configuration";

const phoneCodes = ["+1", "+57", "+34", "+44"];

export function ContactForm({ content, initialInterest, locale }: ContactFormProps) {
  const reviewOnly = process.env.NEXT_PUBLIC_REVIEW_ONLY === "true";
  const [interest, setInterest] = useState(initialInterest);
  const [phoneCode, setPhoneCode] = useState("+1");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (reviewOnly) return;
    const form = event.currentTarget;
    const formData = new FormData(form);

    setSubmitState("submitting");

    try {
      const response = await fetch("/api/contact", {
        body: JSON.stringify({
          email: formData.get("email"),
          interest: formData.get("interest"),
          locale,
          message: formData.get("message"),
          name: formData.get("name"),
          phone: `${formData.get("phoneCode")} ${formData.get("phone")}`,
          website: formData.get("website"),
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      const result = (await response.json()) as { code?: string; ok?: boolean };

      if (!response.ok || !result.ok) {
        setSubmitState(result.code === "MAIL_NOT_CONFIGURED" ? "configuration" : "error");
        return;
      }

      form.reset();
      setInterest(initialInterest);
      setPhoneCode("+1");
      setSubmitState("success");
    } catch {
      setSubmitState("error");
    }
  }

  const statusMessage =
    submitState === "success"
      ? content.successMessage
      : submitState === "configuration"
        ? content.configurationMessage
        : submitState === "error"
          ? content.errorMessage
          : null;

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="contact-name">{content.labels.name}</label>
        <input
          autoComplete="name"
          id="contact-name"
          maxLength={120}
          minLength={2}
          name="name"
          required
          type="text"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-phone">{content.labels.phone}</label>
        <div className={styles.phoneField}>
          <select
            aria-label={content.labels.phone}
            name="phoneCode"
            onChange={(event) => setPhoneCode(event.target.value)}
            value={phoneCode}
          >
            {phoneCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
          <input
            autoComplete="tel-national"
            id="contact-phone"
            inputMode="tel"
            maxLength={30}
            minLength={6}
            name="phone"
            required
            type="tel"
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-email">{content.labels.email}</label>
        <input
          autoComplete="email"
          id="contact-email"
          maxLength={254}
          name="email"
          required
          type="email"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-interest">{content.labels.interest}</label>
        <select
          id="contact-interest"
          name="interest"
          onChange={(event) => setInterest(event.target.value)}
          required
          value={interest}
        >
          {content.interestOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-message">{content.labels.message}</label>
        <textarea
          id="contact-message"
          maxLength={3000}
          minLength={10}
          name="message"
          required
          rows={5}
        />
      </div>

      <div aria-hidden="true" className={styles.honeypot}>
        <label htmlFor="contact-website">Website</label>
        <input autoComplete="off" id="contact-website" name="website" tabIndex={-1} type="text" />
      </div>

      <p className={styles.privacyNotice}>{reviewOnly
        ? (locale === "es" ? "Versión de revisión: el envío de mensajes está desactivado." : "Review version: message sending is disabled.")
        : content.privacyNotice}</p>

      <div className={styles.formFooter}>
        <div aria-live="polite" className={styles.formStatus} role="status">
          {statusMessage}
        </div>
        <Button disabled={reviewOnly || submitState === "submitting"} size="small" type="submit" variant="light">
          {submitState === "submitting" ? content.submittingLabel : content.submitLabel}
        </Button>
      </div>
    </form>
  );
}
