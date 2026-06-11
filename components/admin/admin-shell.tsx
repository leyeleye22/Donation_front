"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminBreadcrumbs } from "@/components/admin/admin-breadcrumbs";
import { adminLogout } from "@/lib/admin-auth";
import { adminNavigation } from "@/lib/admin/navigation";
import { assetUrl } from "@/lib/config";
import { api } from "@/lib/api";
import { IconExternal, IconMenu, IconX } from "@/components/admin/icons";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("Administrateur");

  useEffect(() => {
    if (pathname === "/login") return;
    api.getMe().then((user) => {
      if (user?.name) setUserName(user.name);
    }).catch(() => {});
  }, [pathname]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  async function handleLogout() {
    try {
      await adminLogout();
    } catch {}
    router.push("/login");
    router.refresh();
  }

  if (pathname === "/login") {
    return <>{children}</>;
  }

  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <div className="admin-shell min-h-screen bg-[var(--admin-bg)]">
      {sidebarOpen ? (
        <button
          type="button"
          aria-label="Fermer le menu"
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-slate-200/80 bg-white shadow-[4px_0_24px_rgba(15,23,42,0.04)] transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-slate-100 px-5 py-5">
          <div className="flex items-center justify-between gap-3">
            <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-green-50 ring-1 ring-primary/15">
                <img src={assetUrl("/assets/logo.png")} alt="Logo" className="h-8 w-8 object-contain" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-bold text-slate-900">Entr&apos;aide</div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Centre de decision</div>
              </div>
            </Link>
            <button
              type="button"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <IconX />
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-5">
          {adminNavigation.map((group) => (
            <div key={group.title}>
              <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                {group.title}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                        active
                          ? "bg-gradient-to-r from-primary/10 to-green-50/80 font-semibold text-slate-900 ring-1 ring-primary/15"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      {active ? (
                        <span className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-gradient-to-b from-primary to-secondary" />
                      ) : null}
                      {Icon ? (
                        <Icon className={`h-[18px] w-[18px] ${active ? "text-primary" : "text-slate-400 group-hover:text-primary"}`} />
                      ) : (
                        <span className={`h-2 w-2 rounded-full ${active ? "bg-primary" : "bg-slate-300"}`} />
                      )}
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="admin-surface-soft flex items-center gap-3 px-3 py-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-xs font-bold text-white">
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-slate-900">{userName}</div>
              <div className="text-xs text-slate-500">Administrateur ONG</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-[280px]">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                className="admin-btn-ghost p-2 lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <IconMenu />
              </button>
              <AdminBreadcrumbs />
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link href="/" target="_blank" className="admin-btn-ghost hidden sm:inline-flex text-xs">
                Voir le site
                <IconExternal />
              </Link>
              <button type="button" onClick={handleLogout} className="admin-btn-primary text-xs">
                Deconnexion
              </button>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
