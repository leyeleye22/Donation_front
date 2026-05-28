import { api } from "@/lib/api";

export type PageSectionVisibility = {
  emergencyBanner: boolean;
  hero: boolean;
  trustBar: boolean;
  entryPoints: boolean;
  projects: boolean;
  mission: boolean;
  journal: boolean;
  transparency: boolean;
  gallery: boolean;
  donationCta: boolean;
  newsletter: boolean;
  footer: boolean;
};

export type PageSettings = {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
};

export type GlobalSettings = {
  siteName: string;
  donationCtaText: string;
  showFloatingButton: boolean;
  floatingButtonPages: string[];
  footerCopyright: string;
  footerIntro: string;
  pageSettings: Record<string, PageSettings>;
  pageVisibility: Record<string, PageSectionVisibility>;
};

const defaultPageSettings: PageSettings = {
  heroEyebrow: "Entraide pour servir l'humanité",
  heroTitle: "Ensemble pour un impact concret",
  heroDescription: "Documenter, informer, mobiliser.",
  heroPrimaryCta: "Faire un don",
  heroSecondaryCta: "Nos projets"
};

function allVisible(): PageSectionVisibility {
  return {
    emergencyBanner: true,
    hero: true,
    trustBar: true,
    entryPoints: true,
    projects: true,
    mission: true,
    journal: true,
    transparency: true,
    gallery: true,
    donationCta: true,
    newsletter: true,
    footer: true
  };
}

const defaultPageVisibility: Record<string, PageSectionVisibility> = {
  "/": allVisible(),
  "/about": { ...allVisible(), projects: false, gallery: false, journal: false, newsletter: false },
  "/projects": { ...allVisible(), hero: false, trustBar: false, entryPoints: false, mission: false, journal: false, gallery: false, donationCta: false, newsletter: false, emergencyBanner: false },
  "/journal": { ...allVisible(), hero: false, trustBar: false, entryPoints: false, projects: false, mission: false, gallery: false, donationCta: false, newsletter: false, emergencyBanner: false },
  "/gallery": { ...allVisible(), hero: false, trustBar: false, entryPoints: false, projects: false, mission: false, journal: false, newsletter: false, emergencyBanner: false },
  "/contact": { ...allVisible(), hero: false, trustBar: false, entryPoints: false, projects: false, mission: false, journal: false, gallery: false, newsletter: false, emergencyBanner: false }
};

export const defaultGlobalSettings: GlobalSettings = {
  siteName: "Entr'aide pour servir l'humanité",
  donationCtaText: "Faire un don",
  showFloatingButton: true,
  floatingButtonPages: ["/", "/about", "/projects", "/journal", "/gallery", "/contact"],
  footerCopyright: "Entraide Pour Servir L Humanite. Tous droits reserves.",
  footerIntro: "Une association qui documente ses actions pour plus de transparence et d impact.",
  pageSettings: {
    "/": defaultPageSettings,
    "/about": defaultPageSettings,
    "/projects": defaultPageSettings,
    "/journal": defaultPageSettings,
    "/gallery": defaultPageSettings,
    "/contact": defaultPageSettings
  },
  pageVisibility: defaultPageVisibility
};

export async function loadGlobalSettings(): Promise<GlobalSettings> {
  try {
    const res = await api.getSettings();
    if (res?.data) return res.data as GlobalSettings;
  } catch {}
  return defaultGlobalSettings;
}

export async function saveGlobalSettings(settings: GlobalSettings): Promise<void> {
  await api.updateSettings(settings);
}
