import { api } from "@/lib/api";
import { emptyContactEditorContent } from "@/lib/cms-empty";

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

export const defaultContactEditorContent = emptyContactEditorContent();

export async function loadContactContent(): Promise<ContactEditorContent> {
  try {
    const res = await api.getPage("contact");
    if (res?.content) {
      return { ...emptyContactEditorContent(), ...(res.content as ContactEditorContent) };
    }
  } catch (e) {
    console.error("loadContactContent: failed to load", e);
  }
  return emptyContactEditorContent();
}
