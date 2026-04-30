import Link from "next/link";
import { navItems } from "@/lib/mock-data/site";
import { siteChromeContent } from "@/lib/mock-data/ui-content";

export function SiteFooter() {
  return (
    <footer className="border-t border-secondary/10 bg-[linear-gradient(180deg,_#ffffff_0%,_#f7fbf4_60%,_#fff7ed_100%)] py-16 text-gray-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <img src="/assets/logo.png" alt="Logo" className="mb-5 w-16" />
          <p className="mb-6 max-w-xl text-sm leading-6 text-gray-600">
            {siteChromeContent.footer.intro}
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 sm:grid-cols-4">
            {siteChromeContent.footer.stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-gray-950">{stat.value}</div>
                <div>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-semibold">Explorer</h3>
          <div className="space-y-3 text-sm text-gray-600">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="block transition-colors hover:text-primary">
                {item.label.fr}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-semibold">Contact</h3>
          <div className="space-y-3 text-sm leading-6 text-gray-600">
            <p>Medine N 260, Mbour, Senegal</p>
            <p>+221 77 639 20 69</p>
            <p>+221 76 811 14 12</p>
            <p>toleye2@gmail.com</p>
            <p>eapsh1@outlook.com</p>
          </div>
          <div className="mt-6 rounded-2xl border border-primary/12 bg-white p-4 text-sm text-gray-600 shadow-[0_12px_32px_rgba(15,23,42,0.05)]">
            <div className="mb-2 font-semibold text-primary">{siteChromeContent.footer.transparencyTitle}</div>
            <p>{siteChromeContent.footer.transparencyText}</p>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-7xl border-t border-secondary/10 px-4 pt-6 text-sm text-gray-500 sm:px-6 lg:px-8">
        <p>{siteChromeContent.footer.copyright}</p>
      </div>
    </footer>
  );
}
