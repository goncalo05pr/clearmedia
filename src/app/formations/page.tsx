import Link from "next/link";
import { BuyButton } from "@/components/buy-button";
import { formations } from "@/lib/formations";
import { createClient } from "@/lib/supabase/server";
import { getPaidFormationIds } from "@/lib/user-purchases";

type PageProps = {
  searchParams: Promise<{ reason?: string }>;
};

export default async function FormationsPage({ searchParams }: PageProps) {
  const { reason } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const paidResult = user ? await getPaidFormationIds(supabase, user.id) : null;
  const paidIds =
    paidResult?.ok === true ? paidResult.ids : new Set<string>();
  const purchasesError = paidResult?.ok === false ? paidResult.error : null;

  return (
    <section>
      <h1 className="mb-3 text-3xl font-bold">Nos formations</h1>
      <p className="mb-10 text-slate-300">
        Choisis la formation adaptee a ton niveau. Paiement securise via Stripe.
      </p>

      {purchasesError ? (
        <div className="mb-8 rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          Impossible de verifier tes achats: {purchasesError}
        </div>
      ) : null}

      {reason === "locked" ? (
        <div
          className="mb-8 rounded-lg border border-amber-700/50 bg-amber-950/40 px-4 py-3 text-sm text-amber-100"
          role="status"
        >
          Connecte-toi et achete cette formation pour acceder au contenu, ou achete-la depuis cette page.
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-3">
        {formations.map((formation) => {
          const owned = paidIds.has(formation.id);
          return (
            <article key={formation.id} className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-semibold">{formation.title}</h2>
              <p className="mt-3 min-h-20 text-sm text-slate-300">{formation.description}</p>
              <p className="mt-5 text-2xl font-bold text-cyan-300">{formation.price} EUR</p>
              <div className="mt-5">
                {owned ? (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-emerald-400">Deja achete</p>
                    <Link
                      href={`/formations/${formation.id}`}
                      className="inline-flex rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
                    >
                      Acceder au contenu
                    </Link>
                  </div>
                ) : (
                  <BuyButton formationId={formation.id} />
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
