"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { AdminPage } from "@/components/admin/ui/admin-page";
import { StatCard } from "@/components/admin/ui/stat-card";
import {
  IconChart,
  IconDocument,
  IconFolder,
  IconHeart,
  IconMail,
  IconUsers,
} from "@/components/admin/icons";

type ChecklistStatus = "ok" | "warning" | "critical" | "info";

type ChecklistItem = {
  id: string;
  title: string;
  status: ChecklistStatus;
  metric: string;
  href: string;
};

type PriorityProject = {
  id: string;
  slug: string;
  title: string;
  theme: string;
  progress: number;
  goal_amount: number;
  collected_amount: number;
  funding_gap: number;
  beneficiary_label?: string | null;
};

type DonationByProject = {
  id: string;
  slug: string;
  title: string;
  theme: string;
  status: string;
  goal_amount: number;
  collected_amount: number;
  donations_count: number;
  donations_amount: number;
  progress: number;
};

type DonationsThisMonth = {
  count: number;
  amount: number;
  month_label: string;
};

type DashboardData = {
  kpis: {
    label: string;
    value: string;
    hint?: string;
    trend?: { label: string; positive?: boolean };
    accent: "orange" | "green" | "slate" | "blue";
    icon: ReactNode;
  }[];
  projectStats: {
    total: number;
    ongoing: number;
    completed: number;
    upcoming: number;
    totalFundingGoal: number;
    totalFundingCollected: number;
    fundingGap: number;
    byTheme: { theme: string; count: number; label: string }[];
  };
  communication: {
    publishedPosts: number;
    postsDraft: number;
    newsletterCount: number;
    unreadMessages: number;
    totalMessages: number;
    galleryItems: number;
    daysSinceLastPost: number | null;
  };
  finance: {
    totalDonations: number;
    totalDonationAmount: number;
    progressPct: number;
    donationsThisMonth: DonationsThisMonth;
  };
  donationsByProject: DonationByProject[];
  priorityProjects: PriorityProject[];
  operationalChecklist: ChecklistItem[];
  recentActivity: { title: string; detail: string; time: string; href?: string }[];
};

const statusLabels: Record<string, string> = {
  ongoing: "En cours",
  completed: "Accompli",
  upcoming: "A venir",
};

const themeLabels: Record<string, string> = {
  education: "Education",
  water: "Eau potable",
  health: "Sante",
  tabaski: "Tabaski",
  food: "Alimentation",
};

const themeBarColors: Record<string, string> = {
  water: "bg-sky-500",
  education: "bg-violet-500",
  health: "bg-secondary",
  tabaski: "bg-primary",
  food: "bg-amber-500",
};

const checklistStyles: Record<ChecklistStatus, { dot: string; badge: string }> = {
  ok: { dot: "bg-secondary", badge: "bg-green-50 text-secondary ring-green-100" },
  warning: { dot: "bg-primary", badge: "bg-orange-50 text-primary ring-orange-100" },
  critical: { dot: "bg-red-500", badge: "bg-red-50 text-red-700 ring-red-100" },
  info: { dot: "bg-sky-500", badge: "bg-sky-50 text-sky-700 ring-sky-100" },
};

function formatFcfa(amount: number) {
  return `${amount.toLocaleString("fr-FR")} FCFA`;
}

