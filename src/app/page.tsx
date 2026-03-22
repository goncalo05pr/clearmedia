import Link from "next/link";

export default function Home() {
  return (
    <section className="space-y-12">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10">
        <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-cyan-300">
          Agence Growth & Acquisition
        </p>
        <h1 className="mb-5 text-4xl font-bold leading-tight md:text-6xl">
          ClearMedia aide les entreprises a scaler leur acquisition.
        </h1>
        <p className="max-w-3xl text-lg text-slate-300">
          Strategie, media buying, funnels et conversion: on structure ton systeme
          marketing pour generer des ventes previsibles.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/formations"
            className="rounded-md bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400"
          >
            Voir les formations
          </Link>
          <Link
            href="/connexion"
            className="rounded-md border border-slate-700 px-5 py-3 font-semibold hover:border-cyan-400 hover:text-cyan-300"
          >
            Creer un compte
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          "Strategie d'acquisition data-driven",
          "Execution paid media multi-canal",
          "Formation et accompagnement operationnel",
        ].map((item) => (
          <div key={item} className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-slate-200">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
