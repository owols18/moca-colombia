import { NextRequest, NextResponse } from "next/server";

import { defaultLocale, type Locale } from "@/lib/i18n";

const spanishSpeakingCountries = new Set([
  "AR",
  "BO",
  "CL",
  "CO",
  "CR",
  "CU",
  "DO",
  "EC",
  "ES",
  "GQ",
  "GT",
  "HN",
  "MX",
  "NI",
  "PA",
  "PE",
  "PR",
  "PY",
  "SV",
  "UY",
  "VE",
]);

function countryFrom(request: NextRequest) {
  return [
    "x-vercel-ip-country",
    "cf-ipcountry",
    "x-country-code",
    "cloudfront-viewer-country",
  ]
    .map((header) => request.headers.get(header)?.toUpperCase())
    .find(Boolean);
}

function localeFromAcceptLanguage(header: string | null): Locale | undefined {
  if (!header) {
    return undefined;
  }

  const preferences = header
    .split(",")
    .map((entry, index) => {
      const [tag, ...parameters] = entry.trim().toLowerCase().split(";");
      const qualityParameter = parameters.find((parameter) => parameter.trim().startsWith("q="));
      const quality = qualityParameter ? Number(qualityParameter.split("=")[1]) : 1;

      return {
        index,
        quality: Number.isFinite(quality) ? quality : 0,
        tag,
      };
    })
    .sort((left, right) => right.quality - left.quality || left.index - right.index);

  for (const preference of preferences) {
    if (preference.tag === "es" || preference.tag.startsWith("es-")) {
      return "es";
    }

    if (preference.tag === "en" || preference.tag.startsWith("en-")) {
      return "en";
    }
  }

  return undefined;
}

function detectLocale(request: NextRequest): Locale {
  const savedLocale = request.cookies.get("moca_locale")?.value;

  if (savedLocale === "en" || savedLocale === "es") {
    return savedLocale;
  }

  const country = countryFrom(request);

  if (country) {
    return spanishSpeakingCountries.has(country) ? "es" : "en";
  }

  return localeFromAcceptLanguage(request.headers.get("accept-language")) ?? defaultLocale;
}

export function proxy(request: NextRequest) {
  const locale = detectLocale(request);
  const destination = request.nextUrl.clone();

  destination.pathname = `/${locale}${destination.pathname === "/" ? "" : destination.pathname}`;

  const response = NextResponse.redirect(destination);
  response.headers.set("Vary", "Cookie, Accept-Language");
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|design-system|en(?:/|$)|es(?:/|$)|.*\\..*).*)",
  ],
};
