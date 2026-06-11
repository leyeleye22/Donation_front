"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { mapNavItem } from "@/lib/api-mappers";
import { loadGlobalSettings, type GlobalSettings, defaultGlobalSettings } from "@/lib/admin/global-settings";
import { resolveImageUrl } from "@/lib/image-url";
import type { NavItem } from "@/lib/types";

export function SiteFooter() {
  const [settings, setSettings] = useState<GlobalSettings>(defaultGlobalSettings);
  const [navItems, setNavItems] = useState<NavItem[]>([]);

  useEffect(() => {
    loadGlobalSettings().then(setSettings);
  }, []);

  useEffect(() => {
    api.getNavigation().then((data: any) => {
      if (Array.isArray(data)) {
        const enabled = data.filter((item: any) => item.is_active ?? true).map(mapNavItem);
        if (enabled.length > 0) setNavItems(enabled);
      }
    }).catch((e) => { console.error("SiteFooter: failed to load nav", e); });
  }, []);

  return (
    <footer className="border-t border-primary/10 bg-gradient-to-b from-white via-green-50/30 to-orange-50/40 py-16 text-gray-800">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <img src={resolveImageUrl("/assets/logo.png")} alt="Logo" className="mb-5 h-16 w-auto" />
          <p className="mb-6 max-w-xl text-sm leading-6 text-gray-600">
            {settings.footerIntro}
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            {[
              { value: "50+", label: "Projets realises" },
              { value: "2000+", label: "Beneficiaires" },
              { value: "5", label: "Themes d'action" },
              { value: "10+", label: "Partenaires" },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className={`rounded-2xl border bg-white/80 px-4 py-3 ${
                  index % 2 === 0 ? "border-primary/10 shadow-warm" : "border-secondary/10 shadow-fresh"
                }`}
              >
                <div className={`text-2xl font-bold ${index % 2 === 0 ? "text-primary" : "text-secondary"}`}>{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-semibold text-primary">Explorer</h3>
          <div className="space-y-3 text-sm text-gray-600">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="block transition-colors hover:text-secondary">
                {item.label.fr}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-semibold text-secondary">Contact</h3>
          <div className="space-y-3 text-sm leading-6 text-gray-600">
            <p>Medine N 260, Mbour, Senegal</p>
            <p>+221 77 639 20 69</p>
            <p>+221 76 811 14 12</p>
            <p>toleye2@gmail.com</p>
            <p>eapsh1@outlook.com</p>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-7xl border-t border-primary/15 px-4 pt-6 text-sm text-gray-500 sm:px-6 lg:px-8">
        <p>{settings.footerCopyright}</p>
      </div>
    </footer>
  );
}
