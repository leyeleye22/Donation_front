"use client";

import { useState } from "react";
import { pageContent } from "@/lib/mock-data/ui-content";

export function ContactPageContent() {
  const [sent, setSent] = useState(false);

  return (
    <div className="bg-white">
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">{pageContent.contact.eyebrow}</p>
            <h1 className="text-5xl font-bold leading-tight text-gray-950">{pageContent.contact.title}</h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {pageContent.contact.description}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="space-y-6">
            <div className="rounded-[28px] bg-gray-950 p-8 text-white">
              <h2 className="mb-4 text-3xl font-bold">Parler a l'association</h2>
              <div className="space-y-4 text-sm leading-7 text-gray-300">
                <p>Medine N 260, Mbour, Senegal</p>
                <p>+221 77 639 20 69</p>
                <p>+221 76 811 14 12</p>
                <p>toleye2@gmail.com</p>
                <p>eapsh1@outlook.com</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] bg-gray-50 p-6 ring-1 ring-gray-100">
                <div className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-primary">Presse / Journal</div>
                <p className="text-sm leading-6 text-gray-600">Pour les demandes autour des actualites, des publications et de la communication.</p>
              </div>
              <div className="rounded-[24px] bg-gray-50 p-6 ring-1 ring-gray-100">
                <div className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-primary">Projets</div>
                <p className="text-sm leading-6 text-gray-600">Pour parler d'un projet, d'une priorite terrain ou d'un besoin d'information detaille.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-[0_10px_40px_rgba(15,23,42,0.08)] ring-1 ring-gray-100">
            <h2 className="mb-6 text-3xl font-bold text-gray-950">{pageContent.contact.formTitle}</h2>
            <form
              className="space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                setSent(true);
              }}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <input className="w-full rounded-xl border border-gray-300 px-4 py-4" placeholder="Prenom" />
                <input className="w-full rounded-xl border border-gray-300 px-4 py-4" placeholder="Nom" />
              </div>
              <input className="w-full rounded-xl border border-gray-300 px-4 py-4" placeholder="Email" />
              <select className="w-full rounded-xl border border-gray-300 px-4 py-4 text-gray-600">
                <option>Choisir un sujet</option>
                <option>Projet</option>
                <option>Journal</option>
                <option>Don</option>
                <option>Partenariat</option>
              </select>
              <textarea className="min-h-44 w-full rounded-xl border border-gray-300 px-4 py-4" placeholder="Votre message" />
              <button className="rounded-button bg-primary px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-orange-600">
                Envoyer
              </button>
            </form>

            {sent ? (
              <div className="mt-6 rounded-2xl bg-green-50 p-5 text-sm leading-6 text-green-700 ring-1 ring-green-200">
                {pageContent.contact.successMessage}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
