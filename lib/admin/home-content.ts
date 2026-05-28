import { homeContent } from "@/lib/mock-data/home";
import { api } from "@/lib/api";
import { resolveImageUrl } from "@/lib/image-url";

export const HOME_EDITOR_STORAGE_KEY = "entraide-admin-home-content";

export type HeroStat = { value: string; label: string };
export type EntryPoint = { title: string; description: string; image: string; cta: string; href: string };
export type Pillar = { title: string; description: string };
export type ProofItem = { value: string; label: string };

export type HomeEditorContent = {
  emergencyLabel: string;
  emergencyText: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  primaryCta: string;
  secondaryCta: string;
  heroStats: HeroStat[];
  trustPoints: string[];
  featuredLabel: string;
  featuredTitle: string;
  featuredDescription: string;
  heroImage: string;
  supportImage: string;
  proofStrip: ProofItem[];
  entryPoints: EntryPoint[];
  pillars: Pillar[];
  transparencyTitle: string;
  transparencyDescription: string;
  transparencyItems: ProofItem[];
  galleryTitle: string;
  galleryDescription: string;
  donationHeading: string;
  donationTitle: string;
  donationDescription: string;
  donationPrimaryCta: string;
  donationSecondaryCta: string;
  newsletterTitle: string;
  newsletterDescription: string;
};

export const defaultHomeEditorContent: HomeEditorContent = {
  emergencyLabel: homeContent.emergencyBanner.label,
  emergencyText: homeContent.emergencyBanner.text,
  heroEyebrow: homeContent.hero.eyebrow,
  heroTitle: homeContent.hero.title,
  heroDescription: homeContent.hero.description,
  primaryCta: homeContent.hero.primaryCta,
  secondaryCta: homeContent.hero.secondaryCta,
  heroStats: homeContent.hero.stats.map((s) => ({ value: s.value, label: s.label })),
  trustPoints: [...homeContent.hero.trustPoints],
  featuredLabel: homeContent.hero.featuredLabel,
  featuredTitle: homeContent.hero.featuredTitle,
  featuredDescription: homeContent.hero.featuredDescription,
  heroImage: `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8001'}/assets/banner.jpeg`,
  supportImage: `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8001'}/assets/consultation.jpeg`,
  proofStrip: homeContent.proofStrip.map((p) => ({ value: p.value, label: p.label })),
  entryPoints: homeContent.entryPoints.map((e) => ({ title: e.title, description: e.description, image: e.image, cta: e.cta, href: e.href })),
  pillars: homeContent.pillars.map((p) => ({ title: p.title, description: p.description })),
  transparencyTitle: homeContent.transparency.title,
  transparencyDescription: homeContent.transparency.description,
  transparencyItems: homeContent.transparency.items.map((i) => ({ value: i.value, label: i.label })),
  galleryTitle: homeContent.gallery.title,
  galleryDescription: homeContent.gallery.description,
  donationHeading: "Agir maintenant",
  donationTitle: "Soutenez nos actions, visibles et documentees sur le terrain.",
  donationDescription: "Chaque don est connecte a des projets concrets, avec un suivi visuel et des mises a jour regulieres.",
  donationPrimaryCta: "Faire un don",
  donationSecondaryCta: "Voir les projets",
  newsletterTitle: homeContent.newsletter.title,
  newsletterDescription: homeContent.newsletter.description,
};

function resolveContentImages(content: HomeEditorContent): HomeEditorContent {
  return {
    ...content,
    heroImage: resolveImageUrl(content.heroImage),
    supportImage: resolveImageUrl(content.supportImage),
    entryPoints: content.entryPoints.map((ep) => ({ ...ep, image: resolveImageUrl(ep.image) })),
  };
}

export async function loadHomeContent(): Promise<HomeEditorContent> {
  try {
    const res = await api.getPage('home');
    if (res?.content) return resolveContentImages(res.content as HomeEditorContent);
  } catch {}
  return defaultHomeEditorContent;
}
