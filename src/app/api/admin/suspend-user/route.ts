import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { userId, suspended } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID requis" }, { status: 400 });
    }

    // Mettre à jour le statut de suspension dans profiles
    const { error } = await supabase
      .from('profiles')
      .update({ 
        suspended: suspended,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Erreur suspension utilisateur:', error);
      return NextResponse.json({ error: "Erreur lors de la suspension" }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: suspended ? "Utilisateur suspendu" : "Utilisateur réactivé" 
    });

  } catch (error: any) {
    console.error('Erreur API suspend-user:', error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
