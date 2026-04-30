"use client";

import Link from "next/link";
import { mockAdminDashboard } from "@/lib/mock-data/admin";

export function DashboardOverview() {
  return (
    <section className="space-y-8">
      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="rounded-[34px] bg-[linear-gradient(135deg,_#ffffff_0%,_#fff8ef_54%,_#f7fbf4_100%)] p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] ring-1 ring-secondary/10">
          <div className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Vue d&apos;ensemble</div>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-gray-950">Un dashboard plus simple, avec un vrai parcours pas a pas.</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600">
            Pour un utilisateur non technique, le plus important n&apos;est pas d&apos;avoir beaucoup d&apos;options. Le plus important est de savoir par quoi commencer.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard/content"
              className="rounded-button bg-primary px-5 py-3 text-center text-sm font-semibold text-white shadow-[0_14px_32px_rgba(239,146,33,0.22)] transition hover:-translate-y-0.5 hover:bg-orange-500"
            >
              Commencer par les pages
            </Link>
            <Link
              href="/dashboard/content/home"
              className="rounded-button border border-secondary/16 bg-white px-5 py-3 text-center text-sm font-semibold text-secondary transition hover:bg-secondary/6"
            >
              Modifier l&apos;accueil
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          {mockAdminDashboard.alerts.map((alert) => (
            <div key={alert.title} className="rounded-[28px] bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.06)] ring-1 ring-secondary/10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-bold text-gray-950">{alert.title}</div>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{alert.detail}</p>
                </div>
                <span
                  className={`mt-1 inline-flex h-3 w-3 rounded-full ${
                    alert.tone === "warning" ? "bg-primary" : alert.tone === "success" ? "bg-secondary" : "bg-gray-300"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[32px] bg-white p-7 shadow-[0_16px_44px_rgba(15,23,42,0.06)] ring-1 ring-secondary/10">
        <div className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-secondary">Par ou commencer</div>
        <div className="grid gap-4 md:grid-cols-3">
          {mockAdminDashboard.workflow.map((item) => (
            <div key={item.step} className="rounded-[24px] bg-[#f7fbf4] p-5">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-white">
                {item.step}
              </div>
              <div className="text-lg font-bold text-gray-950">{item.title}</div>
              <div className="mt-2 text-sm leading-6 text-gray-600">{item.text}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {mockAdminDashboard.stats.map((stat, index) => (
          <div key={stat.label} className="rounded-[28px] bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.06)] ring-1 ring-secondary/10">
            <div className="flex items-start justify-between gap-4">
              <div className="text-sm text-gray-500">{stat.label}</div>
              <div className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${index % 2 === 0 ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"}`}>
                Apercu
              </div>
            </div>
            <div className="mt-4 text-3xl font-bold text-gray-950">{stat.value}</div>
            <div className="mt-2 text-sm text-gray-500">{stat.note}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.98fr_1.02fr]">
        <div className="rounded-[32px] bg-white p-7 shadow-[0_16px_44px_rgba(15,23,42,0.06)] ring-1 ring-secondary/10">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">Actions rapides</div>
              <h2 className="mt-2 text-3xl font-bold text-gray-950">Aller a l&apos;essentiel</h2>
            </div>
            <div className="rounded-full bg-[#f7fbf4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
              Recommande
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {mockAdminDashboard.quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="rounded-[24px] border border-secondary/10 bg-[#fcfdfb] p-5 transition hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(15,23,42,0.06)]"
              >
                <div className="text-lg font-bold text-gray-950">{action.title}</div>
                <p className="mt-2 text-sm leading-6 text-gray-600">{action.detail}</p>
                <div className="mt-4 text-sm font-semibold text-primary">Ouvrir</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] bg-white p-7 shadow-[0_16px_44px_rgba(15,23,42,0.06)] ring-1 ring-secondary/10">
          <div className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-secondary">Activite recente</div>
          <div className="space-y-4">
            {mockAdminDashboard.recentActivity.map((item) => (
              <div key={`${item.title}-${item.time}`} className="flex items-start justify-between gap-4 rounded-[22px] bg-[#f7fbf4] px-4 py-4">
                <div>
                  <div className="font-semibold text-gray-950">{item.title}</div>
                  <div className="mt-1 text-sm text-gray-600">{item.detail}</div>
                </div>
                <div className="whitespace-nowrap text-xs font-semibold uppercase tracking-[0.16em] text-secondary">{item.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
