import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formations } from "@/lib/formations";
import { getPaidFormationIds } from "@/lib/user-purchases";

export default async function EspaceMembrePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const paidResult = await getPaidFormationIds(supabase, user.id);

  if (!paidResult.ok) {
    return (
      <section>
        <h1 className="mb-3 text-3xl font-bold">Espace membre</h1>
        <p className="text-red-300">
          Impossible de charger tes achats: {paidResult.error}. Verifie la configuration Supabase.
        </p>
      </section>
    );
  }

  const unlockedFormations = formations.filter((formation) => paidResult.ids.has(formation.id));

  return (
    <section>
      <h1 className="mb-3 text-3xl font-bold">Espace membre</h1>
      <p className="mb-8 text-slate-300">
        Bienvenue {user.email}. Voici tes contenus debloques apres achat.
      </p>

      {unlockedFormations.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="mb-4 text-slate-200">
            Aucun acces actif pour le moment. Achete une formation pour debloquer ton espace.
          </p>
          <Link
            href="/formations"
            className="rounded-md bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400"
          >
            Voir les formations
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {unlockedFormations.map((formation) => (
            <article key={formation.id} className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-semibold text-cyan-300">{formation.title}</h2>
              <p className="mt-3 text-slate-300">{formation.description}</p>
              <Link
                href={`/formations/${formation.id}`}
                className="mt-5 inline-flex rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
              >
                Ouvrir le programme (videos)
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
