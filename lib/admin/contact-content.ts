import { contactPageContent } from "@/lib/mock-data/page-sections";
import { api } from "@/lib/api";

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
  contactCards: contactPageContent.contactCards.map((c) => ({ title: c.title, text: c.text })),
  faq: contactPageContent.faq.map((f) => ({ question: f.question, answer: f.answer })),
  faqHeading: "Questions frequentes",
  faqTitle: "Reponses aux demandes les plus courantes pour accelerer l'echange."
};

export async function loadContactContent(): Promise<ContactEditorContent> {
  try {
    const res = await api.getPage('contact');
    if (res?.data?.content) return res.data.content as ContactEditorContent;
  } catch {}
  return defaultContactEditorContent;
}
