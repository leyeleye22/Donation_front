import type { NavItem, SiteSettings } from "@/lib/types";

export const navItems: NavItem[] = [
  {
    href: "/",
    label: { fr: "Accueil", en: "Home", ar: "الرئيسية" }
  },
  {
    href: "/about",
    label: { fr: "À propos", en: "About", ar: "من نحن" }
  },
  {
    href: "/projects",
    label: { fr: "Projets", en: "Projects", ar: "المشاريع" }
  },
  {
    href: "/journal",
    label: { fr: "Actualités", en: "Journal", ar: "الأخبار" }
  },
  {
    href: "/gallery",
    label: { fr: "Galerie", en: "Gallery", ar: "المعرض" }
  },
  {
    href: "/contact",
    label: { fr: "Contact", en: "Contact", ar: "اتصل بنا" }
  }
];

export const siteSettings: SiteSettings = {
  siteName: "Entr'aide Humanitaire",
  heroTitle: {
    fr: "Ensemble pour un impact concret",
    en: "Together for real impact",
    ar: "معا من أجل أثر ملموس"
  },
  heroText: {
    fr: "Phase front Next.js avec fausses données, en conservant fidèlement le design du site existant.",
    en: "Next.js frontend phase with fake data while preserving the existing site design faithfully.",
    ar: "مرحلة الواجهة باستخدام Next.js مع بيانات تجريبية مع الحفاظ على تصميم الموقع الحالي."
  },
  aboutSummary: {
    fr: "Une architecture front prête à brancher Laravel plus tard, sans casser l'existant.",
    en: "A frontend architecture ready to plug into Laravel later without breaking the existing site.",
    ar: "هيكلة واجهة جاهزة للربط مع Laravel لاحقا بدون كسر الموقع الحالي."
  },
  donationCta: {
    fr: "Faire un don",
    en: "Donate",
    ar: "تبرع الآن"
  }
};
