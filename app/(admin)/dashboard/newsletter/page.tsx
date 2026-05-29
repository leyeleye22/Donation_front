"use client";

import { api } from "@/lib/api";
import { useCallback, useEffect, useState } from "react";

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
      console.error("Newsletter: delete", e);
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

  if (loading) return <div className="p-4 text-gray-500">Chargement...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Abonnes a la newsletter</h2>
          <p className="text-sm text-gray-500">Gerez les abonnes a la newsletter</p>
        </div>
        <button onClick={handleExport} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Exporter CSV
        </button>
      </div>

      {msg && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{msg}</div>}
      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-500">Total abonnes</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          <p className="text-sm text-gray-500">Abonnes actifs</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-2xl font-bold text-red-600">{stats.total - stats.active}</p>
          <p className="text-sm text-gray-500">Desabonnes</p>
        </div>
      </div>

      <input
        type="text" placeholder="Rechercher par email ou nom..."
        value={search} onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
      />

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">{search ? "Aucun resultat" : "Aucun abonne pour le moment."}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Nom</th>
                <th className="px-5 py-3">Statut</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-900">{s.email}</td>
                  <td className="px-5 py-3 text-gray-600">{s.name || "-"}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${s.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {s.is_active ? "Actif" : "Desabonne"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{new Date(s.subscribed_at ?? s.created_at).toLocaleDateString("fr-FR")}</td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => handleDelete(s.id)} className="rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50">
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
