import type { LocalizedText } from "@/lib/types";

type HeroSectionProps = {
  title: LocalizedText;
  description: LocalizedText;
  backgroundImage: string;
};

export function HeroSection({ title, description, backgroundImage }: HeroSectionProps) {
  return (
    <section
      className="relative flex min-h-[70vh] items-center bg-cover bg-center"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      <div className="absolute inset-0 bg-black/45" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="mb-6 text-5xl font-bold text-white">{title.fr}</h1>
          <p className="text-xl leading-relaxed text-white">{description.fr}</p>
        </div>
      </div>
    </section>
  );
}
