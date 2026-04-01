import { NextRequest, NextResponse } from 'next/server';
import { createStripeProductAndPrice } from '@/lib/stripe-admin';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { title, description, price } = await request.json();

    console.log('Creating Stripe product:', { title, description, price });

    if (!title || !price) {
      return NextResponse.json(
        { error: 'Title and price are required' },
        { status: 400 }
      );
    }

    // 1. Créer le produit et prix Stripe
    const stripeResult = await createStripeProductAndPrice({
      title,
      description: description || '',
      price: parseFloat(price),
    });

    if (!stripeResult.success) {
      console.error('Stripe creation failed:', stripeResult.error);
      return NextResponse.json(
        { error: `Stripe error: ${stripeResult.error}` },
        { status: 500 }
      );
    }

    console.log('Stripe product/price created:', stripeResult);

    return NextResponse.json({
      success: true,
      productId: stripeResult.productId,
      priceId: stripeResult.priceId,
    });
  } catch (error: any) {
    console.error('Error in create-product API:', error);
    return NextResponse.json(
      { error: `Failed to create product: ${error.message}` },
      { status: 500 }
    );
  }
}
