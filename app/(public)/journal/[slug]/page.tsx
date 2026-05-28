import Link from "next/link";
import { notFound } from "next/navigation";
import { posts } from "@/lib/mock-data/posts";

const categoryLabel = {
  terrain: "Terrain",
  "project-update": "Mise a jour projet",
  association: "Association"
} as const;

const articleBodies: Record<string, string[]> = {
  "distribution-alimentaire-mbour": [
    "Cette publication sert a documenter une action alimentaire avec plus de clarte: le lieu, le nombre de foyers atteints, l'organisation de la distribution et la maniere dont les besoins ont ete observes.",
    "Le but du journal est de ne pas laisser les images seules. Chaque scene doit etre reliee a une action precise, a un contexte local et a une lecture plus concrete de l'impact recherche.",
    "Sur un site humanitaire, ce type d'article permet aussi de garder une trace visible des interventions et de montrer comment la mobilisation se traduit sur le terrain."
  ],
  "avancee-forage-kaolack": [
    "Le forage fait partie des actions qui gagnent a etre suivies dans le temps. Une page detaillee aide a comprendre les etapes, les freins techniques et les besoins encore ouverts.",
    "Ici, les images et le texte servent ensemble a montrer une progression lisible. L'enjeu est de rassurer le visiteur sur ce qui avance deja et sur la raison d'un futur soutien.",
    "Ce type de publication joue donc un role central entre la fiche projet, la galerie terrain et la future logique de donation branchee au backend."
  ],
  "coordination-sante-communautaire": [
    "L'information utile ne depend pas seulement d'une intervention ponctuelle. Elle depend aussi de la coordination locale, des relais mobilises et de la qualite du suivi communautaire.",
    "Cette page detail met l'accent sur l'organisation du travail, la circulation des priorites et l'ancrage local des actions de sante.",
    "Le journal devient alors un outil de confiance: il montre que les projets avancent avec des partenaires, des relais et une methode."
  ],
  "carnet-terrain-education-diourbel": [
    "Le terrain education se raconte rarement bien quand on se contente d'une photo et d'une phrase. Il faut aussi montrer les besoins identifies, l'environnement scolaire et les suites possibles.",
    "Dans cette mise en page, l'article sert de passerelle entre l'image, le contexte local et les futures actions qui pourront etre rattachees a un projet ou a une campagne de soutien.",
    "Le ton reste simple, informatif et centre sur l'utilite publique de la mission."
  ],
  "preparation-tabaski-solidaire": [
    "Avant meme la campagne, il est utile de raconter la preparation. Cela aide a montrer les arbitrages, la logistique, la priorisation et la maniere dont l'association anticipe les besoins.",
    "Ce format permet au visiteur de comprendre que l'action humanitaire ne se joue pas uniquement le jour de l'evenement, mais aussi dans les semaines qui le precede.",
    "La publication devient ainsi une piece importante du futur dispositif de transparence."
  ],
  "partenariats-locaux-sante": [
    "Les partenariats locaux rendent les actions plus solides, plus proches des besoins et plus faciles a deployer sur le terrain.",
    "Cet article montre surtout une logique d'organisation: mieux coordonner, mieux informer et mieux orienter les efforts autour des priorites sanitaires.",
    "Dans une version backend plus complete, ce type de contenu pourra etre relie a des projets, des partenaires et des medias reutilisables."
  ],
  "mission-niger-suivi-communautaire": [
    "Quand l'association agit dans un autre contexte geographique, le journal doit aider a expliquer la lecture du terrain, les besoins observes et les priorites retenues.",
    "L'objectif ici est d'apporter de la lisibilite, pas de surcharger la page avec du texte flou. Les photos et quelques paragraphes forts suffisent a construire la confiance.",
    "Ce genre de fiche detaillee est aussi utile pour faire le lien entre mission, galerie et futurs appels a soutien."
  ],
  "ligne-editoriale-transparence-terrain": [
    "Un site humanitaire credible montre plus que des slogans. Il montre des projets, des mises a jour, des images, des points de repere et une vraie logique editoriale.",
    "Cette page explique pourquoi le journal, la galerie et les fiches projet doivent rester relies. Ensemble, ils creent un parcours plus clair pour comprendre, suivre et soutenir.",
    "Chaque article est documente et verifie pour garantir la qualite et la fiabilite des informations publiees."
  ]
};

