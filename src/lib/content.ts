import aboutUsEn from "../../content/en/about-us.json";
import contactEn from "../../content/en/contact.json";
import donateEn from "../../content/en/donate.json";
import getInvolvedEn from "../../content/en/get-involved.json";
import homeEn from "../../content/en/home.json";
import impactEn from "../../content/en/impact.json";
import laArgentinaEn from "../../content/en/la-argentina.json";
import navigationEn from "../../content/en/navigation.json";
import ourMissionEn from "../../content/en/our-mission.json";
import academicSupportEn from "../../content/en/projects/academic-support.json";
import medicalCareEn from "../../content/en/projects/medical-care.json";
import mocacaoEn from "../../content/en/projects/mocacao.json";
import nutritionEn from "../../content/en/projects/nutrition.json";
import aboutUsEs from "../../content/es/about-us.json";
import contactEs from "../../content/es/contact.json";
import donateEs from "../../content/es/donate.json";
import getInvolvedEs from "../../content/es/get-involved.json";
import homeEs from "../../content/es/home.json";
import impactEs from "../../content/es/impact.json";
import laArgentinaEs from "../../content/es/la-argentina.json";
import navigationEs from "../../content/es/navigation.json";
import ourMissionEs from "../../content/es/our-mission.json";
import academicSupportEs from "../../content/es/projects/academic-support.json";
import medicalCareEs from "../../content/es/projects/medical-care.json";
import mocacaoEs from "../../content/es/projects/mocacao.json";
import nutritionEs from "../../content/es/projects/nutrition.json";

import type { ButtonVariant } from "@/components/ui/Button";

import type { Locale, PlannedPagePath } from "./i18n";

export type NavigationItem = {
  id: string;
  label: string;
  href?: string;
  children?: Array<{ label: string; href: string }>;
};

export type NavigationContent = {
  menuOpen: string;
  menuClose: string;
  languageLabel: string;
  items: NavigationItem[];
  footer: {
    copyright: string;
  };
};

export type PageStub = {
  slug: string;
  status: string;
  seo: { title: string; description: string };
  hero: { eyebrow: string; title: string };
  notice: string;
};

export type SharedCtaContent = {
  title: string;
  body: string;
  image: string;
  actions: Array<{
    label: string;
    href: string;
    variant: ButtonVariant;
  }>;
};

export type OtherProjectsContent = {
  title: string;
  previousLabel: string;
  nextLabel: string;
  items: Array<{
    title: string;
    href: string;
    image: string;
    alt: string;
  }>;
};

export type OurMissionContent = {
  _meta: {
    status: string;
    translationStatus: string;
    source: string;
  };
  slug: string;
  seo: { title: string; description: string };
  hero: { title: string; image: string; alt: string };
  sections: Array<{
    id: string;
    title: string;
    body: string[];
    image: string;
    alt: string;
    layout: "copy-media" | "media-copy" | "image-overlay";
    theme: "white" | "sand" | "dark";
  }>;
  cta: SharedCtaContent;
};

export type LaArgentinaContent = {
  _meta: {
    status: string;
    translationStatus: string;
    source: string;
  };
  slug: string;
  seo: { title: string; description: string };
  hero: {
    title: string;
    intro: string;
    statement: string;
    emphasis: string;
    image: string;
    alt: string;
  };
  sections: {
    communityContext: {
      id: string;
      title: string;
      body: string[];
      image: string;
      alt: string;
    };
    location: {
      id: string;
      title: string;
      body: string[];
    };
    whyItMatters: {
      id: string;
      title: string;
      body: string[];
    };
  };
  cta: SharedCtaContent;
};

export type MocacaoContent = {
  _meta: {
    status: string;
    translationStatus: string;
    source: string;
  };
  slug: string;
  seo: { title: string; description: string };
  hero: { title: string; image: string; alt: string };
  sections: {
    opportunity: {
      id: string;
      title: string;
      body: string[];
      image: string;
      alt: string;
    };
    whyCacao: {
      id: string;
      title: string;
      body: string[];
      commitmentsIntro: string;
      commitments: string[];
      statistic: string;
      image: string;
      alt: string;
    };
  };
  otherProjects: OtherProjectsContent;
  cta: SharedCtaContent;
};

export type NutritionContent = {
  _meta: {
    status: string;
    translationStatus: string;
    source: string;
  };
  slug: string;
  seo: { title: string; description: string };
  hero: { title: string; image: string; alt: string };
  sections: {
    combatingMalnourishment: {
      id: string;
      title: string;
      body: string[];
      image: string;
      alt: string;
    };
    commitment: {
      id: string;
      title: string;
      body: string[];
      commitmentsIntro: string;
      commitments: string[];
      image: string;
      alt: string;
    };
  };
  otherProjects: OtherProjectsContent;
  cta: SharedCtaContent;
};

export type AcademicSupportContent = {
  _meta: {
    status: string;
    translationStatus: string;
    source: string;
  };
  slug: string;
  seo: { title: string; description: string };
  hero: { title: string; image: string; alt: string };
  sections: {
    empoweringEducation: {
      id: string;
      title: string;
      body: string[];
      image: string;
      alt: string;
    };
    culture: {
      id: string;
      title: string;
      body: string[];
      commitmentsIntro: string;
      commitments: string[];
      image: string;
      alt: string;
    };
  };
  otherProjects: OtherProjectsContent;
  cta: SharedCtaContent;
};

