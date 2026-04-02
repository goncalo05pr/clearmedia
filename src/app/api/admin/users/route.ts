import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Vérifier que l'utilisateur est admin
    const { data: { user } } = await supabase.auth.getUser();
    const userRole = user?.user_metadata?.role || user?.app_metadata?.role;
    
    if (!user || userRole !== 'admin') {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
    }

    // Utiliser le client admin pour lister tous les utilisateurs
    const adminClient = getSupabaseAdmin();
    const { data: { users }, error } = await adminClient.auth.admin.listUsers();

    if (error) {
      console.error('Erreur listing utilisateurs:', error);
      return NextResponse.json({ error: "Erreur lors de la récupération des utilisateurs" }, { status: 500 });
    }

    return NextResponse.json({ users });

  } catch (error: any) {
    console.error('Erreur API users:', error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
