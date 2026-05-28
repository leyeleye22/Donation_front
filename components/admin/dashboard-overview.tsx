"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

type DashboardData = {
  kpis: { label: string; value: string; trend: string; trendUp: boolean }[];
  projectStats: {
    total: number; ongoing: number; completed: number; upcoming: number;
    totalFundingGoal: number; totalFundingCollected: number;
    byTheme: { theme: string; count: number; color: string }[];
  };
  alerts: { title: string; detail: string; tone: string }[];
  quickActions: { title: string; detail: string; href: string }[];
  recentActivity: { title: string; detail: string; time: string }[];
};

export function DashboardOverview() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    api.getDashboardKpi().then((res) => setData(res)).catch(() => {});
  }, []);

  if (!data) {
    return (
      <section className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-3 text-sm text-gray-500">Chargement...</p>
        </div>
      </section>
    );
  }

  const { kpis, projectStats, alerts, quickActions, recentActivity } = data;
  const progressPct = projectStats.totalFundingGoal > 0
    ? Math.round((projectStats.totalFundingCollected / projectStats.totalFundingGoal) * 100)
    : 0;

  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">{kpi.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                  kpi.trendUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                }`}
              >
                {kpi.trend}
              </span>
            </div>
            <div className="mt-3 text-2xl font-bold text-gray-900">{kpi.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Portefeuille projets</span>
              <h2 className="mt-1 text-xl font-bold text-gray-900">{projectStats.total} projets</h2>
            </div>
            <Link
              href="/dashboard/projects"
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              G&eacute;rer
            </Link>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-orange-100 bg-orange-50/50 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">En cours</div>
              <div className="mt-2 text-3xl font-bold text-gray-900">{projectStats.ongoing}</div>
            </div>
            <div className="rounded-lg border border-green-100 bg-green-50/50 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-secondary">Accomplis</div>
              <div className="mt-2 text-3xl font-bold text-gray-900">{projectStats.completed}</div>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">A venir</div>
              <div className="mt-2 text-3xl font-bold text-gray-900">{projectStats.upcoming}</div>
            </div>
          </div>

          <div className="mt-5 rounded-lg bg-gray-50 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-600">Collecte globale</span>
              <span className="font-bold text-gray-900">{progressPct}%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <span>{projectStats.totalFundingCollected.toLocaleString("fr-FR")} FCFA</span>
              <span>Objectif: {projectStats.totalFundingGoal.toLocaleString("fr-FR")} FCFA</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {projectStats.byTheme.map((theme) => (
              <span
                key={theme.theme}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  theme.color === "primary" ? "bg-orange-50 text-primary" : "bg-green-50 text-secondary"
                }`}
              >
                {theme.theme} ({theme.count})
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.title} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-gray-900">{alert.title}</div>
                  <p className="mt-1 text-sm text-gray-500">{alert.detail}</p>
                </div>
                <span
                  className={`mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full ${
                    alert.tone === "warning" ? "bg-primary" : alert.tone === "success" ? "bg-secondary" : "bg-gray-300"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Actions rapides</span>
              <h2 className="mt-1 text-xl font-bold text-gray-900">T&acirc;ches courantes</h2>
            </div>
            <Link
              href="/dashboard/content"
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              Voir tout
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="rounded-lg border border-gray-100 bg-gray-50/50 p-4 transition-colors hover:border-gray-200 hover:bg-gray-50"
              >
                <div className="font-semibold text-gray-900">{action.title}</div>
                <p className="mt-1 text-sm text-gray-500">{action.detail}</p>
                <div className="mt-3 text-xs font-semibold text-primary">Acc&eacute;der</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Activit&eacute; r&eacute;cente</span>
          <div className="mt-4 space-y-3">
            {recentActivity.map((item) => (
              <div key={`${item.title}-${item.time}`} className="flex items-start justify-between gap-3 rounded-lg bg-gray-50 px-4 py-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-900">{item.title}</div>
                  <div className="mt-0.5 text-xs text-gray-500">{item.detail}</div>
                </div>
                <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-wider text-gray-400">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
