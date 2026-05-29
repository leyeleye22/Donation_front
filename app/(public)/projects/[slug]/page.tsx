import Link from "next/link";
import { notFound } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api";

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

function toLocalized(val: any): { fr: string } {
  if (!val) return { fr: "" };
  if (typeof val === "string") return { fr: val };
  return { fr: val.fr || "" };
}

function resolveImageUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = API.replace(/\/api\/?$/, "");
  return `${base}${path.startsWith("/") ? path : "/" + path}`;
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let project: any = null;
  try {
    const res = await fetch(`${API}/projects?per_page=50`, { cache: "no-store" });
    const body = await res.json();
    project = (body.data || []).find((item: any) => item.slug === slug);
  } catch {}

  if (!project) notFound();

  const title = toLocalized(project.title);
  const description = toLocalized(project.description);
  const location = toLocalized(project.location);
  const beneficiaryLabel = toLocalized(project.beneficiary_label ?? project.beneficiaryLabel);
  const goalAmount = Number(project.goal_amount ?? project.goalAmount ?? 0);
  const collectedAmount = Number(project.collected_amount ?? project.collectedAmount ?? 0);
  const coverImage = resolveImageUrl(project.cover_image ?? project.coverImage ?? "");
  const progress = goalAmount ? Math.round((collectedAmount / goalAmount) * 100) : 0;
  const relatedImages = [coverImage, resolveImageUrl("/assets/whats.jpeg"), resolveImageUrl("/assets/about.jpeg")];

  return (
    <div className="bg-white">
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">Projet</p>
            <h1 className="text-5xl font-bold leading-tight text-gray-950">{title.fr}</h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">{description.fr}</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div>
            <img src={coverImage} alt={title.fr} className="h-[440px] w-full rounded-[32px] object-cover" />
            <div className="mt-4 grid grid-cols-3 gap-4">
              {relatedImages.map((image, index) => (
                <img
                  key={`${image}-${index}`}
                  src={image}
                  alt={`${title.fr} illustration ${index + 1}`}
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
                <div className="mt-1 font-bold text-gray-950">{goalAmount.toLocaleString("fr-FR")} FCFA</div>
              </div>
              <div className="rounded-2xl bg-gray-50 p-5">
                <div className="text-sm text-gray-500">Collecte</div>
                <div className="mt-1 font-bold text-gray-950">{collectedAmount.toLocaleString("fr-FR")} FCFA</div>
              </div>
              <div className="rounded-2xl bg-gray-50 p-5">
                <div className="text-sm text-gray-500">Beneficiaires</div>
                <div className="mt-1 font-bold text-gray-950">{beneficiaryLabel.fr}</div>
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
                <div className="mt-1 font-bold text-gray-950">{location.fr}</div>
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
                Faire un don
              </button>
              <Link
                href="/journal"
                className="rounded-button border border-gray-300 px-6 py-4 text-center text-lg font-semibold text-gray-900 transition-colors hover:border-primary hover:text-primary"
              >
                Suivre les mises a jour
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">Suivi du projet</p>
            <h2 className="text-4xl font-bold text-gray-950">Les etapes cles de ce projet</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-[28px] bg-white p-8 ring-1 ring-gray-100">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">01</div>
              <p className="leading-7 text-gray-600">Reperage des zones prioritaires et validation des besoins locaux avec les partenaires.</p>
            </div>
            <div className="rounded-[28px] bg-white p-8 ring-1 ring-gray-100">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">02</div>
              <p className="leading-7 text-gray-600">Preparation de la logistique terrain et coordination avec les relais communautaires.</p>
            </div>
            <div className="rounded-[28px] bg-white p-8 ring-1 ring-gray-100">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">03</div>
              <p className="leading-7 text-gray-600">Documentation photo et publication des prochaines etapes dans le journal dedie.</p>
            </div>
          </div>
          <div className="mt-10 rounded-[28px] bg-gradient-to-r from-primary to-secondary p-8 text-white">
            <div className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-orange-200">Prochaines etapes</div>
            <p className="max-w-4xl text-lg leading-8 text-white/90">
              Chaque projet fait l&apos;objet d&apos;un suivi regulier. Les mises a jour, photos et rapports sont publies dans le journal et la galerie pour assurer une transparence totale.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
