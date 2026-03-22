import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { FormationCurriculum } from "@/components/formation-curriculum";
import { getFormationModules } from "@/lib/formation-content";
import { getFormationById } from "@/lib/formations";
import { createClient } from "@/lib/supabase/server";
import { getPaidFormationIds } from "@/lib/user-purchases";

type PageProps = {
  params: Promise<{ formationId: string }>;
};

export default async function FormationDetailPage({ params }: PageProps) {
  const { formationId } = await params;
  const formation = getFormationById(formationId);
  const modules = getFormationModules(formationId);

  if (!formation || !modules) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/connexion?next=/formations/${formationId}`);
  }

  const paidResult = await getPaidFormationIds(supabase, user.id);
  if (!paidResult.ok) {
    redirect("/formations");
  }
  if (!paidResult.ids.has(formation.id)) {
    redirect("/formations?reason=locked");
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/espace-membre"
          className="text-sm text-cyan-400 hover:text-cyan-300"
        >
          Retour espace membre
        </Link>
        <h1 className="mt-4 text-3xl font-bold">{formation.title}</h1>
        <p className="mt-2 max-w-2xl text-slate-300">{formation.description}</p>
      </div>

      <FormationCurriculum modules={modules} />
    </div>
  );
}
