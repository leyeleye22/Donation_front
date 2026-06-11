"use client";

import { useEffect, useState } from "react";
import { loadContactContent, type ContactEditorContent } from "@/lib/admin/contact-content";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export function ContactPageContent() {
  const [cms, setCms] = useState<ContactEditorContent | null>(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadContactContent().then(setCms).catch(console.error);
  }, []);

  if (!cms) {
    return (
      <div className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-12 w-96" />
          <Skeleton className="mt-6 h-24 w-full max-w-2xl" />
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      await api.sendContactMessage({
        first_name: firstName,
        last_name: lastName,
        email,
        subject: subject || undefined,
        message,
      });
      setSent(true);
      setFirstName("");
      setLastName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur d'envoi");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="bg-white">
      <section className="bg-page-hero">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-primary">{cms.heroEyebrow}</p>
          <h1 className="max-w-4xl text-5xl font-bold leading-tight text-gray-950 md:text-6xl">{cms.heroTitle}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">{cms.heroDescription}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-950">{cms.contactHeading}</h2>
            {cms.address ? <p className="leading-7 text-gray-600">{cms.address}</p> : null}
            {cms.phones.map((phone) => (
              <p key={phone} className="font-semibold text-gray-900">{phone}</p>
            ))}
            {cms.emails.map((addr) => (
              <a key={addr} href={`mailto:${addr}`} className="block font-semibold text-primary hover:underline">{addr}</a>
            ))}
            {cms.presseTitle ? (
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <h3 className="font-bold text-gray-950">{cms.presseTitle}</h3>
                <p className="mt-2 text-sm text-gray-600">{cms.presseText}</p>
              </div>
            ) : null}
            {cms.projetsTitle ? (
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <h3 className="font-bold text-gray-950">{cms.projetsTitle}</h3>
                <p className="mt-2 text-sm text-gray-600">{cms.projetsText}</p>
              </div>
            ) : null}
          </div>

          <div className="rounded-[32px] border border-secondary/12 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <h2 className="text-2xl font-bold text-gray-950">{cms.formTitle}</h2>
            {sent ? (
              <p className="mt-6 text-secondary">{cms.successMessage}</p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Prenom" required className="rounded-xl border border-gray-200 px-4 py-3" />
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Nom" required className="rounded-xl border border-gray-200 px-4 py-3" />
                </div>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" required className="w-full rounded-xl border border-gray-200 px-4 py-3" />
                {cms.subjectOptions.length > 0 ? (
                  <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3">
                    {cms.subjectOptions.map((opt) => (
                      <option key={opt} value={opt === "Choisir un sujet" ? "" : opt}>{opt}</option>
                    ))}
                  </select>
                ) : null}
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Votre message" required rows={5} className="w-full rounded-xl border border-gray-200 px-4 py-3" />
                {error ? <p className="text-sm text-red-600">{error}</p> : null}
                <button type="submit" disabled={sending} className="btn-primary btn-md w-full sm:w-auto">
                  {sending ? "Envoi..." : cms.submitCta}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {(cms.contactCards.length > 0 || cms.faq.length > 0) ? (
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {cms.faqHeading || cms.faqTitle ? (
          <div className="mb-10 max-w-3xl">
            {cms.faqHeading ? <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">{cms.faqHeading}</p> : null}
            {cms.faqTitle ? <h2 className="text-4xl font-bold text-gray-950">{cms.faqTitle}</h2> : null}
          </div>
          ) : null}
          {cms.contactCards.length > 0 ? (
          <div className="mb-10 grid gap-6 md:grid-cols-3">
            {cms.contactCards.map((card) => (
              <div key={card.title} className="rounded-[28px] bg-white p-8 ring-1 ring-gray-100">
                <h3 className="mb-4 text-2xl font-bold text-gray-950">{card.title}</h3>
                <p className="leading-7 text-gray-600">{card.text}</p>
              </div>
            ))}
          </div>
          ) : null}
          {cms.faq.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3">
            {cms.faq.map((item) => (
              <div key={item.question} className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-gray-100">
                <h3 className="mb-4 text-xl font-bold text-gray-950">{item.question}</h3>
                <p className="leading-7 text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
          ) : null}
        </div>
      </section>
      ) : null}
    </div>
  );
}