const supportingImages = ["http://localhost:8001/assets/about.jpeg", "http://localhost:8001/assets/consultation.jpeg", "http://localhost:8001/assets/whats.jpeg"];

export default async function JournalArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = posts.filter((item) => item.slug !== slug).slice(0, 3);
  const body = articleBodies[post.slug] ?? [post.content.fr];

  return (
    <div className="bg-white">
      <section className="overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(239,146,33,0.16),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(65,182,75,0.14),_transparent_28%),linear-gradient(180deg,_#ffffff_0%,_#f7fbf4_56%,_#fff7ed_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
            <div className="max-w-3xl">
              <div className="mb-4 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.18em]">
                <span className="rounded-full bg-primary px-4 py-2 text-white">{categoryLabel[post.category]}</span>
                <span className="rounded-full border border-secondary/14 bg-white px-4 py-2 text-secondary">{post.location.fr}</span>
                <span className="rounded-full border border-secondary/14 bg-white px-4 py-2 text-secondary">{post.readTime}</span>
              </div>
              <h1 className="text-5xl font-bold leading-[1.04] text-gray-950 md:text-6xl">{post.title.fr}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">{post.excerpt.fr}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/journal"
                  className="rounded-button border border-secondary/18 bg-white px-6 py-3.5 text-center font-semibold text-secondary transition hover:bg-secondary/6"
                >
                  &larr; Retour au journal
                </Link>
                <Link
                  href="/projects"
                  className="rounded-button bg-primary px-6 py-3.5 text-center font-semibold text-white shadow-[0_16px_36px_rgba(239,146,33,0.24)] transition hover:-translate-y-0.5 hover:bg-orange-500"
                >
                  Voir les projets
                </Link>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[36px] shadow-[0_24px_80px_rgba(15,23,42,0.14)]">
              <img src={post.image} alt={post.title.fr} className="h-[540px] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/82 via-secondary/12 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="rounded-[28px] border border-white/40 bg-white/88 p-5 backdrop-blur">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{post.createdAt}</div>
                  <div className="mt-2 text-2xl font-bold text-gray-950">Suivez nos actions et l'avancement de nos projets sur le terrain.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.94fr_1.06fr] lg:px-8">
          <div className="space-y-4">
            {supportingImages.map((image, index) => (
              <img
                key={`${image}-${index}`}
                src={index === 0 ? post.image : image}
                alt={`${post.title.fr} visuel ${index + 1}`}
                className={`w-full rounded-[30px] object-cover shadow-[0_14px_36px_rgba(15,23,42,0.08)] ${index === 0 ? "h-64" : "h-52"}`}
              />
            ))}
          </div>

          <div className="rounded-[34px] border border-secondary/12 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <span>Article</span>
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>{post.createdAt}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>{post.location.fr}</span>
            </div>

            <div className="space-y-5 text-base leading-8 text-gray-700">
              {body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 rounded-[28px] bg-[#f7fbf4] p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Point cle</div>
              <p className="mt-2 text-sm leading-7 text-gray-700">{post.content.fr}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f8f5ef] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">Continuer la lecture</p>
            <h2 className="text-4xl font-bold text-gray-950">Continuez a suivre nos actions et reportages.</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.id}
                href={`/journal/${relatedPost.slug}`}
                className="overflow-hidden rounded-[30px] bg-white shadow-[0_16px_44px_rgba(15,23,42,0.08)] transition hover:-translate-y-1"
              >
                <img src={relatedPost.image} alt={relatedPost.title.fr} className="h-56 w-full object-cover" />
                <div className="p-6">
                  <div className="mb-3 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                    <span>{categoryLabel[relatedPost.category]}</span>
                    <span>{relatedPost.createdAt}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-950">{relatedPost.title.fr}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-600">{relatedPost.excerpt.fr}</p>
                  <div className="mt-5 text-sm font-semibold text-primary">Lire l&apos;article</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
