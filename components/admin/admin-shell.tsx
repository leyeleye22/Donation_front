"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ADMIN_SESSION_KEY } from "@/lib/admin-auth";
import { adminNavigation, type AdminNavItem } from "@/lib/admin/navigation";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const navigationItems: AdminNavItem[] = adminNavigation.reduce<AdminNavItem[]>((accumulator, group) => {
    accumulator.push(...group.items);
    return accumulator;
  }, []);

  const currentSection = navigationItems.find((item) => pathname === item.href);

  function handleLogout() {
    window.localStorage.removeItem(ADMIN_SESSION_KEY);
    router.push("/login");
    router.refresh();
  }

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#f5f7f2]">
      <div className="mx-auto grid min-h-screen max-w-[1680px] lg:grid-cols-[300px_1fr]">
        <aside className="border-r border-secondary/10 bg-[#fbfcf8] p-5 lg:p-6">
          <div className="rounded-[30px] bg-[linear-gradient(135deg,_#fff7ed_0%,_#ffffff_42%,_#f7fbf4_100%)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ring-1 ring-secondary/10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-white shadow-[0_12px_24px_rgba(239,146,33,0.2)]">
                EH
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Admin panel</div>
                <div className="mt-1 text-xl font-bold text-gray-950">Entr&apos;aide</div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-gray-600">Un espace plus simple pour modifier le site sans connaissance technique.</p>
          </div>

          <nav className="mt-6 space-y-5">
            {adminNavigation.map((group) => (
              <div key={group.title}>
                <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-400">{group.title}</div>
                <div className="space-y-1.5">
                  {group.items.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                          active
                            ? "bg-white text-gray-950 shadow-[0_14px_30px_rgba(15,23,42,0.08)] ring-1 ring-primary/18"
                            : "text-gray-700 hover:bg-white hover:shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
                        }`}
                      >
                        <span>{item.label}</span>
                        <span className={`h-2.5 w-2.5 rounded-full ${active ? "bg-primary" : "bg-secondary/25"}`} />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="mt-6 rounded-[26px] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] ring-1 ring-secondary/10">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Mode actuel</div>
            <p className="mt-2 text-sm leading-6 text-gray-700">Edition guidee, apercus et contenus structures avant le vrai backend Laravel.</p>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-secondary/10 bg-[#f5f7f2]/92 backdrop-blur">
            <div className="flex flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-8">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">Dashboard admin</div>
                <div className="mt-1 text-2xl font-bold text-gray-950">{currentSection?.label ?? "Edition guidee du contenu"}</div>
                <div className="mt-1 text-sm text-gray-500">Une interface plus claire pour modifier, verifier et organiser les contenus.</div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="rounded-full border border-secondary/12 bg-white px-4 py-2 text-sm text-gray-600 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                  Session demo active
                </div>
                <Link
                  href="/"
                  className="rounded-button border border-secondary/16 bg-white px-5 py-3 text-center text-sm font-semibold text-secondary shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition hover:bg-secondary/6"
                >
                  Voir le site
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-button bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(239,146,33,0.22)] transition hover:-translate-y-0.5 hover:bg-orange-500"
                >
                  Deconnexion
                </button>
              </div>
            </div>
          </header>

          <main className="px-6 py-8 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
