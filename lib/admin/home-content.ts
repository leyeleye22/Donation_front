import { api } from "@/lib/api";
import { emptyHomeEditorContent } from "@/lib/cms-empty";
import { resolveImageUrl } from "@/lib/image-url";

export type HeroStat = { value: string; label: string };
export type EntryPoint = { title: string; description: string; image: string; cta: string; href: string };
export type Pillar = { title: string; description: string };
export type ProofItem = { value: string; label: string };
export type Testimonial = { name: string; location: string; text: string; role: string };

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
  testimonials: Testimonial[];
};

export const defaultHomeEditorContent = emptyHomeEditorContent();

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
    const res = await api.getPage("home");
    if (res?.content) {
      return resolveContentImages({ ...emptyHomeEditorContent(), ...(res.content as HomeEditorContent) });
    }
  } catch (e) {
    console.error("loadHomeContent: failed to load", e);
  }
  return emptyHomeEditorContent();
}
