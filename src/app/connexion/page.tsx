import { AuthForm } from "@/components/auth-form";

function sanitizeNext(next: string | undefined) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/espace-membre";
  }
  return next;
}

type PageProps = {
  searchParams: Promise<{ next?: string; reset?: string }>;
};

export default async function ConnexionPage({ searchParams }: PageProps) {
  const { next, reset } = await searchParams;
  const redirectTo = sanitizeNext(next);

  return (
    <section>
      <h1 className="mb-3 text-3xl font-bold">Connexion / Inscription</h1>
      <p className="mb-8 text-slate-300">
        Cree ton compte ClearMedia ou connecte-toi pour acceder a tes formations.
      </p>

      {reset === "ok" ? (
        <div className="mb-6 rounded-lg border border-emerald-800 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-100">
          Mot de passe mis a jour. Tu peux te connecter avec le nouveau mot de passe.
        </div>
      ) : null}

      <AuthForm redirectTo={redirectTo} />
    </section>
  );
}
