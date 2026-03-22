import Link from "next/link";

export default function FormationNotFound() {
  return (
    <section className="text-center">
      <h1 className="text-2xl font-bold">Formation introuvable</h1>
      <p className="mt-3 text-slate-400">Cette formation n existe pas ou a ete retiree.</p>
      <Link href="/formations" className="mt-6 inline-block text-cyan-400 hover:text-cyan-300">
        Voir les formations
      </Link>
    </section>
  );
}
