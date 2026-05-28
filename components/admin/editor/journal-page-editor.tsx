"use client";

import { useEffect, useState } from "react";
import { posts as defaultPosts } from "@/lib/mock-data/posts";
import type { Post } from "@/lib/types";

const STORAGE_KEY = "entraide-admin-journal";

const categoryLabels: Record<string, string> = { terrain: "Terrain", "project-update": "Projet", association: "Association" };
const categoryColors: Record<string, string> = { terrain: "bg-blue-100 text-blue-700", "project-update": "bg-amber-100 text-amber-700", association: "bg-purple-100 text-purple-700" };

export function JournalPageEditor() {
  const [posts, setPosts] = useState<Post[]>(defaultPosts);
  const [saved, setSaved] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Post | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try { setPosts(JSON.parse(raw) as Post[]); } catch { localStorage.removeItem(STORAGE_KEY); }
  }, []);

  useEffect(() => { if (!saved) return; const t = setTimeout(() => setSaved(false), 1800); return () => clearTimeout(t); }, [saved]);

  function persist(updated: Post[]) {
    setPosts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSaved(true);
  }

  function startEdit(p: Post) {
    setEditId(p.id);
    setDraft(JSON.parse(JSON.stringify(p)));
  }

  function cancelEdit() {
    setEditId(null);
    setDraft(null);
  }

  function saveEdit() {
    if (!draft) return;
    persist(posts.map((p) => (p.id === draft.id ? draft : p)));
    setEditId(null);
    setDraft(null);
  }

  function handleDelete(id: string) {
    if (!confirm("Supprimer cet article ?")) return;
    persist(posts.filter((p) => p.id !== id));
  }

  function togglePublish(id: string) {
    persist(posts.map((p) => (p.id === id ? { ...p, published: !p.published } : p)));
  }

  const publishedCount = posts.filter((p) => p.published).length;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Journal</h1>
          <p className="text-xs text-gray-500">{posts.length} articles · {publishedCount} publiés</p>
        </div>
        {saved ? <span className="text-xs font-semibold text-secondary">Enregistré</span> : null}
      </div>

      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="rounded-xl border border-gray-100 bg-white shadow-sm">
            {editId === post.id && draft ? (
              <div className="space-y-4 p-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">Titre (fr)</label>
                    <input value={draft.title.fr} onChange={(e) => setDraft({ ...draft, title: { ...draft.title, fr: e.target.value } })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">Slug</label>
                    <input value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">Extrait (fr)</label>
                  <textarea value={draft.excerpt.fr} onChange={(e) => setDraft({ ...draft, excerpt: { ...draft.excerpt, fr: e.target.value } })} rows={2} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">Contenu (fr)</label>
                  <textarea value={draft.content.fr} onChange={(e) => setDraft({ ...draft, content: { ...draft.content, fr: e.target.value } })} rows={3} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">Catégorie</label>
                    <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as Post["category"] })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15">
                      <option value="terrain">Terrain</option>
                      <option value="project-update">Projet</option>
                      <option value="association">Association</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">Image</label>
                    <input value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">Localisation</label>
                    <input value={draft.location.fr} onChange={(e) => setDraft({ ...draft, location: { ...draft.location, fr: e.target.value } })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={saveEdit} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:brightness-90">Enregistrer</button>
                  <button onClick={cancelEdit} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50">Annuler</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 p-4">
                <img src={post.image} alt="" className="h-14 w-14 flex-shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${post.published ? "bg-secondary" : "bg-gray-300"}`} />
                    <span className="truncate text-sm font-semibold text-gray-900">{post.title.fr}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${categoryColors[post.category]}`}>{categoryLabels[post.category]}</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">{post.createdAt} · {post.location.fr} · {post.readTime}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => togglePublish(post.id)} className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${post.published ? "border-gray-200 text-gray-600 hover:bg-gray-50" : "border-secondary/30 text-secondary hover:bg-secondary/6"}`}>
                    {post.published ? "Masquer" : "Publier"}
                  </button>
                  <button onClick={() => startEdit(post)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50">Modifier</button>
                  <button onClick={() => handleDelete(post.id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50">Supprimer</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
