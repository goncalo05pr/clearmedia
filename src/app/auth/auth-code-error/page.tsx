import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <section className="mx-auto max-w-lg text-center">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#ff4d2e]">Erreur</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white">
        Lien invalide ou expire
      </h1>
      <p className="mt-4 text-neutral-400">
        Reessaie depuis la page de connexion ou demande un nouveau lien par email.
      </p>
      <Link
        href="/connexion"
        className="mt-10 inline-flex rounded-full bg-[#ff4d2e] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#ff6a4d]"
      >
        Retour connexion
      </Link>
    </section>
  );
}