function mapKpi(res: Record<string, unknown>): DashboardData {
  const totalGoal = Number(res.total_goal ?? 0);
  const totalCollected = Number(res.total_collected ?? 0);
  const progressPct = Number(res.collected_percentage ?? 0);
  const fundingGap = Number(res.funding_gap ?? Math.max(0, totalGoal - totalCollected));

  const byTheme = Array.isArray(res.projects_by_theme)
    ? (res.projects_by_theme as { theme: string; count: number }[]).map((item) => ({
        theme: item.theme,
        count: item.count,
        label: themeLabels[item.theme] || item.theme,
      }))
    : [];

  const recentActivity = Array.isArray(res.recent_activity)
    ? (res.recent_activity as { title: string; detail: string; time: string; href?: string }[])
    : [];

  const priorityProjects = Array.isArray(res.priority_projects)
    ? (res.priority_projects as PriorityProject[])
    : [];

  const operationalChecklist = Array.isArray(res.operational_checklist)
    ? (res.operational_checklist as { id: string; title: string; status: ChecklistStatus; metric: string; href: string }[])
    : [];

  const totalProjects = Number(res.total_projects ?? 0);
  const ongoingProjects = Number(res.ongoing_projects ?? 0);
  const completedProjects = Number(res.completed_projects ?? 0);
  const publishedPosts = Number(res.published_posts ?? 0);
  const postsDraft = Number(res.posts_draft ?? 0);
  const newsletterCount = Number(res.newsletter_subscribers ?? 0);
  const unreadMessages = Number(res.unread_contact_messages ?? 0);
  const totalMessages = Number(res.total_contact_messages ?? 0);
  const galleryItems = Number(res.gallery_items ?? 0);
  const totalDonations = Number(res.total_donations ?? 0);
  const totalDonationAmount = Number(res.total_donation_amount ?? 0);
  const donationsThisMonthRaw = res.donations_this_month as
    | { count?: number; amount?: number; month_label?: string }
    | undefined;
  const donationsThisMonth: DonationsThisMonth = {
    count: Number(donationsThisMonthRaw?.count ?? 0),
    amount: Number(donationsThisMonthRaw?.amount ?? 0),
    month_label: donationsThisMonthRaw?.month_label ?? "Ce mois",
  };
  const donationsByProject = Array.isArray(res.donations_by_project)
    ? (res.donations_by_project as DonationByProject[])
    : [];
  const daysSinceLastPost =
    res.days_since_last_post === null || res.days_since_last_post === undefined
      ? null
      : Number(res.days_since_last_post);

  return {
    kpis: [
      {
        label: "Projets",
        value: String(totalProjects),
        hint: `${ongoingProjects} en cours · ${completedProjects} accomplis`,
        accent: "orange",
        icon: <IconFolder className="h-5 w-5" />,
      },
      {
        label: "Dons du mois",
        value: formatFcfa(donationsThisMonth.amount),
        hint: `${donationsThisMonth.count} don(s) · ${donationsThisMonth.month_label}`,
        accent: "green",
        icon: <IconHeart className="h-5 w-5" />,
      },
      {
        label: "Collecte globale",
        value: `${progressPct}%`,
        hint: formatFcfa(totalCollected),
        trend: fundingGap > 0 ? { label: `Reste ${formatFcfa(fundingGap)}`, positive: progressPct >= 50 } : undefined,
        accent: "blue",
        icon: <IconChart className="h-5 w-5" />,
      },
      {
        label: "Total des dons",
        value: String(totalDonations),
        hint: formatFcfa(totalDonationAmount),
        accent: "slate",
        icon: <IconUsers className="h-5 w-5" />,
      },
    ],
    projectStats: {
      total: totalProjects,
      ongoing: ongoingProjects,
      completed: completedProjects,
      upcoming: Math.max(0, totalProjects - ongoingProjects - completedProjects),
      totalFundingGoal: totalGoal,
      totalFundingCollected: totalCollected,
      fundingGap,
      byTheme,
    },
    communication: {
      publishedPosts,
      postsDraft,
      newsletterCount,
      unreadMessages,
      totalMessages,
      galleryItems,
      daysSinceLastPost,
    },
    finance: {
      totalDonations,
      totalDonationAmount,
      progressPct,
      donationsThisMonth,
    },
    donationsByProject,
    priorityProjects,
    operationalChecklist,
    recentActivity,
  };
}

function DashboardLoading() {
  return (
    <section className="space-y-6">
      <Skeleton className="h-28 rounded-2xl" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    </section>
  );
}

