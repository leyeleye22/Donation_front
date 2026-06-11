"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { AdminEmptyState } from "@/components/admin/ui/admin-empty-state";
import { AdminPage } from "@/components/admin/ui/admin-page";
import { PageHeader } from "@/components/admin/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadMessages() {
    setLoading(true);
    try {
      const res = await api.getContactMessages();
      setMessages(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, []);

  async function markRead(id: string) {
    await api.markContactMessageRead(id);
    loadMessages();
  }

  async function removeMessage(id: string) {
    if (!confirm("Supprimer ce message ?")) return;
    await api.deleteContactMessage(id);
    loadMessages();
  }

  const unread = messages.filter((m) => !m.is_read).length;

  return (
    <AdminPage>
      <PageHeader
        eyebrow="Relations & confiance"
        eyebrowAlt
        title="Messages de contact"
        description="Demandes recues via le formulaire public. Repondre rapidement renforce la confiance des visiteurs et partenaires."
        meta={
          <>
            <span className={unread > 0 ? "admin-badge-warning" : "admin-badge-success"}>
              {unread > 0 ? `${unread} non lu(s)` : "Boite a jour"}
            </span>
            <span className="admin-badge-neutral">{messages.length} message(s)</span>
          </>
        }
      />

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <AdminEmptyState
          title="Aucun message pour le moment"
          description="Les visiteurs qui ecrivent via la page Contact apparaitront ici."
        />
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <AdminCard
              key={message.id}
              className={!message.is_read ? "border-primary/25 bg-orange-50/20" : ""}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{message.name}</h3>
                    {!message.is_read ? <span className="admin-badge-warning">Nouveau</span> : null}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{message.email}</p>
                  {message.subject ? (
                    <p className="mt-2 text-sm font-medium text-slate-700">{message.subject}</p>
                  ) : null}
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">{message.message}</p>
                  <p className="mt-3 text-xs text-slate-400">
                    {new Date(message.created_at).toLocaleString("fr-FR")}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {!message.is_read ? (
                    <AdminButton variant="ghost" onClick={() => markRead(message.id)}>
                      Marquer lu
                    </AdminButton>
                  ) : null}
                  <AdminButton variant="danger" onClick={() => removeMessage(message.id)}>
                    Supprimer
                  </AdminButton>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </AdminPage>
  );
}
