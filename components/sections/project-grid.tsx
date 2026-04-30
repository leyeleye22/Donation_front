import Link from "next/link";
import { projects } from "@/lib/mock-data/projects";

export function ProjectGrid() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.id}
              className="overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-lg"
            >
              <img src={project.coverImage} alt={project.title.fr} className="h-48 w-full object-cover object-top" />
              <div className="p-6">
                <h3 className="mb-3 text-xl font-bold text-gray-900">{project.title.fr}</h3>
                <p className="mb-6 text-gray-600">{project.description.fr}</p>
                <div className="mb-4 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.round((project.collectedAmount / project.goalAmount) * 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{project.beneficiaryLabel.fr}</span>
                  <Link href={`/projects/${project.slug}`} className="text-sm font-medium text-primary hover:text-orange-600">
                    En savoir plus
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
