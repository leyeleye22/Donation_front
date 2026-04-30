import Link from "next/link";

const contentPages = [
  {
    step: "1",
    title: "Accueil",
    description: "Hero, banniere d'urgence, message principal, CTA, mission et newsletter.",
    href: "/dashboard/content/home",
    status: "Pret"
  },
  {
    step: "2",
    title: "A propos",
    description: "Association, fondateur, valeurs, trajectoire et contenus explicatifs.",
    href: "/dashboard/content/about",
    status: "Ensuite"
  },
  {
    step: "3",
    title: "Contact",
    description: "Textes d'aide, messages, FAQ et micro-contenus d'orientation.",
    href: "/dashboard/content/contact",
    status: "Ensuite"
  }
];

export default function AdminContentHubPage() {
  return (
    <section className="space-y-8">
      <div className="rounded-[34px] border border-secondary/12 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Centre de contenu</div>
        <h1 className="mt-3 text-4xl font-bold text-gray-950">Choisir une page, puis suivre les etapes.</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600">
          On reduit les decisions au minimum: choisir la page, modifier, verifier, enregistrer.
        </p>
      </div>

      <div className="rounded-[32px] bg-white p-7 shadow-[0_16px_44px_rgba(15,23,42,0.06)] ring-1 ring-secondary/10">
        <div className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-secondary">Etapes simples</div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] bg-[#f7fbf4] p-5">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-white">1</div>
            <div className="text-lg font-bold text-gray-950">Choisir la page</div>
            <div className="mt-2 text-sm leading-6 text-gray-600">Accueil, A propos ou Contact.</div>
          </div>
          <div className="rounded-[24px] bg-[#fff8ef] p-5">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-white">2</div>
            <div className="text-lg font-bold text-gray-950">Modifier</div>
            <div className="mt-2 text-sm leading-6 text-gray-600">Texte, image, bouton ou message.</div>
          </div>
          <div className="rounded-[24px] bg-primary/6 p-5">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-white">3</div>
            <div className="text-lg font-bold text-gray-950">Verifier</div>
            <div className="mt-2 text-sm leading-6 text-gray-600">Utiliser l&apos;apercu avant d&apos;enregistrer.</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {contentPages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="rounded-[30px] border border-secondary/10 bg-white p-7 shadow-[0_16px_44px_rgba(15,23,42,0.06)] transition hover:-translate-y-1"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-white">{page.step}</div>
              <div className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                {page.status}
              </div>
            </div>
            <h2 className="mt-4 text-3xl font-bold text-gray-950">{page.title}</h2>
            <p className="mt-3 text-base leading-8 text-gray-600">{page.description}</p>
            <div className="mt-6 text-sm font-semibold text-secondary">Ouvrir l&apos;etape suivante</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
