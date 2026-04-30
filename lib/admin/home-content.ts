import { homeContent } from "@/lib/mock-data/home";

export const HOME_EDITOR_STORAGE_KEY = "entraide-admin-home-content";

export type HomeEditorContent = {
  emergencyLabel: string;
  emergencyText: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescriptionHtml: string;
  primaryCta: string;
  secondaryCta: string;
  featuredLabel: string;
  featuredTitle: string;
  featuredDescriptionHtml: string;
  heroImage: string;
  supportImage: string;
  missionTitle: string;
  missionDescriptionHtml: string;
  missionImage: string;
  newsletterTitle: string;
  newsletterDescriptionHtml: string;
};

function paragraphHtml(text: string) {
  return `<p>${text}</p>`;
}

export const defaultHomeEditorContent: HomeEditorContent = {
  emergencyLabel: homeContent.emergencyBanner.label,
  emergencyText: homeContent.emergencyBanner.text,
  heroEyebrow: homeContent.hero.eyebrow,
  heroTitle: homeContent.hero.title,
  heroDescriptionHtml: paragraphHtml(homeContent.hero.description),
  primaryCta: homeContent.hero.primaryCta,
  secondaryCta: homeContent.hero.secondaryCta,
  featuredLabel: homeContent.hero.featuredLabel,
  featuredTitle: homeContent.hero.featuredTitle,
  featuredDescriptionHtml: paragraphHtml(homeContent.hero.featuredDescription),
  heroImage: "/assets/banner.jpeg",
  supportImage: "/assets/consultation.jpeg",
  missionTitle: "Montrer ce qui est fait, pourquoi c'est utile et comment le soutenir.",
  missionDescriptionHtml:
    "<p>Le role de la homepage est de rassurer tres vite: mission claire, projets visibles, images fortes et appel a l'action simple.</p>",
  missionImage: "/assets/about.jpeg",
  newsletterTitle: homeContent.newsletter.title,
  newsletterDescriptionHtml: paragraphHtml(homeContent.newsletter.description)
};
