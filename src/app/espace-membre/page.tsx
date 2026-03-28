import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminUser } from "@/lib/auth-helpers";
import { createClient } from "@/lib/supabase/server";
import { formations } from "@/lib/formations";
import { getPaidFormationIds } from "@/lib/user-purchases";

export default async function EspaceMembrePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion?next=/espace-membre");
  }

  const isAdmin = isAdminUser(user);
  const paidResult = await getPaidFormationIds(supabase, user.id);

  if (!isAdmin) {
    if (!paidResult.ok) {
      return (
        <section className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-white mb-4">
              Espace membre
            </h1>
            <p className="mt-4 text-red-300/90 max-w-md">
              Impossible de charger tes achats : {paidResult.error}. Verifie la configuration Supabase.
            </p>
          </div>
        </section>
      );
    }
    if (paidResult.ok && paidResult.ids.size === 0) {
      return (
        <section className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-white mb-4">
              Espace membre
            </h1>
            <p className="mb-8 text-neutral-400 max-w-md">
              Tu n'as pas encore acheté de formation.
            </p>
            <Link
              href="/formations"
              className="inline-flex rounded-full bg-[#ff4d2e] px-8 py-4 text-lg font-medium text-white transition hover:bg-[#ff6a4d]"
            >
              Découvrir les formations
            </Link>
          </div>
        </section>
      );
    }
  }

  // Filtrer les formations : admin voit tout, utilisateur voit seulement ses achats
  const unlockedFormations = isAdmin
    ? formations
    : formations.filter((formation) => paidResult.ok && paidResult.ids.has(formation.id));

  return (
    <div className="min-h-screen">
      <header className="mb-12 max-w-2xl">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[#ff4d2e]">
          Membre
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Espace membre
        </h1>
        <p className="mt-4 text-neutral-400">
          <span className="text-neutral-300">{user.email}</span>
          {" — "}
          {isAdmin
            ? "Compte administrateur — aperçu de toutes les formations."
            : paidResult.ok ? `Tu as accès à ${paidResult.ids.size} formation${paidResult.ids.size > 1 ? 's' : ''}.` : "Chargement de tes achats..."}
        </p>
      </header>

      {unlockedFormations.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 sm:p-10 text-center">
          <p className="max-w-md text-neutral-400 mb-6">
            {isAdmin 
              ? "Aucune formation disponible pour le moment."
              : "Aucun accès actif pour le moment. Achète une formation pour débloquer ton espace."
            }
          </p>
          <Link
            href="/formations"
            className="inline-flex rounded-full bg-[#ff4d2e] px-8 py-4 text-lg font-medium text-white transition hover:bg-[#ff6a4d]"
          >
            Voir les formations
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {unlockedFormations.map((formation) => (
            <article
              key={formation.id}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition hover:border-white/[0.1]"
            >
              <h2 className="font-heading text-xl font-semibold text-white mb-3">{formation.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-400 mb-6">{formation.description}</p>
              <Link
                href={`/formations/${formation.id}`}
                className="inline-flex rounded-full border border-white/[0.12] px-5 py-2.5 text-sm font-medium text-white transition hover:border-[#ff4d2e]/50 hover:text-[#ff4d2e]"
              >
                Ouvrir le programme
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
