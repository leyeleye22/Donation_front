export default function AdminNavigationPage() {
  return (
    <section className="rounded-[34px] border border-secondary/12 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
      <div className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Navigation</div>
      <h1 className="mt-3 text-4xl font-bold text-gray-950">Menu et liens a structurer.</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600">
        Ici l&apos;admin pourra ensuite modifier le header, le footer et les liens de navigation sans passer par le code.
      </p>
    </section>
  );
}
