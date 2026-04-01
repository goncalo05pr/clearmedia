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
    <div>
      <header className="mb-12 max-w-2xl">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[#ff4d2e]">
          Catalogue
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Nos formations
        </h1>
        <p className="mt-4 text-neutral-400">
          Choisis la formation adaptee a ton niveau. Paiement securise via Stripe.
        </p>
      </header>

      {purchasesError ? (
        <div className="mb-8 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-200/90">
          Impossible de verifier tes achats : {purchasesError}
        </div>
      ) : null}

      {reason === "locked" ? (
        <div
          className="mb-8 rounded-xl border border-[#ff4d2e]/25 bg-[#ff4d2e]/5 px-4 py-3 text-sm text-neutral-200"
          role="status"
        >
          Connecte-toi et achete cette formation pour acceder au contenu, ou achete-la depuis cette page.
        </div>
      ) : null}

      {reason === "member-only" ? (
        <div
          className="mb-8 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-neutral-200"
          role="status"
        >
          Achetez une formation pour accéder à l&apos;espace membre.
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-3">
        {formations.map((formation) => {
          const owned = paidIds.has(formation.id);
          return (
            <article
              key={formation.id}
              className="group flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition hover:border-white/[0.1]"
            >
              <h2 className="font-heading text-lg font-semibold text-white">
                {formation.title}
              </h2>
              <p className="mt-3 min-h-[4.5rem] text-sm leading-relaxed text-neutral-400">
                {formation.description}
              </p>
              <p className="mt-6 text-2xl font-semibold tabular-nums text-white">
                {formation.price}
                <span className="ml-1 text-sm font-normal text-neutral-500">CHF</span>
              </p>
              <div className="mt-6 flex-1" />
              <div className="mt-auto pt-2">
                {owned ? (
                  <div className="space-y-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-[#ff4d2e]">
                      Deja achete
                    </p>
                    <Link
                      href={`/formations/${formation.id}`}
                      className="inline-flex w-full items-center justify-center rounded-full border border-white/[0.12] py-2.5 text-sm font-medium text-white transition hover:border-[#ff4d2e]/50 hover:text-[#ff4d2e]"
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
    </div>
  );
}
