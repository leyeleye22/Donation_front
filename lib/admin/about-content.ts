import { api } from "@/lib/api";
import { emptyAboutEditorContent } from "@/lib/cms-empty";
import { resolveImageUrl } from "@/lib/image-url";

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
  testimonials: { name: string; location: string; text: string; role: string }[];
};

export const defaultAboutEditorContent = emptyAboutEditorContent();

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
    const res = await api.getPage("about");
    if (res?.content) {
      return resolveContentImages({ ...emptyAboutEditorContent(), ...(res.content as AboutEditorContent) });
    }
  } catch (e) {
    console.error("loadAboutContent: failed to load", e);
  }
  return emptyAboutEditorContent();
}
