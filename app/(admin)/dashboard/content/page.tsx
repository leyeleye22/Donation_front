import Link from "next/link";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { AdminPage } from "@/components/admin/ui/admin-page";
import { PageHeader } from "@/components/admin/ui/page-header";

const contentPages = [
  {
    step: "01",
    title: "Accueil",
    description: "Hero, urgence, message principal, CTA, mission et newsletter.",
    href: "/dashboard/content/home",
    status: "Prioritaire",
    tone: "warning" as const,
    badgeClass: "admin-badge-warning",
  },
  {
    step: "02",
    title: "A propos",
    description: "Association, fondateur, valeurs, trajectoire et preuves d'impact.",
    href: "/dashboard/content/about",
    status: "Editorial",
    badgeClass: "admin-badge-neutral",
  },
  {
    step: "03",
    title: "Contact",
    description: "Textes d'aide, coordonnees, FAQ et orientation des visiteurs.",
    href: "/dashboard/content/contact",
    status: "Support",
    badgeClass: "admin-badge-info",
  },
];

const workflow = [
  { step: "1", title: "Choisir la page", detail: "Identifiez la page publique a mettre a jour." },
  { step: "2", title: "Modifier le contenu", detail: "Textes, images, boutons et messages cles." },
  { step: "3", title: "Publier", detail: "Enregistrez puis verifiez le rendu sur le site." },
];

export default function AdminContentHubPage() {
  return (
    <AdminPage className="space-y-6">
      <PageHeader
        eyebrow="Site public"
        title="Centre de contenu"
        description="Gerez les pages visibles par le public. Chaque modification est refletee sur le site association."
      />

      <AdminCard padding="lg" variant="soft">
        <div className="admin-eyebrow-alt mb-4">Workflow editorial</div>
        <div className="grid gap-4 md:grid-cols-3">
          {workflow.map((item) => (
            <div key={item.step} className="admin-surface p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white">
                {item.step}
              </div>
              <div className="text-lg font-bold text-slate-900">{item.title}</div>
              <div className="mt-2 text-sm leading-6 text-slate-500">{item.detail}</div>
            </div>
          ))}
        </div>
      </AdminCard>

      <div className="grid gap-6 lg:grid-cols-3">
        {contentPages.map((page) => (
          <Link key={page.href} href={page.href} className="group">
            <AdminCard className="h-full transition group-hover:-translate-y-1 group-hover:border-primary/25 group-hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                  {page.step}
                </div>
                <span className={page.badgeClass}>{page.status}</span>
              </div>
              <h2 className="mt-5 text-2xl font-bold text-slate-900">{page.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-500">{page.description}</p>
              <div className="mt-6 text-sm font-semibold text-secondary">Ouvrir l&apos;editeur →</div>
            </AdminCard>
          </Link>
        ))}
      </div>
    </AdminPage>
  );
}
