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
      <header className="mb-10 text-center scroll-animate">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#8B5CF6] animate-pulse-slow">
          🔐 Accès membre
        </p>
        <h1 className="white-text mb-6 text-4xl font-black tracking-tight sm:text-5xl">
          Bienvenue sur{" "}
          <span className="bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#FF4D2E] bg-clip-text text-transparent animate-gradient">
            KLIQZ
          </span>
        </h1>
        <p className="text-lg text-neutral-200">
          Accède à ton espace membre et à tes formations KLIQZ.
        </p>
      </header>

      {reset === "ok" ? (
        <div className="mb-8 glass-strong rounded-2xl p-4 text-center animate-glow">
          <p className="text-green-300 font-bold">✅ Mot de passe mis à jour !</p>
          <p className="text-green-200 text-sm mt-1">Tu peux te connecter avec ton nouveau mot de passe.</p>
        </div>
      ) : null}

      <div className="scroll-animate">
        <AuthForm redirectTo={redirectTo} />
      </div>
    </div>
  );
}
