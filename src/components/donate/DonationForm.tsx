"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { getDonate } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

import styles from "./donate.module.css";

const suggestedAmounts = [50, 100, 250, 500, 750, 1000];
const europeanCountries = new Set(
  "AD AL AT AX BA BE BG BY CH CY CZ DE DK EE ES FI FO FR GB GG GI GR HR HU IE IM IS IT JE LI LT LU LV MC MD ME MK MT NL NO PL PT RO RS RU SE SI SJ SK SM UA VA XK".split(" "),
);

type FormContent = ReturnType<typeof getDonate>["donation"]["form"];

export function DonationForm({ content, locale }: { content: FormContent; locale: Locale }) {
  const [currency, setCurrency] = useState<"USD" | "EUR" | null>(null);
  const [amount, setAmount] = useState("");
  const [preset, setPreset] = useState<number | null>(null);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;
    const timeout = window.setTimeout(() => controller.abort(), 3500);

    async function locate() {
      let detected: "USD" | "EUR" = "USD";
      try {
        const response = await fetch("https://api.country.is/", {
          signal: controller.signal,
          credentials: "omit",
          referrerPolicy: "no-referrer",
          cache: "no-store",
        });
        if (response.ok) {
          const { country } = await response.json();
          if (europeanCountries.has(country)) detected = "EUR";
        }
      } catch {
        // An unavailable country lookup uses the agreed default, USD.
      } finally {
        window.clearTimeout(timeout);
        if (mounted) setCurrency(detected);
      }
    }

    void locate();
    return () => {
      mounted = false;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  const format = new Intl.NumberFormat(locale);
  return (
    <form className={styles.panel} onSubmit={(event) => {
      event.preventDefault();
      setPreview(true);
    }}>
      <fieldset>
        <legend>{content.choose}</legend>
        <div className={styles.amounts}>
          {suggestedAmounts.map((value) => (
            <button aria-pressed={preset === value} key={value} type="button" onClick={() => {
              setPreset(value);
              setAmount(String(value));
              setPreview(false);
            }}>
              {format.format(value)} {currency}
            </button>
          ))}
        </div>
      </fieldset>
      <label htmlFor="donation-amount">{content.custom}</label>
      <div className={styles.inputWrap}>
        <input id="donation-amount" type="number" inputMode="decimal" min="5" max="1000000" step="0.01"
          placeholder={content.placeholder} value={amount} required aria-describedby="donation-currency"
          onChange={(event) => {
            setAmount(event.target.value);
            setPreset(null);
            setPreview(false);
          }}
        />
        <span id="donation-currency" aria-live="polite">{currency}</span>
      </div>
      <Button className={styles.submit} type="submit">{content.submit}</Button>
      <p className={styles.status} role="status">{preview ? content.preview : ""}</p>
    </form>
  );
}
