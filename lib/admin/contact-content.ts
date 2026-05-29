import { api } from "@/lib/api";
import { resolveImageUrl } from "@/lib/image-url";

export const CONTACT_EDITOR_STORAGE_KEY = "entraide-admin-contact-content";

export type ContactEditorContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  contactHeading: string;
  address: string;
  phones: string[];
  emails: string[];
  presseTitle: string;
  presseText: string;
  projetsTitle: string;
  projetsText: string;
  formTitle: string;
  formFields: { label: string; type: string }[];
  subjectOptions: string[];
  submitCta: string;
  successMessage: string;
  contactCards: { title: string; text: string }[];
  faq: { question: string; answer: string }[];
  faqHeading: string;
  faqTitle: string;
};

export const defaultContactEditorContent: ContactEditorContent = {
  heroEyebrow: "Contact",
  heroTitle: "Une page contact qui doit reduire les frictions et donner confiance.",
  heroDescription: "Remplir un formulaire, ecrire directement ou trouver l'information utile: chaque geste doit etre simple et rapide.",
  contactHeading: "Parler a l'association",
  address: "Medine N 260, Mbour, Senegal",
  phones: ["+221 77 639 20 69", "+221 76 811 14 12"],
  emails: ["toleye2@gmail.com", "eapsh1@outlook.com"],
  presseTitle: "Presse / Journal",
  presseText: "Pour les demandes autour des actualites, des publications et de la communication.",
  projetsTitle: "Projets",
  projetsText: "Pour parler d'un projet, d'une priorite terrain ou d'un besoin d'information detaille.",
  formTitle: "Envoyer un message",
  formFields: [
    { label: "Prenom", type: "text" },
    { label: "Nom", type: "text" },
    { label: "Email", type: "email" },
    { label: "Votre message", type: "textarea" }
  ],
  subjectOptions: ["Choisir un sujet", "Projet", "Journal", "Don", "Partenariat"],
  submitCta: "Envoyer",
  successMessage: "Merci pour votre message. Nous vous repondrons dans les plus brefs delais.",
  contactCards: [
    { title: "Equipe terrain", text: "Nos equipes sont basees a Mbour et intervennent dans tout le Senegal." },
    { title: "Partenaires", text: "Vous souhaitez collaborer ? Contactez-nous pour discuter de votre projet." },
  ],
  faq: [
    { question: "Comment faire un don ?", answer: "Vous pouvez faire un don via notre page dediee ou nous contacter directement." },
    { question: "Ou va mon don ?", answer: "Chaque don est integralement reverse aux projets que vous soutenez." },
  ],
  faqHeading: "Questions frequentes",
  faqTitle: "Reponses aux demandes les plus courantes pour accelerer l'echange."
};

function resolveContentImages(content: ContactEditorContent): ContactEditorContent {
  return content;
}

export async function loadContactContent(): Promise<ContactEditorContent> {
  try {
    const res = await api.getPage('contact');
    if (res?.content) return resolveContentImages(res.content as ContactEditorContent);
  } catch (e) { console.error("loadContactContent: failed to load", e); }
  return defaultContactEditorContent;
}
