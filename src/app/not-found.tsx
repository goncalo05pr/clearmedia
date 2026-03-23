import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#ff4d2e]">404</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white">Page introuvable</h1>
      <p className="mt-3 max-w-sm text-neutral-400">
        La page demandee n existe pas ou a ete deplacee.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex rounded-full border border-white/[0.12] px-6 py-3 text-sm font-medium text-white transition hover:border-[#ff4d2e]/50 hover:text-[#ff4d2e]"
      >
        Retour accueil
      </Link>
    </div>
  );
}
