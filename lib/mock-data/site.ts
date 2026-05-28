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
  siteName: "Entraide Humanitaire",
  heroTitle: { fr: "Ensemble pour un impact concret", en: "Together for real impact", ar: "معا من أجل أثر ملموس" },
  heroText: { fr: "Documenter, informer et mobiliser pour des actions humanitaires transparentes et durables.", en: "Document, inform and mobilize for transparent and sustainable humanitarian action.", ar: "توثيق وإعلام وتعبئة من أجل عمل إنساني شفاف ومستدام." },
  aboutSummary: { fr: "Une association qui documente ses actions sur le terrain avec rigueur et transparence.", en: "An association that documents its field actions with rigor and transparency.", ar: "جمعية توثق أعمالها الميدانية بدقة وشفافة." },
  donationCta: { fr: "Faire un don", en: "Donate", ar: "تبرع الآن" }
};
