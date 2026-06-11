import Link from "next/link";
import { notFound } from "next/navigation";
import { DonateButton } from "@/components/ui/donate-button";
import { mapProject } from "@/lib/api-mappers";
import { fetchPublic } from "@/lib/server-api";

const themeLabel: Record<string, string> = {
  education: "Education",
  water: "Forage / eau",
  health: "Sante",
  tabaski: "Tabaski",
  food: "Alimentaire",
};

const statusLabel: Record<string, string> = {
  ongoing: "En cours",
  completed: "Accompli",
  upcoming: "A venir",
};

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const raw = await fetchPublic<Record<string, unknown>>(`/projects/slug/${slug}`);
  if (!raw) notFound();

  const project = mapProject(raw);
  const progress = project.goalAmount ? Math.round((project.collectedAmount / project.goalAmount) * 100) : 0;

  return (
    <div className="bg-white">
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">Projet</p>
            <h1 className="text-5xl font-bold leading-tight text-gray-950">{project.title.fr}</h1>
            {project.description.fr ? <p className="mt-6 text-lg leading-8 text-gray-600">{project.description.fr}</p> : null}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div>
            {project.coverImage ? (
              <img src={project.coverImage} alt={project.title.fr} className="h-[440px] w-full rounded-[32px] object-cover" />
            ) : null}
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-[0_10px_40px_rgba(15,23,42,0.08)] ring-1 ring-gray-100">
            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-gray-50 p-5">
                <div className="text-sm text-gray-500">Objectif</div>
                <div className="mt-1 font-bold text-gray-950">{project.goalAmount.toLocaleString("fr-FR")} FCFA</div>
              </div>
              <div className="rounded-2xl bg-gray-50 p-5">
                <div className="text-sm text-gray-500">Collecte</div>
                <div className="mt-1 font-bold text-gray-950">{project.collectedAmount.toLocaleString("fr-FR")} FCFA</div>
              </div>
              <div className="rounded-2xl bg-gray-50 p-5">
                <div className="text-sm text-gray-500">Beneficiaires</div>
                <div className="mt-1 font-bold text-gray-950">{project.beneficiaryLabel.fr}</div>
              </div>
              <div className="rounded-2xl bg-gray-50 p-5">
                <div className="text-sm text-gray-500">Statut</div>
                <div className="mt-1 font-bold text-gray-950">{statusLabel[project.status] || project.status}</div>
              </div>
              <div className="rounded-2xl bg-gray-50 p-5">
                <div className="text-sm text-gray-500">Cause</div>
                <div className="mt-1 font-bold text-gray-950">{themeLabel[project.theme] || project.theme}</div>
              </div>
              <div className="rounded-2xl bg-gray-50 p-5">
                <div className="text-sm text-gray-500">Localisation</div>
                <div className="mt-1 font-bold text-gray-950">{project.location.fr}</div>
              </div>
            </div>

            <div className="mb-3 flex justify-between text-sm text-gray-500">
              <span>Progression</span>
              <span>{progress}%</span>
            </div>
            <div className="mb-8 h-3 w-full rounded-full bg-gray-100">
              <div className="h-3 rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${progress}%` }} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <DonateButton />
              <Link href="/journal" className="btn-outline-lg text-center text-gray-900">
                Suivre les mises a jour
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
