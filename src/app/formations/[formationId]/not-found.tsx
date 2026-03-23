import Link from "next/link";

export default function FormationNotFound() {
  return (
    <section className="text-center">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#ff4d2e]">404</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white">
        Formation introuvable
      </h1>
      <p className="mt-4 text-neutral-400">Cette formation n existe pas ou a ete retiree.</p>
      <Link
        href="/formations"
        className="mt-8 inline-flex text-sm font-medium text-[#ff4d2e] transition hover:text-[#ff6a4d]"
      >
        Voir les formations
      </Link>
    </section>
  );
}
