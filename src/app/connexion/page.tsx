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
    <div className="mx-auto max-w-lg">
      <header className="mb-10">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[#ff4d2e]">
          Compte
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Connexion
        </h1>
        <p className="mt-4 text-neutral-400">
          Accede a ton espace membre et a tes formations ClearMedia.
        </p>
      </header>

      {reset === "ok" ? (
        <div className="mb-8 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-neutral-300">
          Mot de passe mis a jour. Tu peux te connecter avec le nouveau mot de passe.
        </div>
      ) : null}

      <AuthForm redirectTo={redirectTo} />
    </div>
  );
}
