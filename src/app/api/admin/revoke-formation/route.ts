import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { userId, formationId, status } = await request.json();

    if (!userId || !formationId) {
      return NextResponse.json({ error: "User ID et Formation ID requis" }, { status: 400 });
    }

    // Mettre à jour le statut de l'achat dans purchases
    const { error } = await supabase
      .from('purchases')
      .update({ 
        status: status || 'revoked',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('formation_id', formationId);

    if (error) {
      console.error('Erreur révocation formation:', error);
      return NextResponse.json({ error: "Erreur lors de la révocation" }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: status === 'paid' ? "Accès à la formation réactivé" : "Accès à la formation révoqué" 
    });

  } catch (error: any) {
    console.error('Erreur API revoke-formation:', error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
