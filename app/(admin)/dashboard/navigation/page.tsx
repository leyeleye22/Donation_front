"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

type NavItemConfig = {
  href: string;
  label: string;
  enabled: boolean;
};

export default function AdminNavigationPage() {
  const [items, setItems] = useState<NavItemConfig[]>([]);
  const [saved, setSaved] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  useEffect(() => {
    api.getNavigation().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setItems(data.map((item: any) => ({
          href: item.href || item.path || "",
          label: item.label?.fr || item.label || "",
          enabled: item.enabled ?? item.visible ?? true,
        })));
      }
    });
  }, []);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 1800);
    return () => clearTimeout(t);
  }, [saved]);

  const save = useCallback(async (updated: NavItemConfig[]) => {
    setItems(updated);
    await api.updateNavigationOrder(updated.map((item, i) => ({
      id: item.href,
      sort_order: i,
    })));
    setSaved(true);
  }, []);

  function move(from: number, to: number) {
    const copy = [...items];
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved);
    save(copy);
  }

  function toggle(index: number) {
    const copy = items.map((item, i) => (i === index ? { ...item, enabled: !item.enabled } : item));
    save(copy);
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Navigation</h1>
          <p className="text-xs text-gray-500">Ordre, visibilit&eacute; et activation des pages du menu</p>
        </div>
        <div className="flex items-center gap-3">
          {saved ? <span className="text-xs font-semibold text-secondary">Enregistr&eacute;</span> : null}
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="grid grid-cols-[1fr_80px_80px] gap-4 border-b border-gray-50 px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          <span>Page</span>
          <span className="text-center">Visible</span>
          <span className="text-center">Trier</span>
        </div>

        <div className="divide-y divide-gray-50">
          {items.map((item, index) => (
            <div
              key={item.href}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => {
                e.preventDefault();
                if (dragIndex === null || dragIndex === index) return;
                move(dragIndex, index);
                setDragIndex(index);
              }}
              onDragEnd={() => setDragIndex(null)}
              className={`grid grid-cols-[1fr_80px_80px] gap-4 px-5 py-3 transition-colors ${
                dragIndex === index ? "opacity-50" : ""
              } ${!item.enabled ? "bg-gray-50" : ""}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="cursor-grab text-gray-300 hover:text-gray-500" title="Glisser pour déplacer">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                  </svg>
                </span>
                <span className={`text-sm ${item.enabled ? "text-gray-900" : "text-gray-400 line-through"}`}>
                  {item.label}
                </span>
                <span className="hidden rounded bg-gray-100 px-2 py-0.5 text-[10px] font-mono text-gray-400 sm:inline">{item.href}</span>
              </div>

              <div className="flex items-center justify-center">
                <button
                  onClick={() => toggle(index)}
                  className={`relative inline-flex h-5 w-9 cursor-pointer rounded-full transition-colors ${
                    item.enabled ? "bg-primary" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                      item.enabled ? "translate-x-[18px]" : "translate-x-[2px]"
                    } mt-0.5`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-center gap-1">
                <button
                  onClick={() => index > 0 && move(index, index - 1)}
                  disabled={index === 0}
                  className="rounded p-1 text-gray-300 transition-colors hover:text-gray-600 disabled:opacity-30"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => index < items.length - 1 && move(index, index + 1)}
                  disabled={index === items.length - 1}
                  className="rounded p-1 text-gray-300 transition-colors hover:text-gray-600 disabled:opacity-30"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-5">
        <p className="text-xs text-gray-500">
          <strong className="text-gray-700">Glisser-d&eacute;poser</strong> les lignes pour r&eacute;ordonner. Utilisez le toggle pour activer/d&eacute;sactiver une page.
          Les pages d&eacute;sactiv&eacute;es n&rsquo;apparaissent plus dans le menu du site.
        </p>
      </div>
    </section>
  );
}
