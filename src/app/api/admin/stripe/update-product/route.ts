import { NextRequest, NextResponse } from 'next/server';
import { updateStripeProductAndPrice } from '@/lib/stripe-admin';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { productId, priceId, title, description, price } = await request.json();

    console.log('Updating Stripe product:', { productId, priceId, title, description, price });

    if (!productId || !priceId || !title || !price) {
      return NextResponse.json(
        { error: 'Product ID, price ID, title and price are required' },
        { status: 400 }
      );
    }

    // 1. Mettre à jour le produit et créer nouveau prix Stripe
    const stripeResult = await updateStripeProductAndPrice(productId, priceId, {
      title,
      description: description || '',
      price: parseFloat(price),
    });

    if (!stripeResult.success) {
      console.error('Stripe update failed:', stripeResult.error);
      return NextResponse.json(
        { error: `Stripe error: ${stripeResult.error}` },
        { status: 500 }
      );
    }

    console.log('Stripe product/price updated:', stripeResult);

    return NextResponse.json({
      success: true,
      productId: stripeResult.productId,
      priceId: stripeResult.priceId,
    });
  } catch (error: any) {
    console.error('Error in update-product API:', error);
    return NextResponse.json(
      { error: `Failed to update product: ${error.message}` },
      { status: 500 }
    );
  }
}
