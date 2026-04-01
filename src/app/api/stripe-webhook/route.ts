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

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook mal configure." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(payload, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.supabase_user_id;
    const formationId = session.metadata?.formation_id;

    if (userId && formationId) {
      const { error } = await getSupabaseAdmin().from("purchases").upsert(
        {
          user_id: userId,
          formation_id: formationId,
          stripe_session_id: session.id,
          status: "paid",
        },
        { onConflict: "stripe_session_id" },
      );

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // Send purchase confirmation email
      try {
        // Get user email
        const { data: userData } = await getSupabaseAdmin()
          .from('profiles')
          .select('email')
          .eq('id', userId)
          .single();

        // Get formation details
        const { data: formationData } = await getSupabaseAdmin()
          .from('formations')
          .select('title')
          .eq('id', formationId)
          .single();

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

          if (!response.ok) {
            console.error('Failed to send purchase confirmation email');
          }
        }
      } catch (emailError) {
        console.error('Error sending purchase confirmation email:', emailError);
      }
    }
  }

  return NextResponse.json({ received: true });
}
