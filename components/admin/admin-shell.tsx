"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminLogout } from "@/lib/admin-auth";
import { adminNavigation, type AdminNavItem } from "@/lib/admin/navigation";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const navigationItems: AdminNavItem[] = adminNavigation.reduce<AdminNavItem[]>((accumulator, group) => {
    accumulator.push(...group.items);
    return accumulator;
  }, []);

  const currentSection = navigationItems.find((item) => pathname === item.href);

  async function handleLogout() {
    try { await adminLogout(); } catch {}
    router.push("/login");
    router.refresh();
  }

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
          <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
            <img src="http://localhost:8001/assets/logo.png" alt="Logo" className="h-9 w-9" />
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">Admin</div>
              <div className="text-sm font-bold text-gray-900">Entr&apos;aide</div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {adminNavigation.map((group) => (
              <div key={group.title}>
                <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">{group.title}</div>
                {group.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                        active
                          ? "bg-orange-50 font-semibold text-primary"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          <div className="border-t border-gray-100 px-3 py-3">
            <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500">
                A
              </span>
              <span className="truncate text-xs">Administrateur</span>
            </div>
          </div>
        </aside>

        <div className="ml-64 flex flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
            <div className="flex items-center justify-between px-6 py-3">
              <div>
                <h1 className="text-lg font-bold text-gray-900">{currentSection?.label ?? "Tableau de bord"}</h1>
                <p className="text-xs text-gray-500">Espace d&apos;administration</p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
                >
                  Voir le site
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:brightness-90"
                >
                  D&eacute;connexion
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-6 py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
