"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { mapNavItem } from "@/lib/api-mappers";
import { loadGlobalSettings } from "@/lib/admin/global-settings";
import { useDonateModal } from "@/lib/donate-modal-context";
import { resolveImageUrl } from "@/lib/image-url";
import type { NavItem } from "@/lib/types";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [siteName, setSiteName] = useState("");
  const [donationText, setDonationText] = useState("");
  const [emergencyLabel, setEmergencyLabel] = useState("");
  const [emergencyText, setEmergencyText] = useState("");
  const { openDonate } = useDonateModal();

  useEffect(() => {
    api.getNavigation().then((data: unknown) => {
      if (Array.isArray(data)) {
        setNavItems(data.map(mapNavItem));
      }
    }).catch((e) => { console.error("SiteHeader: failed to load nav", e); });
  }, []);

  useEffect(() => {
    loadGlobalSettings().then((settings) => {
      setSiteName(settings.siteName);
      setDonationText(settings.donationCtaText);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    api.getPage("home").then((res) => {
      const content = res?.content as { emergencyLabel?: string; emergencyText?: string } | undefined;
      if (content?.emergencyLabel) setEmergencyLabel(content.emergencyLabel);
      if (content?.emergencyText) setEmergencyText(content.emergencyText);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  function isActive(href: string): boolean {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100/80 bg-white/95 shadow-sm backdrop-blur-md">
      {emergencyLabel || emergencyText ? (
      <div className="bg-gradient-to-r from-primary via-orange-500 to-secondary py-2.5 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 text-xs sm:px-6 lg:px-8">
          <p className="truncate">
            {emergencyLabel ? (
            <span className="mr-2 rounded-full bg-white/20 px-2.5 py-1 font-semibold text-white backdrop-blur-sm">
              {emergencyLabel}
            </span>
            ) : null}
            {emergencyText}
          </p>
          <Link href="/journal" className="hidden whitespace-nowrap font-medium text-white/90 hover:text-white md:block">
            Suivre nos actions
          </Link>
        </div>
      </div>
      ) : null}

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <img
            src={resolveImageUrl("/assets/logo.png")}
            alt="Logo Entr'aide"
            className="h-11 w-auto shrink-0 md:h-14"
          />
          <div className="hidden min-w-0 md:block">
            <div className="truncate text-xs font-semibold uppercase tracking-[0.16em] text-primary lg:text-sm">
              {siteName}
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex lg:gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-semibold transition ${
                isActive(item.href) ? "text-primary" : "text-gray-600 hover:text-primary"
              }`}
            >
              {item.label.fr}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openDonate}
            className="btn-primary btn-sm hidden sm:inline-flex"
          >
            {donationText || "Faire un don"}
          </button>
          <button
            type="button"
            className="rounded-lg p-2 text-gray-600 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t border-gray-100 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                  isActive(item.href) ? "bg-orange-50 text-primary" : "text-gray-700"
                }`}
              >
                {item.label.fr}
              </Link>
            ))}
            <button type="button" onClick={openDonate} className="btn-primary btn-sm mt-2 w-full">
              {donationText || "Faire un don"}
            </button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
