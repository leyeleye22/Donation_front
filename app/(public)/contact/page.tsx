"use client";

import { useEffect, useState } from "react";
import { ContactPageContent } from "@/components/sections/contact-page-content";
import { loadContactContent, type ContactEditorContent, defaultContactEditorContent } from "@/lib/admin/contact-content";

export default function ContactPage() {
  const [cms, setCms] = useState<ContactEditorContent | null>(null);

  useEffect(() => { loadContactContent().then(setCms); }, []);

  const h = cms ?? defaultContactEditorContent;

  return (
    <>
      <ContactPageContent />
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">{h.faqHeading}</p>
            <h2 className="text-4xl font-bold text-gray-950">{h.faqTitle}</h2>
          </div>

          <div className="mb-10 grid gap-6 md:grid-cols-3">
            {h.contactCards.map((card) => (
              <div key={card.title} className="rounded-[28px] bg-white p-8 ring-1 ring-gray-100">
                <h3 className="mb-4 text-2xl font-bold text-gray-950">{card.title}</h3>
                <p className="leading-7 text-gray-600">{card.text}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {h.faq.map((item) => (
              <div key={item.question} className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-gray-100">
                <h3 className="mb-4 text-xl font-bold text-gray-950">{item.question}</h3>
                <p className="leading-7 text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
