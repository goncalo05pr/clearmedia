import { NextResponse } from "next/server";
import { getFormationById } from "@/lib/formations";
import { getPublicSiteUrl } from "@/lib/site-url";
import { getStripe } from "@/lib/stripe";
import { getStripePriceIdForFormation } from "@/lib/stripe-prices";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Tu dois etre connecte." }, { status: 401 });
    }

    const body = (await request.json()) as { formationId?: string };
    if (!body.formationId) {
      return NextResponse.json({ error: "formationId manquant." }, { status: 400 });
    }

    const formation = getFormationById(body.formationId);
    if (!formation) {
      return NextResponse.json({ error: "Formation introuvable." }, { status: 404 });
    }

    const origin = request.headers.get("origin") ?? getPublicSiteUrl();
    if (!origin) {
      return NextResponse.json({ error: "NEXT_PUBLIC_SITE_URL manquant." }, { status: 500 });
    }

    const priceId = getStripePriceIdForFormation(formation.id);
    const lineItems = priceId
      ? [{ price: priceId, quantity: 1 }]
      : [
          {
            price_data: {
              currency: "eur",
              unit_amount: formation.price * 100,
              product_data: {
                name: formation.title,
                description: formation.description,
              },
            },
            quantity: 1,
          },
        ];

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      customer_email: user.email,
      metadata: {
        supabase_user_id: user.id,
        formation_id: formation.id,
      },
      success_url: `${origin}/espace-membre?status=success`,
      cancel_url: `${origin}/formations?status=cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: "Erreur serveur checkout." }, { status: 500 });
  }
}
