import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log('🔍 API DEBUG - Starting /api/admin/users request');
    
    const supabase = await createClient();
    
    // Vérifier que l'utilisateur est admin
    const { data: { user } } = await supabase.auth.getUser();
    const userRole = user?.user_metadata?.role || user?.app_metadata?.role;
    
    console.log('🔍 API DEBUG - Auth user:', user?.email);
    console.log('🔍 API DEBUG - User role:', userRole);
    
    if (!user || userRole !== 'admin') {
      console.log('❌ API DEBUG - Access denied');
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
    }

    console.log('✅ API DEBUG - Access granted, getting admin client');
    
    // Utiliser le client admin pour lister tous les utilisateurs
    const adminClient = getSupabaseAdmin();
    console.log('🔍 API DEBUG - Admin client created');
    
    const { data: { users }, error } = await adminClient.auth.admin.listUsers();
    
    console.log('🔍 API DEBUG - Supabase listUsers result:', { users, error });
    console.log('🔍 API DEBUG - Users count:', users?.length);

    if (error) {
      console.error('Erreur listing utilisateurs:', error);
      return NextResponse.json({ error: "Erreur lors de la récupération des utilisateurs" }, { status: 500 });
    }

    console.log('✅ API DEBUG - Returning users:', users?.length);
    return NextResponse.json({ users });

  } catch (error: any) {
    console.error('Erreur API users:', error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
