"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavigation } from "@/lib/admin/navigation";

function labelForPath(pathname: string): string {
  const flat = adminNavigation.flatMap((g) => g.items);
  const exact = flat.find((item) => item.href === pathname);
  if (exact) return exact.label;

  const partial = flat
    .filter((item) => item.href !== "/dashboard" && pathname.startsWith(item.href))
    .sort((a, b) => b.href.length - a.href.length)[0];
  if (partial) return partial.label;

  if (pathname === "/dashboard") return "Tableau de bord";
  return "Administration";
}

export function AdminBreadcrumbs() {
  const pathname = usePathname();
  if (pathname === "/login") return null;

  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { href: string; label: string }[] = [{ href: "/dashboard", label: "Pilotage" }];

  if (segments.length > 1) {
    crumbs.push({ href: pathname, label: labelForPath(pathname) });
  }

  return (
    <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-xs text-slate-500">
      {crumbs.map((crumb, index) => (
        <span key={crumb.href} className="flex items-center gap-2">
          {index > 0 ? <span className="text-slate-300">/</span> : null}
          {index === crumbs.length - 1 ? (
            <span className="font-semibold text-slate-700">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="transition hover:text-primary">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
