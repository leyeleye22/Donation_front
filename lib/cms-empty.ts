import type { AboutEditorContent } from "@/lib/admin/about-content";
import type { ContactEditorContent } from "@/lib/admin/contact-content";
import type { HomeEditorContent } from "@/lib/admin/home-content";

/** Structures vides pour les formulaires admin — pas de contenu marketing statique. */
export function emptyHomeEditorContent(): HomeEditorContent {
  return {
    emergencyLabel: "",
    emergencyText: "",
    heroEyebrow: "",
    heroTitle: "",
    heroDescription: "",
    primaryCta: "",
    secondaryCta: "",
    heroStats: [],
    trustPoints: [],
    featuredLabel: "",
    featuredTitle: "",
    featuredDescription: "",
    heroImage: "",
    supportImage: "",
    proofStrip: [],
    entryPoints: [],
    pillars: [],
    transparencyTitle: "",
    transparencyDescription: "",
    transparencyItems: [],
    galleryTitle: "",
    galleryDescription: "",
    donationHeading: "",
    donationTitle: "",
    donationDescription: "",
    donationPrimaryCta: "",
    donationSecondaryCta: "",
    newsletterTitle: "",
    newsletterDescription: "",
    testimonials: [],
  };
}

export function emptyAboutEditorContent(): AboutEditorContent {
  return {
    heroEyebrow: "",
    heroTitle: "",
    heroDescription: "",
    stats: [],
    associationBadge: "",
    associationTitle: "",
    associationBody: [],
    associationImage: "",
    portrait: "",
    story: [],
    founderBadge: "",
    founderTitle: "",
    founderSubtitle: "",
    founderPortrait: "",
    founderQuote: "",
    narrativeTitle: "",
    narrativeParagraphs: [],
    values: [],
    timeline: [],
    actionStories: [],
    calloutTitle: "",
    calloutDescription: "",
    calloutPrimaryCta: "",
    calloutSecondaryCta: "",
    testimonials: [],
  };
}

export function emptyContactEditorContent(): ContactEditorContent {
  return {
    heroEyebrow: "",
    heroTitle: "",
    heroDescription: "",
    contactHeading: "",
    address: "",
    phones: [],
    emails: [],
    presseTitle: "",
    presseText: "",
    projetsTitle: "",
    projetsText: "",
    formTitle: "",
    formFields: [
      { label: "Prenom", type: "text" },
      { label: "Nom", type: "text" },
      { label: "Email", type: "email" },
      { label: "Votre message", type: "textarea" },
    ],
    subjectOptions: ["Choisir un sujet"],
    submitCta: "Envoyer",
    successMessage: "",
    contactCards: [],
    faq: [],
    faqHeading: "",
    faqTitle: "",
  };
}
