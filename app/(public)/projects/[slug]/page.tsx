import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/lib/mock-data/projects";
import { pageContent } from "@/lib/mock-data/ui-content";

const fakeUpdates: Record<string, string[]> = {
  water: [
    "Reperage des zones prioritaires et validation des besoins locaux.",
    "Preparation de la logistique terrain et coordination avec les relais communautaires.",
    "Documentation photo et publication des prochaines etapes dans le journal."
  ],
  education: [
    "Inventaire des besoins en kits et materiel pedagogique.",
    "Organisation d'une phase d'accompagnement et de suivi des structures partenaires.",
    "Mise en avant des prochaines publications terrain dans la section journal."
  ],
  health: [
    "Renforcement de la prevention et des relais de proximite.",
    "Coordination des consultations et circulation des informations utiles.",
    "Synthese des actions prevues pour la prochaine mise a jour projet."
  ]
};

const themeLabel: Record<string, string> = {
  education: "Education",
  water: "Forage / eau",
  health: "Sante",
  tabaski: "Tabaski",
  food: "Alimentaire"
};

const statusLabel: Record<string, string> = {
  ongoing: "En cours",
  completed: "Accompli",
  upcoming: "A venir"
};

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  const progress = Math.round((project.collectedAmount / project.goalAmount) * 100);
  const updates = fakeUpdates[project.theme] ?? [];
  const relatedImages = [project.coverImage, "http://localhost:8001/assets/whats.jpeg", "http://localhost:8001/assets/about.jpeg"];

  return (
    <div className="bg-white">
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">{pageContent.projectDetail.eyebrow}</p>
            <h1 className="text-5xl font-bold leading-tight text-gray-950">{project.title.fr}</h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">{project.description.fr}</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div>
            <img src={project.coverImage} alt={project.title.fr} className="h-[440px] w-full rounded-[32px] object-cover" />
            <div className="mt-4 grid grid-cols-3 gap-4">
              {relatedImages.map((image, index) => (
                <img
                  key={`${image}-${index}`}
                  src={image}
                  alt={`${project.title.fr} illustration ${index + 1}`}
                  className="h-28 w-full rounded-[20px] object-cover"
                />
              ))}
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-[0_10px_40px_rgba(15,23,42,0.08)] ring-1 ring-gray-100">
            <div className="mb-4 inline-flex rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Action humanitaire
            </div>
            <p className="mb-6 text-base leading-7 text-gray-600">
              Decouvrez les details du projet, son avancement, les beneficiaires concernes et comment vous pouvez apporter votre soutien.
            </p>

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
                <div className="mt-1 font-bold text-gray-950">{statusLabel[project.status]}</div>
              </div>
              <div className="rounded-2xl bg-gray-50 p-5">
                <div className="text-sm text-gray-500">Cause</div>
                <div className="mt-1 font-bold text-gray-950">{themeLabel[project.theme]}</div>
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
              <button className="rounded-button bg-primary px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-orange-600">
                {pageContent.projectDetail.donationCta}
              </button>
              <Link
                href="/journal"
                className="rounded-button border border-gray-300 px-6 py-4 text-center text-lg font-semibold text-gray-900 transition-colors hover:border-primary hover:text-primary"
              >
                {pageContent.projectDetail.updatesCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">{pageContent.projectDetail.updatesEyebrow}</p>
            <h2 className="text-4xl font-bold text-gray-950">{pageContent.projectDetail.updatesTitle}</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {updates.map((update, index) => (
              <div key={update} className="rounded-[28px] bg-white p-8 ring-1 ring-gray-100">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                  0{index + 1}
                </div>
                <p className="leading-7 text-gray-600">{update}</p>
              </div>
            ))}
          </div>
            <div className="mt-10 rounded-[28px] bg-gradient-to-r from-primary to-secondary p-8 text-white">
            <div className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-orange-200">Prochaines etapes</div>
            <p className="max-w-4xl text-lg leading-8 text-white/90">
              Chaque projet fait l'objet d'un suivi regulier. Les mises a jour, photos et rapports sont publies dans le journal et la galerie pour assurer une transparence totale.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
