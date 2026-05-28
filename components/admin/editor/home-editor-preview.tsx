"use client";

import type { HomeEditorContent } from "@/lib/admin/home-content";

export function HomeEditorPreview({ content }: { content: HomeEditorContent }) {
  return (
    <div className="overflow-hidden rounded-[34px] border border-secondary/12 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
      <div className="border-b border-secondary/10 bg-white px-6 py-4">
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">Apercu live homepage</div>
      </div>

      <div className="space-y-6 p-6">
        <div className="rounded-[24px] bg-secondary px-4 py-3 text-white">
          <div className="inline-flex rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
            {content.emergencyLabel}
          </div>
          <p className="mt-3 text-sm leading-6 text-white/90">{content.emergencyText}</p>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-secondary/10">
          <img src={content.heroImage} alt="Hero preview" className="h-56 w-full object-cover" />
          <div className="space-y-4 p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">{content.heroEyebrow}</div>
            <h2 className="text-3xl font-bold text-gray-950">{content.heroTitle}</h2>
            <p className="text-sm leading-6 text-gray-700">{content.heroDescription}</p>
            <div className="flex flex-wrap gap-3">
              <div className="rounded-button bg-primary px-4 py-2 text-sm font-semibold text-white">{content.primaryCta}</div>
              <div className="rounded-button border border-secondary/16 px-4 py-2 text-sm font-semibold text-secondary">{content.secondaryCta}</div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="overflow-hidden rounded-[28px] border border-secondary/10">
            <img src={content.supportImage} alt="Support preview" className="h-full min-h-[220px] w-full object-cover" />
          </div>
          <div className="rounded-[28px] border border-primary/14 bg-primary/6 p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{content.featuredLabel}</div>
            <h3 className="mt-3 text-2xl font-bold text-gray-950">{content.featuredTitle}</h3>
            <p className="mt-3 text-sm leading-6 text-gray-700">{content.featuredDescription}</p>
          </div>
        </div>

        <div className="rounded-[28px] border border-secondary/10 bg-[#f7fbf4] p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Piliers</div>
          <p className="mt-2 text-sm text-gray-600">{content.pillars.length} piliers · {content.entryPoints.length} points d&apos;entree</p>
        </div>

        <div className="rounded-[28px] border border-secondary/10 bg-white p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Newsletter</div>
          <h3 className="mt-3 text-2xl font-bold text-gray-950">{content.newsletterTitle}</h3>
          <p className="mt-3 text-sm leading-6 text-gray-700">{content.newsletterDescription}</p>
        </div>
      </div>
    </div>
  );
}
