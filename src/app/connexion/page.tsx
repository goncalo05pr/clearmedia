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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <header className="mb-8 text-center">
            <p className="mb-4 text-sm font-bold uppercase tracking-wider text-purple-400">
              Accès membre
            </p>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white">
              Bienvenue sur{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                KLIQZ
              </span>
            </h1>
            <p className="text-lg text-gray-300">
              Accède à ton espace membre et à tes formations KLIQZ.
            </p>
          </header>

          {reset === "ok" ? (
            <div className="mb-8 bg-green-100 border border-green-300 rounded-lg p-4 text-center">
              <p className="text-green-700 font-bold">Mot de passe mis à jour !</p>
              <p className="text-green-600 text-sm mt-1">Tu peux te connecter avec ton nouveau mot de passe.</p>
            </div>
          ) : null}

          <AuthForm redirectTo={redirectTo} />
        </div>
      </div>
    </div>
  );
}
