export default function AdminJournalPage() {
  return (
    <section className="rounded-[34px] border border-secondary/12 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
      <div className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Journal</div>
      <h1 className="mt-3 text-4xl font-bold text-gray-950">Gestion du journal a structurer.</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600">
        Cette zone preparera la creation d&apos;articles, l&apos;edition riche, le statut publication et l&apos;association d&apos;images.
      </p>
    </section>
  );
}