export function DashboardOverview() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.getDashboardKpi();
      setData(mapKpi(res));
    } catch (e) {
      console.error("DashboardOverview: failed to load KPI", e);
      setError("Impossible de charger les indicateurs.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading) return <AdminPage><DashboardLoading /></AdminPage>;

  if (error || !data) {
    return (
      <AdminPage>
        <AdminCard padding="lg" className="border-red-100 bg-red-50/50">
          <p className="text-sm text-red-700">{error || "Erreur de chargement."}</p>
          <button type="button" onClick={loadDashboard} className="btn-primary btn-sm mt-4">
            Reessayer
          </button>
        </AdminCard>
      </AdminPage>
    );
  }

  const { kpis, projectStats, communication, finance, donationsByProject, priorityProjects, operationalChecklist, recentActivity } =
    data;
  const maxThemeCount = Math.max(1, ...projectStats.byTheme.map((t) => t.count));
  const alertsOnly = operationalChecklist.filter((item) => item.status !== "ok");

  return (
    <AdminPage className="space-y-6">
      <AdminCard padding="lg" className="overflow-hidden border-0 bg-gradient-to-br from-primary via-orange-500 to-secondary text-white shadow-warm-lg">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { value: projectStats.total, label: "Projets" },
            { value: projectStats.ongoing, label: "En cours" },
            { value: formatFcfa(finance.donationsThisMonth.amount), label: "Dons du mois" },
            { value: finance.donationsThisMonth.count, label: "Nb dons ce mois" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl bg-white/12 px-4 py-3 ring-1 ring-white/15">
              <div className="text-2xl font-bold">{item.value}</div>
              <div className="text-[11px] font-medium uppercase tracking-wide text-white/75">{item.label}</div>
            </div>
          ))}
        </div>
      </AdminCard>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <StatCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            hint={kpi.hint}
            icon={kpi.icon}
            trend={kpi.trend}
            accent={kpi.accent}
          />
        ))}
      </div>

      <AdminCard padding="lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Dons par projet</h3>
            <p className="mt-0.5 text-sm text-gray-500">
              {finance.donationsThisMonth.month_label} · {formatFcfa(finance.donationsThisMonth.amount)} ce mois
            </p>
          </div>
          <Link href="/dashboard/projects" className="btn-outline btn-sm">
            Gerer les projets
          </Link>
        </div>

        {donationsByProject.length === 0 ? (
          <p className="mt-5 text-sm text-gray-500">Aucun projet enregistre.</p>
        ) : (
          <div className="admin-table-wrap mt-4">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Projet</th>
                  <th>Statut</th>
                  <th className="text-right">Dons</th>
                  <th className="text-right">Montant dons</th>
                  <th className="text-right">Collecte</th>
                  <th className="text-right">Objectif</th>
                  <th className="text-right">Progression</th>
                </tr>
              </thead>
              <tbody>
                {donationsByProject.map((project) => (
                  <tr key={project.id}>
                    <td>
                      <div className="font-medium text-gray-900">{project.title}</div>
                      <div className="text-xs text-gray-500">{themeLabels[project.theme] || project.theme}</div>
                    </td>
                    <td>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          project.status === "ongoing"
                            ? "bg-orange-50 text-primary ring-1 ring-orange-100"
                            : project.status === "completed"
                              ? "bg-green-50 text-secondary ring-1 ring-green-100"
                              : "bg-gray-50 text-gray-600 ring-1 ring-gray-100"
                        }`}
                      >
                        {statusLabels[project.status] || project.status}
                      </span>
                    </td>
                    <td className="text-right font-semibold text-gray-900">{project.donations_count}</td>
                    <td className="text-right font-semibold text-secondary">{formatFcfa(project.donations_amount)}</td>
                    <td className="text-right text-gray-700">{formatFcfa(project.collected_amount)}</td>
                    <td className="text-right text-gray-500">{formatFcfa(project.goal_amount)}</td>
                    <td className="text-right">
                      <span className="font-bold text-primary">{project.progress}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <AdminCard padding="lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-gray-900">Collecte</h3>
            <Link href="/dashboard/projects" className="btn-outline btn-sm">
              Projets
            </Link>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              { label: "En cours", value: projectStats.ongoing, style: "border-primary/20 bg-orange-50 text-primary" },
              { label: "Accomplis", value: projectStats.completed, style: "border-secondary/20 bg-green-50 text-secondary" },
              { label: "A venir", value: projectStats.upcoming, style: "border-gray-200 bg-gray-50 text-gray-600" },
            ].map((item) => (
              <div key={item.label} className={`rounded-2xl border p-4 ${item.style}`}>
                <div className="text-xs font-semibold uppercase tracking-wider">{item.label}</div>
                <div className="mt-2 text-3xl font-bold text-gray-900">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-primary/10 bg-gradient-to-r from-orange-50/80 to-green-50/50 p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">Progression</span>
              <span className="text-lg font-bold text-gray-900">{finance.progressPct}%</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/80 ring-1 ring-gray-200/80">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary via-orange-400 to-secondary transition-all duration-700"
                style={{ width: `${Math.min(finance.progressPct, 100)}%` }}
              />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3 text-sm">
              <div>
                <div className="text-xs text-gray-500">Collecte</div>
                <div className="font-semibold text-gray-900">{formatFcfa(projectStats.totalFundingCollected)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Objectif</div>
                <div className="font-semibold text-gray-900">{formatFcfa(projectStats.totalFundingGoal)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Reste</div>
                <div className="font-semibold text-primary">{formatFcfa(projectStats.fundingGap)}</div>
              </div>
            </div>
          </div>
        </AdminCard>

        {alertsOnly.length > 0 ? (
          <AdminCard padding="lg">
            <h3 className="text-lg font-bold text-gray-900">A traiter</h3>
            <div className="mt-4 space-y-2">
              {alertsOnly.map((item) => {
                const styles = checklistStyles[item.status];
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3 transition hover:bg-white"
                  >
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${styles.dot}`} />
                    <span className="flex-1 text-sm font-medium text-gray-900">{item.title}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${styles.badge}`}>
                      {item.metric}
                    </span>
                  </Link>
                );
              })}
            </div>
          </AdminCard>
        ) : null}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <AdminCard padding="lg">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-gray-900">Projets prioritaires</h3>
            <Link href="/dashboard/projects" className="text-xs font-semibold text-secondary hover:underline">
              Voir tout
            </Link>
          </div>

          {priorityProjects.length === 0 ? (
            <p className="mt-5 text-sm text-gray-500">Aucun projet actif.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {priorityProjects.map((project) => (
                <div key={project.id} className="rounded-xl border border-gray-100 bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-secondary">
                        {themeLabels[project.theme] || project.theme}
                      </div>
                      <div className="mt-1 font-semibold text-gray-900">{project.title}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{project.progress}%</div>
                      <div className="text-[11px] text-gray-500">{formatFcfa(project.funding_gap)} restants</div>
                    </div>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                      style={{ width: `${Math.min(project.progress, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>

        <AdminCard padding="lg">
          <h3 className="text-lg font-bold text-gray-900">Par theme</h3>
          {projectStats.byTheme.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">—</p>
          ) : (
            <div className="mt-4 space-y-4">
              {projectStats.byTheme.map((theme) => (
                <div key={theme.theme}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{theme.label}</span>
                    <span className="font-semibold text-gray-900">{theme.count}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${themeBarColors[theme.theme] || "bg-primary"}`}
                      style={{ width: `${(theme.count / maxThemeCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Messages",
            value: communication.totalMessages,
            sub: communication.unreadMessages > 0 ? `${communication.unreadMessages} non lu(s)` : undefined,
            href: "/dashboard/messages",
            icon: <IconMail className="h-5 w-5" />,
            accent: communication.unreadMessages > 0 ? "border-primary/20 bg-orange-50" : "border-secondary/20 bg-green-50",
          },
          {
            label: "Newsletter",
            value: communication.newsletterCount,
            href: "/dashboard/newsletter",
            icon: <IconUsers className="h-5 w-5" />,
            accent: "border-sky-200 bg-sky-50",
          },
          {
            label: "Journal",
            value: communication.publishedPosts,
            sub: communication.postsDraft > 0 ? `${communication.postsDraft} brouillon(s)` : undefined,
            href: "/dashboard/journal",
            icon: <IconDocument className="h-5 w-5" />,
            accent: "border-violet-200 bg-violet-50",
          },
          {
            label: "Galerie",
            value: communication.galleryItems,
            href: "/dashboard/gallery",
            icon: <IconFolder className="h-5 w-5" />,
            accent: "border-amber-200 bg-amber-50",
          },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`admin-surface rounded-2xl border p-4 transition hover:-translate-y-0.5 ${item.accent}`}
          >
            <div className="flex items-center gap-2 text-gray-700">
              {item.icon}
              <span className="text-sm font-semibold">{item.label}</span>
            </div>
            <div className="mt-3 text-3xl font-bold text-gray-900">{item.value}</div>
            {item.sub ? <div className="mt-1 text-xs text-gray-500">{item.sub}</div> : null}
          </Link>
        ))}
      </div>

      {recentActivity.length > 0 ? (
        <AdminCard padding="lg">
          <h3 className="text-lg font-bold text-gray-900">Activite recente</h3>
          <div className="mt-4 space-y-2">
            {recentActivity.map((item) => (
              <div key={`${item.title}-${item.time}`} className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 px-3 py-2.5 text-sm">
                <span className="font-medium text-gray-900">{item.title}</span>
                <span className="shrink-0 text-xs text-gray-400">{item.time}</span>
              </div>
            ))}
          </div>
        </AdminCard>
      ) : null}
    </AdminPage>
  );
}
