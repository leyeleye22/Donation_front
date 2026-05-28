import { aboutPageContent } from "@/lib/mock-data/page-sections";
import { api } from "@/lib/api";
import { resolveImageUrl } from "@/lib/image-url";

export const ABOUT_EDITOR_STORAGE_KEY = "entraide-admin-about-content";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8001';

export type AboutEditorContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  stats: { value: string; label: string }[];
  associationBadge: string;
  associationTitle: string;
  associationBody: string[];
  associationImage: string;
  portrait: string;
  story: string[];
  founderBadge: string;
  founderTitle: string;
  founderSubtitle: string;
  founderPortrait: string;
  founderQuote: string;
  narrativeTitle: string;
  narrativeParagraphs: string[];
  values: { title: string; description: string }[];
  timeline: { year: string; title: string; text: string }[];
  actionStories: { title: string; text: string; image: string }[];
  calloutTitle: string;
  calloutDescription: string;
  calloutPrimaryCta: string;
  calloutSecondaryCta: string;
};

export const defaultAboutEditorContent: AboutEditorContent = {
  heroEyebrow: aboutPageContent.hero.eyebrow,
  heroTitle: aboutPageContent.hero.title,
  heroDescription: aboutPageContent.hero.description,
  stats: aboutPageContent.heroStats.map((s) => ({ value: s.value, label: s.label })),
  associationBadge: aboutPageContent.association.badge,
  associationTitle: aboutPageContent.association.title,
  associationBody: [...aboutPageContent.association.body],
  associationImage: `${BACKEND_URL}${aboutPageContent.association.image}`,
  portrait: `${BACKEND_URL}${aboutPageContent.associationProfile.portrait}`,
  story: [...aboutPageContent.associationProfile.story],
  founderBadge: aboutPageContent.founder.badge,
  founderTitle: aboutPageContent.founder.title,
  founderSubtitle: aboutPageContent.founder.subtitle,
  founderPortrait: `${BACKEND_URL}${aboutPageContent.founder.portrait}`,
  founderQuote: aboutPageContent.founder.quote,
  narrativeTitle: aboutPageContent.founderNarrative.title,
  narrativeParagraphs: [...aboutPageContent.founderNarrative.paragraphs],
  values: aboutPageContent.values.map((v) => ({ title: v.title, description: v.description })),
  timeline: aboutPageContent.timeline.map((t) => ({ year: t.year, title: t.title, text: t.text })),
  actionStories: aboutPageContent.actionStories.map((a) => ({ title: a.title, text: a.text, image: `${BACKEND_URL}${a.image}` })),
  calloutTitle: aboutPageContent.callout.title,
  calloutDescription: aboutPageContent.callout.description,
  calloutPrimaryCta: aboutPageContent.callout.primaryCta,
  calloutSecondaryCta: aboutPageContent.callout.secondaryCta,
};

function resolveContentImages(content: AboutEditorContent): AboutEditorContent {
  return {
    ...content,
    associationImage: resolveImageUrl(content.associationImage),
    portrait: resolveImageUrl(content.portrait),
    founderPortrait: resolveImageUrl(content.founderPortrait),
    actionStories: content.actionStories.map((s) => ({ ...s, image: resolveImageUrl(s.image) })),
  };
}

export async function loadAboutContent(): Promise<AboutEditorContent> {
  try {
    const res = await api.getPage('about');
    if (res?.data?.content) return resolveContentImages(res.data.content as AboutEditorContent);
  } catch {}
  return defaultAboutEditorContent;
}
