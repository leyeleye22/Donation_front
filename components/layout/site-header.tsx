"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { mapNavItem } from "@/lib/api-mappers";
import { loadGlobalSettings } from "@/lib/admin/global-settings";
import { resolveImageUrl } from "@/lib/image-url";
import type { NavItem } from "@/lib/types";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [siteName, setSiteName] = useState("Entr'aide pour servir l'humanité");
  const [donationText, setDonationText] = useState("Faire un don");

  useEffect(() => {
    api.getNavigation().then((data: any) => {
      if (Array.isArray(data)) {
        const enabled = data
          .filter((item: any) => item.is_active ?? true)
          .map(mapNavItem);
        if (enabled.length > 0) setNavItems(enabled);
      }
    }).catch((e) => { console.error("SiteHeader: failed to load nav", e); });
  }, []);

  useEffect(() => {
    loadGlobalSettings().then((settings) => {
      setSiteName(settings.siteName);
      setDonationText(settings.donationCtaText);
    });
  }, []);

  function isActive(href: string): boolean {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="bg-gradient-to-r from-primary to-secondary py-2 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 text-xs sm:px-6 lg:px-8">
          <p className="truncate">
            <span className="mr-2 rounded-full bg-primary px-2 py-1 font-semibold text-white">
              Urgence
            </span>
            Ensemble, agissons pour les communautes dans le besoin.
          </p>
          <Link href="/journal" className="hidden whitespace-nowrap text-orange-200 hover:text-white md:block">
            Suivre nos actions
          </Link>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <img src={resolveImageUrl('/assets/logo.png')} style={{ width: 70 }} alt="Logo" className="w-12 md:w-16 lg:w-20" />
          <div className="hidden md:block">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{siteName}</div>
          </div>
        </Link>

        <nav className="hidden space-x-6 md:flex lg:space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary lg:text-base ${
                isActive(item.href) ? "font-bold text-primary" : "text-gray-700"
              }`}
            >
              {item.label.fr}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-3 md:space-x-4">
          <Link
            href="/journal"
            className={`hidden whitespace-nowrap rounded-button px-4 py-2 text-sm font-medium transition-colors lg:block ${
              isActive("/journal")
                ? "bg-primary text-white"
                : "border border-gray-300 text-gray-700 hover:border-primary hover:text-primary"
            }`}
          >
            {navItems.find((item) => item.href === "/journal")?.label.fr ?? "Journal"}
          </Link>
          <button className="whitespace-nowrap rounded-button bg-primary px-4 py-2 text-sm text-white transition-colors hover:bg-orange-600 md:px-6 md:text-base">
            {donationText}
          </button>
          <button className="text-gray-700 md:hidden" onClick={() => setMenuOpen((open) => !open)}>
            <span className="text-2xl">{menuOpen ? "X" : "="}</span>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="mx-4 mt-2 rounded-b-lg bg-white shadow-lg md:hidden">
          <div className="space-y-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 transition-colors hover:bg-gray-50 hover:text-primary ${
                  isActive(item.href) ? "font-bold text-primary" : "text-gray-700"
                }`}
              >
                {item.label.fr}
              </Link>
            ))}
            <div className="px-4">
              <button className="w-full rounded-button bg-primary px-4 py-3 text-white">{donationText}</button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
