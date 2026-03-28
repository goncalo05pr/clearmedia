import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdminUser } from "@/lib/auth-helpers";
import { getFormationById } from "@/lib/formations";
import { createClient } from "@/lib/supabase/server";
import { getPaidFormationIds } from "@/lib/user-purchases";
import FormationContent from "@/components/formation-content";

type PageProps = {
  params: Promise<{ formationId: string }>;
};

export default async function FormationDetailPage({ params }: PageProps) {
  const { formationId } = await params;
  const formation = getFormationById(formationId);

  if (!formation) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/connexion?next=/formations/${formationId}`);
  }

  if (!isAdminUser(user)) {
    const paidResult = await getPaidFormationIds(supabase, user.id);
    if (!paidResult.ok) {
      redirect("/formations");
    }
    if (!paidResult.ids.has(formation.id)) {
      redirect("/formations?reason=locked");
    }
  }

  return (
    <div>
      <div className="mb-12">
        <Link
          href="/espace-membre"
          className="text-sm text-neutral-500 transition hover:text-[#ff4d2e]"
        >
          Retour espace membre
        </Link>
        <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-[#ff4d2e]">
          Programme
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {formation.title}
        </h1>
        <p className="mt-4 max-w-2xl text-neutral-400">{formation.description}</p>
      </div>

      <FormationContent formationId={formationId} />
    </div>
  );
}
