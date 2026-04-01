import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    console.log('Webhook request received');
    
    // Lire le body en premier
    const body = await request.text();
    console.log('Body length:', body.length);
    
    // Récupérer les headers
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    console.log('Webhook configuration:', {
      hasSignature: !!signature,
      hasWebhookSecret: !!webhookSecret,
      webhookSecretLength: webhookSecret?.length,
      signatureLength: signature?.length
    });

    if (!signature || !webhookSecret) {
      console.error('Missing signature or webhook secret');
      return NextResponse.json({ error: "Webhook mal configuré." }, { status: 400 });
    }

    // Vérifier la signature Stripe
    let event: Stripe.Event;
    try {
      event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
      console.log('Stripe event verified successfully:', event.type);
    } catch (error: any) {
      console.error('Signature verification failed:', error.message);
      return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
    }

  console.log('Processing event type:', event.type);

    // Traiter seulement checkout.session.completed
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log('Session data:', {
        sessionId: session.id,
        customerEmail: session.customer_email,
        paymentStatus: session.payment_status,
        metadata: session.metadata
      });

      const userId = session.metadata?.user_id;
      const formationId = session.metadata?.formation_id;
      const formationTitle = session.metadata?.formation_title;
      const formationPrice = session.metadata?.formation_price;

      if (!userId || !formationId) {
        console.error('Missing required metadata:', { userId, formationId });
        return NextResponse.json({ error: "Metadata manquants." }, { status: 400 });
      }

      try {
        console.log('Connecting to Supabase...');
        const supabaseAdmin = getSupabaseAdmin();
        
        console.log('Inserting purchase:', {
          user_id: userId,
          formation_id: formationId,
          stripe_session_id: session.id,
          status: "paid",
          amount: parseFloat(formationPrice || '0')
        });

        const { data, error } = await supabaseAdmin
          .from("purchases")
          .insert({
            user_id: userId,
            formation_id: formationId,
            stripe_session_id: session.id,
            status: "paid",
            amount: parseFloat(formationPrice || '0'),
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) {
          console.error('Failed to insert purchase:', error);
          console.error('Error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          return NextResponse.json({ error: error.message }, { status: 500 });
        }

        console.log('Purchase inserted successfully:', data);

        // Envoyer l'email de confirmation (optionnel, ne pas bloquer si erreur)
        try {
          console.log('Sending confirmation email...');
          
          const { data: userData } = await supabaseAdmin
            .from('profiles')
            .select('email')
            .eq('id', userId)
            .single();

          if (userData?.email) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://kliqz.vercel.app'}/api/emails/purchase`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: userData.email,
                formationTitle: formationTitle || 'Formation',
                formationId: formationId
              })
            });

            console.log('Email sent:', response.ok);
          }
        } catch (emailError: any) {
          console.error('Email error (non-blocking):', emailError.message);
        }

      } catch (dbError: any) {
        console.error('Database connection error:', dbError.message);
        return NextResponse.json({ error: "Erreur base de données." }, { status: 500 });
      }
    } else {
      console.log('Ignoring event:', event.type);
    }

    console.log('Webhook processed successfully');
    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('Webhook processing error:', error.message);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}
