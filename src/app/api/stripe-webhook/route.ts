import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const payload = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  console.log('Stripe webhook received:', {
    hasSignature: !!signature,
    hasWebhookSecret: !!webhookSecret,
    webhookSecretLength: webhookSecret?.length,
    payloadLength: payload.length
  });

  if (!signature || !webhookSecret) {
    console.error('Webhook configuration error:', { hasSignature: !!signature, hasWebhookSecret: !!webhookSecret });
    return NextResponse.json({ error: "Webhook mal configure." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(payload, signature, webhookSecret);
    console.log('Stripe event verified:', event.type);
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  console.log('Processing Stripe event:', event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.supabase_user_id;
    const formationId = session.metadata?.formation_id;
    const formationTitle = session.metadata?.formation_title;
    const formationPrice = session.metadata?.formation_price;

    console.log('Checkout session completed:', {
      sessionId: session.id,
      userId,
      formationId,
      formationTitle,
      formationPrice,
      customerEmail: session.customer_email,
      paymentStatus: session.payment_status
    });

    if (userId && formationId) {
      console.log('Inserting purchase into database...');
      
      const { data, error } = await getSupabaseAdmin().from("purchases").upsert(
        {
          user_id: userId,
          formation_id: formationId,
          stripe_session_id: session.id,
          status: "paid",
          amount: parseFloat(formationPrice || '0'),
          created_at: new Date().toISOString()
        },
        { onConflict: "stripe_session_id" },
      );

      if (error) {
        console.error('Failed to insert purchase:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      console.log('Purchase inserted successfully:', data);

      // Send purchase confirmation email
      try {
        console.log('Sending purchase confirmation email...');
        
        // Get user email
        const { data: userData } = await getSupabaseAdmin()
          .from('profiles')
          .select('email')
          .eq('id', userId)
          .single();

        console.log('User data for email:', userData);

        // Get formation details
        const { data: formationData } = await getSupabaseAdmin()
          .from('formations')
          .select('title')
          .eq('id', formationId)
          .single();

        console.log('Formation data for email:', formationData);

        if (userData?.email && formationData?.title) {
          const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://kliqz.vercel.app'}/api/emails/purchase`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: userData.email,
              formationTitle: formationData.title,
              formationId: formationId,
            }),
          });

          console.log('Email response status:', response.status);
          
          if (!response.ok) {
            console.error('Failed to send purchase confirmation email:', response.statusText);
          } else {
            console.log('Purchase confirmation email sent successfully');
          }
        } else {
          console.error('Missing user email or formation title for email');
        }
      } catch (emailError: any) {
        console.error('Error sending purchase confirmation email:', emailError.message);
      }
    } else {
      console.error('Missing userId or formationId in session metadata');
    }
  } else {
    console.log('Ignoring non-checkout.session.completed event:', event.type);
  }

  console.log('Webhook processing completed');
  return NextResponse.json({ received: true });
}
