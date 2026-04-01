import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/client';
import { getFormationById } from '@/lib/formations';

export async function POST(request: NextRequest) {
  try {
    const { formationId } = await request.json();

    if (!formationId) {
      return NextResponse.json(
        { error: 'Formation ID is required' },
        { status: 400 }
      );
    }

    // Get formation details
    const formation = getFormationById(formationId);
    if (!formation) {
      return NextResponse.json(
        { error: 'Formation not found' },
        { status: 404 }
      );
    }

    // Get current user
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const stripe = getStripe();

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'chf',
            product_data: {
              name: formation.title,
              description: formation.description,
              images: [], // Add product images if available
            },
            unit_amount: formation.price * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kliqz.vercel.app'}/espace-membre?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kliqz.vercel.app'}/formations?cancelled=true`,
      metadata: {
        formation_id: formationId,
        supabase_user_id: user.id,
        formation_title: formation.title,
        formation_price: formation.price.toString(),
      },
      customer_email: user.email,
      billing_address_collection: 'auto',
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
