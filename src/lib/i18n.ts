export const locales = ["en", "es"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const plannedPagePaths = [
  "projects/mocacao",
  "projects/nutrition",
  "projects/academic-support",
  "projects/medical-care",
  "impact",
  "about-us",
  "get-involved",
  "contact",
  "donate",
] as const;

export type PlannedPagePath = (typeof plannedPagePaths)[number];

export function hasLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function localizedHref(locale: Locale, href: string) {
  if (href.startsWith("#")) {
    return href;
  }

  const normalizedHref = href.startsWith("/") ? href : `/${href}`;
  return `/${locale}${normalizedHref === "/" ? "" : normalizedHref}`;
}

export function replaceLocaleInPathname(pathname: string, locale: Locale) {
  const parts = pathname.split("/");

  if (parts[1] && hasLocale(parts[1])) {
    parts[1] = locale;
    return parts.join("/") || `/${locale}`;
  }

  return localizedHref(locale, pathname);
}
