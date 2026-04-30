"use client";

import Link from "next/link";
import { useState } from "react";
import { homeContent } from "@/lib/mock-data/home";
import { navItems, siteSettings } from "@/lib/mock-data/site";
import { siteChromeContent } from "@/lib/mock-data/ui-content";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="bg-gray-950 py-2 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 text-xs sm:px-6 lg:px-8">
          <p className="truncate">
            <span className="mr-2 rounded-full bg-primary px-2 py-1 font-semibold text-white">
              {homeContent.emergencyBanner.label}
            </span>
            {homeContent.emergencyBanner.text}
          </p>
          <Link href="/journal" className="hidden whitespace-nowrap text-orange-200 hover:text-white md:block">
            {siteChromeContent.emergencyBanner.ctaLabel}
          </Link>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <img src="/assets/logo.png" style={{ width: 70 }} alt="Logo" className="w-12 md:w-16 lg:w-20" />
          <div className="hidden md:block">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Entr'aide</div>
            <div className="text-sm text-gray-600">{siteChromeContent.emergencyBanner.productLabel}</div>
          </div>
        </Link>

        <nav className="hidden space-x-6 md:flex lg:space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-700 transition-colors hover:text-primary lg:text-base"
            >
              {item.label.fr}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-3 md:space-x-4">
          <Link
            href="/journal"
            className="hidden whitespace-nowrap rounded-button border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-primary hover:text-primary lg:block"
          >
            Journal
          </Link>
          <button className="whitespace-nowrap rounded-button bg-primary px-4 py-2 text-sm text-white transition-colors hover:bg-orange-600 md:px-6 md:text-base">
            {siteSettings.donationCta.fr}
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
                className="block px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 hover:text-primary"
              >
                {item.label.fr}
              </Link>
            ))}
            <div className="px-4">
              <button className="w-full rounded-button bg-primary px-4 py-3 text-white">{siteSettings.donationCta.fr}</button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
