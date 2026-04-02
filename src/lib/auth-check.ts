import { createClient } from "./supabase/client";

export async function checkUserAccess(userId: string, formationId?: string) {
  const supabase = createClient();
  
  try {
    // Vérifier si l'utilisateur est suspendu
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('suspended')
      .eq('user_id', userId)
      .single();

    if (profileError) {
      console.error('Erreur vérification profil:', profileError);
      return { allowed: true, reason: null };
    }

    // Si l'utilisateur est suspendu, bloquer l'accès
    if (profile?.suspended) {
      return { 
        allowed: false, 
        reason: 'suspended',
        message: 'Votre compte a été suspendu par l\'administration'
      };
    }

    // Si une formation spécifique est demandée, vérifier l'accès
    if (formationId) {
      const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .select('status')
        .eq('user_id', userId)
        .eq('formation_id', formationId)
        .single();

      if (purchaseError) {
        console.error('Erreur vérification achat:', purchaseError);
        return { allowed: true, reason: null };
      }

      // Si l'accès à la formation est révoqué, bloquer l'accès
      if (purchase?.status === 'revoked') {
        return { 
          allowed: false, 
          reason: 'revoked',
          message: 'Votre accès à cette formation a été révoqué'
        };
      }
    }

    return { allowed: true, reason: null };

  } catch (error) {
    console.error('Erreur vérification accès:', error);
    return { allowed: true, reason: null };
  }
}