export type MedicalCareContent = {
  _meta: {
    status: string;
    translationStatus: string;
    source: string;
  };
  slug: string;
  seo: { title: string; description: string };
  hero: { title: string; image: string; alt: string };
  sections: {
    accessHealthcare: {
      id: string;
      title: string;
      body: string[];
      image: string;
      alt: string;
    };
    clinicNoel: {
      id: string;
      title: string;
      body: string[];
      commitmentsIntro: string;
      commitments: string[];
      image: string;
      alt: string;
    };
  };
  otherProjects: OtherProjectsContent;
  cta: SharedCtaContent;
};

export type ImpactContent = {
  _meta: {
    status: string;
    translationStatus: string;
    source: string;
  };
  slug: string;
  seo: { title: string; description: string };
  hero: {
    title: string;
    statement: string;
    image: string;
    alt: string;
  };
  sections: {
    keyFigures: {
      id: string;
      title: string;
      body: string[];
      image: string;
      alt: string;
    };
    storiesOfChange: {
      id: string;
      title: string;
      body: string[];
      image: string;
      alt: string;
    };
  };
  cta: SharedCtaContent;
};

export type AboutUsContent = {
  _meta: {
    status: string;
    translationStatus: string;
    source: string;
  };
  slug: string;
  seo: { title: string; description: string };
  hero: {
    title: string;
    statement: string;
    image: string;
    alt: string;
  };
  belief: {
    id: string;
    title: string;
    body: string[];
    intro: string;
    pillars: Array<{
      title: string;
      body: string;
    }>;
  };
  board: {
    id: string;
    title: string;
    selectLabel: string;
    previousLabel: string;
    nextLabel: string;
    directors: Array<{
      id: string;
      name: string;
      role: string;
      image: string;
      alt: string;
      biography: string[];
    }>;
  };
  cta: SharedCtaContent;
};

type HomeContent = {
  slug: string;
  status: string;
  seo: { title: string; description: string };
  hero: { eyebrow: string; title: string };
  notice: string;
};

const navigationByLocale = {
  en: navigationEn,
  es: navigationEs,
} satisfies Record<Locale, NavigationContent>;

const ourMissionByLocale = {
  en: ourMissionEn,
  es: ourMissionEs,
} as Record<Locale, OurMissionContent>;

const laArgentinaByLocale = {
  en: laArgentinaEn,
  es: laArgentinaEs,
} as Record<Locale, LaArgentinaContent>;

const mocacaoByLocale = {
  en: mocacaoEn,
  es: mocacaoEs,
} as Record<Locale, MocacaoContent>;

const nutritionByLocale = {
  en: nutritionEn,
  es: nutritionEs,
} as Record<Locale, NutritionContent>;

const academicSupportByLocale = {
  en: academicSupportEn,
  es: academicSupportEs,
} as Record<Locale, AcademicSupportContent>;

const medicalCareByLocale = {
  en: medicalCareEn,
  es: medicalCareEs,
} as Record<Locale, MedicalCareContent>;

const impactByLocale = {
  en: impactEn,
  es: impactEs,
} as Record<Locale, ImpactContent>;

const aboutUsByLocale = {
  en: aboutUsEn,
  es: aboutUsEs,
} as Record<Locale, AboutUsContent>;

const homeByLocale = {
  en: homeEn,
  es: homeEs,
} satisfies Record<Locale, HomeContent>;

const pagesByLocale = {
  en: {
    "get-involved": getInvolvedEn,
    contact: contactEn,
    donate: donateEn,
  },
  es: {
    "get-involved": getInvolvedEs,
    contact: contactEs,
    donate: donateEs,
  },
} satisfies Record<Locale, Record<PlannedPagePath, PageStub>>;

export function getNavigation(locale: Locale): NavigationContent {
  return navigationByLocale[locale];
}

export function getOurMission(locale: Locale): OurMissionContent {
  return ourMissionByLocale[locale];
}

export function getLaArgentina(locale: Locale): LaArgentinaContent {
  return laArgentinaByLocale[locale];
}

export function getMocacao(locale: Locale): MocacaoContent {
  return mocacaoByLocale[locale];
}

export function getNutrition(locale: Locale): NutritionContent {
  return nutritionByLocale[locale];
}

export function getAcademicSupport(locale: Locale): AcademicSupportContent {
  return academicSupportByLocale[locale];
}

export function getMedicalCare(locale: Locale): MedicalCareContent {
  return medicalCareByLocale[locale];
}

export function getImpact(locale: Locale): ImpactContent {
  return impactByLocale[locale];
}

export function getAboutUs(locale: Locale): AboutUsContent {
  return aboutUsByLocale[locale];
}

export function getHome(locale: Locale): HomeContent {
  return homeByLocale[locale];
}

export function getPageStub(locale: Locale, path: PlannedPagePath): PageStub {
  return pagesByLocale[locale][path];
}
