"use client";

import { useEffect, useState } from "react";
import { resolveImageUrl } from "@/lib/image-url";

const knownImages = [
  "/assets/logo.png", "/assets/banner.jpeg", "/assets/about.jpeg", "/assets/whats.jpeg",
  "/assets/consultation.jpeg", "/assets/education.jpeg", "/assets/educationn.jpeg",
  "/assets/classe.jpeg", "/assets/puits.jpeg", "/assets/1.jpeg", "/assets/3.jpeg",
  "/assets/partenaire.jpeg", "/assets/alimentaire.jpeg"
];

type MediaItem = { path: string; name: string; valid: boolean };

export function MediaLibraryEditor() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [viewer, setViewer] = useState<string | null>(null);

  useEffect(() => {
    setItems(knownImages.map((path) => ({
      path,
      name: path.split("/").pop() || path,
      valid: true
    })));
  }, []);

  function handleUpload() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = () => {
      const files = Array.from(input.files || []).filter((f) => f.type.startsWith("image/"));
      let loaded = 0;
      const newItems: MediaItem[] = files.map((f) => ({ path: "", name: f.name, valid: true }));
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newItems[i].path = e.target?.result as string;
          loaded++;
          if (loaded === files.length) {
            setItems((prev) => [...newItems, ...prev]);
          }
        };
        reader.readAsDataURL(files[i]);
      }
    };
    input.click();
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Bibliothèque media</h1>
          <p className="text-xs text-gray-500">{items.length} fichiers</p>
        </div>
        <button onClick={handleUpload} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:brightness-90">
          + Ajouter
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {items.map((item, i) => (
          <div key={i} className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="aspect-square overflow-hidden">
              <img
                src={resolveImageUrl(item.path)}
                alt={item.name}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
              <button onClick={() => setViewer(item.path)} className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-lg">Voir</button>
            </div>
            <div className="truncate px-2.5 py-2 text-xs text-gray-500">{item.name}</div>
          </div>
        ))}
      </div>

      {viewer ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setViewer(null)}>
          <div className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <img src={resolveImageUrl(viewer)} alt="" className="max-h-[80vh] w-full object-contain" />
            <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
              <span className="text-xs text-gray-500">{viewer}</span>
              <button onClick={() => setViewer(null)} className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">Fermer</button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
