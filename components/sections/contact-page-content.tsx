"use client";

import { useEffect, useState } from "react";
import { pageContent } from "@/lib/mock-data/ui-content";
import { loadContactContent, type ContactEditorContent } from "@/lib/admin/contact-content";

export function ContactPageContent() {
  const [cms, setCms] = useState<ContactEditorContent | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => { loadContactContent().then(setCms); }, []);

  const h = cms ?? {
    heroEyebrow: pageContent.contact.eyebrow,
    heroTitle: pageContent.contact.title,
    heroDescription: pageContent.contact.description,
    contactHeading: "Parler a l'association",
    address: "Medine N 260, Mbour, Senegal",
    phones: ["+221 77 639 20 69", "+221 76 811 14 12"],
    emails: ["toleye2@gmail.com", "eapsh1@outlook.com"],
    presseTitle: "Presse / Journal",
    presseText: "Pour les demandes autour des actualites, des publications et de la communication.",
    projetsTitle: "Projets",
    projetsText: "Pour parler d'un projet, d'une priorite terrain ou d'un besoin d'information detaille.",
    formTitle: "Envoyer un message",
    formFields: [{ label: "Prenom", type: "text" }, { label: "Nom", type: "text" }, { label: "Email", type: "email" }, { label: "Votre message", type: "textarea" }],
    subjectOptions: ["Choisir un sujet", "Projet", "Journal", "Don", "Partenariat"],
    submitCta: "Envoyer",
    successMessage: "Merci pour votre message.",
    faqHeading: "Aide et orientation",
    faqTitle: "Chaque page contact doit aussi reduire les frictions.",
    contactCards: [],
    faq: []
  } as ContactEditorContent;

  return (
    <div className="bg-white">
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">{h.heroEyebrow}</p>
            <h1 className="text-5xl font-bold leading-tight text-gray-950">{h.heroTitle}</h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {h.heroDescription}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="space-y-6">
            <div className="rounded-[28px] bg-gradient-to-br from-primary to-secondary p-8 text-white">
              <h2 className="mb-4 text-3xl font-bold">{h.contactHeading}</h2>
              <div className="space-y-4 text-sm leading-7 text-white/85">
                <p>{h.address}</p>
                {h.phones.map((p, i) => <p key={i}>{p}</p>)}
                {h.emails.map((e, i) => <p key={i}>{e}</p>)}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] bg-gray-50 p-6 ring-1 ring-gray-100">
                <div className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-primary">{h.presseTitle}</div>
                <p className="text-sm leading-6 text-gray-600">{h.presseText}</p>
              </div>
              <div className="rounded-[24px] bg-gray-50 p-6 ring-1 ring-gray-100">
                <div className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-primary">{h.projetsTitle}</div>
                <p className="text-sm leading-6 text-gray-600">{h.projetsText}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-[0_10px_40px_rgba(15,23,42,0.08)] ring-1 ring-gray-100">
            <h2 className="mb-6 text-3xl font-bold text-gray-950">{h.formTitle}</h2>
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              {h.formFields.slice(0, 2).map((f, i) => (
                <input key={i} className="w-full rounded-xl border border-gray-300 px-4 py-4" placeholder={f.label} />
              ))}
              <input className="w-full rounded-xl border border-gray-300 px-4 py-4" placeholder={h.formFields[2]?.label ?? "Email"} />
              <select className="w-full rounded-xl border border-gray-300 px-4 py-4 text-gray-600">
                {h.subjectOptions.map((o, i) => <option key={i}>{o}</option>)}
              </select>
              <textarea className="min-h-44 w-full rounded-xl border border-gray-300 px-4 py-4" placeholder={h.formFields[3]?.label ?? "Votre message"} />
              <button className="rounded-button bg-primary px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-orange-600">
                {h.submitCta}
              </button>
            </form>

            {sent ? (
              <div className="mt-6 rounded-2xl bg-green-50 p-5 text-sm leading-6 text-green-700 ring-1 ring-green-200">
                {h.successMessage}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
