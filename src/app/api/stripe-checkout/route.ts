import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { getFormationById } from '@/lib/formations';
import type Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const { formationId } = await request.json();

    console.log('Stripe checkout request:', { formationId });
    console.log('Environment variables:', {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? 'SET' : 'NOT_SET',
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    });

    const siteUrl = 'https://kliqz.vercel.app';
    console.log('Using fixed site URL:', siteUrl);
    console.log('Environment NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL);

    if (!formationId) {
      console.error('Formation ID missing');
      return NextResponse.json(
        { error: 'Formation ID is required' },
        { status: 400 }
      );
    }

    // Get formation details
    const formation = getFormationById(formationId);
    if (!formation) {
      console.error('Formation not found:', formationId);
      return NextResponse.json(
        { error: 'Formation not found' },
        { status: 404 }
      );
    }

    console.log('Formation found:', formation);

    // Check if formation has a Stripe price ID from database
    if (!formation.stripe_price_id && !formation.stripePriceId) {
      console.error('No Stripe price ID found for formation:', formationId);
      return NextResponse.json(
        { error: 'Formation not configured for payment' },
        { status: 400 }
      );
    }

    const stripePriceId = formation.stripe_price_id || formation.stripePriceId;
    console.log('Using Stripe price ID:', stripePriceId);

    // Get current user
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('User authentication error:', userError);
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    console.log('User authenticated:', user.email);

    let stripe: Stripe;
    try {
      stripe = getStripe();
      console.log('Stripe client initialized successfully');
    } catch (stripeError) {
      console.error('Failed to initialize Stripe:', stripeError);
      return NextResponse.json(
        { error: 'Payment service unavailable' },
        { status: 500 }
      );
    }

    // Create Stripe Checkout session
    const sessionData: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: stripePriceId, // Utiliser le prix existant au lieu de créer dynamiquement
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${siteUrl}/espace-membre?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${siteUrl}/formations?cancelled=true`,
      metadata: {
        formation_id: formationId,
        supabase_user_id: user.id,
        formation_title: formation.title,
        formation_price: formation.price.toString(),
      },
      customer_email: user.email,
    };

    console.log('Creating session with data:', sessionData);

    let session;
    try {
      session = await stripe.checkout.sessions.create(sessionData);
      console.log('Stripe session created successfully:', session.id);
    } catch (sessionError: any) {
      console.error('Stripe session creation error:', sessionError);
      return NextResponse.json(
        { error: `Stripe error: ${sessionError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('General error in stripe-checkout:', error);
    return NextResponse.json(
      { error: `Failed to create checkout session: ${error.message}` },
      { status: 500 }
    );
  }
}
