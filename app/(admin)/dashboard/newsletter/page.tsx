"use client";

import { api } from "@/lib/api";
import { useCallback, useEffect, useState } from "react";
import { AdminAlert } from "@/components/admin/ui/admin-alert";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { AdminEmptyState } from "@/components/admin/ui/admin-empty-state";
import { AdminPage } from "@/components/admin/ui/admin-page";
import { PageHeader } from "@/components/admin/ui/page-header";
import { StatCard } from "@/components/admin/ui/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format-date";
import { IconUsers } from "@/components/admin/icons";

type Subscriber = { id: string; email: string; name: string | null; is_active: boolean; subscribed_at: string; created_at: string };

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [stats, setStats] = useState({ total: 0, active: 0 });
  const [search, setSearch] = useState("");

  const load = useCallback(() => {
    api.getNewsletterSubscribers()
      .then((res) => {
        setSubscribers(res.data ?? []);
        setStats({ total: res.total ?? 0, active: res.active ?? 0 });
      })
      .catch((e) => { console.error("Newsletter: load", e); setError("Erreur chargement abonnes"); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cet abonne ?")) return;
    try {
      await api.deleteNewsletterSubscriber(id);
      load();
      setMsg("Abonne supprime");
    } catch (e: any) {
      setMsg(e.message || "Erreur suppression");
    }
  }

  async function handleExport() {
    const csv = ["email,name,date_inscription"]
      .concat(subscribers.map((s) => `${s.email},${s.name ?? ""},${s.subscribed_at ?? s.created_at}`))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "abonnes-newsletter.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = subscribers.filter((s) =>
    !search || s.email.toLowerCase().includes(search.toLowerCase()) || (s.name?.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <AdminPage className="space-y-6">
        <Skeleton className="h-28 rounded-2xl" />
        <div className="admin-kpi-grid">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </AdminPage>
    );
  }

  return (
    <AdminPage className="space-y-6">
      <PageHeader
        eyebrow="Relations & confiance"
        eyebrowAlt
        title="Abonnes newsletter"
        description="Communaute engagee autour de vos actions. Exportez la liste pour vos campagnes de communication."
        actions={<AdminButton variant="secondary" onClick={handleExport}>Exporter CSV</AdminButton>}
      />

      {msg ? <AdminAlert tone="success">{msg}</AdminAlert> : null}
      {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}

      <div className="admin-kpi-grid">
        <StatCard label="Total abonnes" value={String(stats.total)} accent="slate" icon={<IconUsers className="h-5 w-5" />} />
        <StatCard label="Actifs" value={String(stats.active)} accent="green" icon={<IconUsers className="h-5 w-5" />} trend={{ label: "Engagement", positive: stats.active > 0 }} />
        <StatCard label="Desabonnes" value={String(stats.total - stats.active)} accent="orange" icon={<IconUsers className="h-5 w-5" />} />
      </div>

      <input
        type="text"
        placeholder="Rechercher par email ou nom..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="admin-input"
      />

      {filtered.length === 0 ? (
        <AdminEmptyState
          title={search ? "Aucun resultat" : "Aucun abonne pour le moment"}
          description={search ? "Essayez un autre terme de recherche." : "Les inscriptions depuis le site public apparaitront ici."}
        />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Nom</th>
                <th>Statut</th>
                <th>Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td className="font-medium text-slate-900">{s.email}</td>
                  <td>{s.name || "—"}</td>
                  <td>
                    <span className={s.is_active ? "admin-badge-success" : "admin-badge-danger"}>
                      {s.is_active ? "Actif" : "Desabonne"}
                    </span>
                  </td>
                  <td className="text-slate-500">{formatDate(s.subscribed_at ?? s.created_at)}</td>
                  <td className="text-right">
                    <AdminButton variant="danger" className="px-3 py-1.5 text-xs" onClick={() => handleDelete(s.id)}>
                      Supprimer
                    </AdminButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminPage>
  );
}
