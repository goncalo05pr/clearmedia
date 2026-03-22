import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <section className="mx-auto max-w-lg text-center">
      <h1 className="text-2xl font-bold">Lien invalide ou expire</h1>
      <p className="mt-3 text-slate-400">
        Reessaie depuis la page de connexion ou demande un nouveau lien par email.
      </p>
      <Link
        href="/connexion"
        className="mt-8 inline-block rounded-md bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400"
      >
        Retour connexion
      </Link>
    </section>
  );
}
