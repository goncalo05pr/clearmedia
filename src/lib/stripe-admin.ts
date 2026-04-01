import { getStripe } from './stripe';

interface CreateStripeProductParams {
  title: string;
  description: string;
  price: number; // en CHF
}

export async function createStripeProductAndPrice({ title, description, price }: CreateStripeProductParams) {
  try {
    const stripe = getStripe();
    
    // 1. Créer le produit Stripe
    const product = await stripe.products.create({
      name: title,
      description: description,
      images: [], // Ajouter des images si disponible
    });

    // 2. Créer le prix Stripe en CHF
    const priceData = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(price * 100), // Convertir en cents
      currency: 'chf',
      nickname: `${title} - CHF ${price}`,
    });

    console.log('Stripe product created:', product.id);
    console.log('Stripe price created:', priceData.id);

    return {
      success: true,
      productId: product.id,
      priceId: priceData.id,
    };
  } catch (error: any) {
    console.error('Error creating Stripe product/price:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function updateStripeProductAndPrice(productId: string, priceId: string, { title, description, price }: CreateStripeProductParams) {
  try {
    const stripe = getStripe();
    
    // 1. Mettre à jour le produit Stripe
    const product = await stripe.products.update(productId, {
      name: title,
      description: description,
    });

    // 2. Créer un nouveau prix (Stripe ne permet pas de modifier les prix existants)
    const newPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(price * 100),
      currency: 'chf',
      nickname: `${title} - CHF ${price}`,
    });

    // 3. Archiver l'ancien prix
    await stripe.prices.update(priceId, { active: false });

    console.log('Stripe product updated:', product.id);
    console.log('New Stripe price created:', newPrice.id);
    console.log('Old price archived:', priceId);

    return {
      success: true,
      productId: product.id,
      priceId: newPrice.id,
    };
  } catch (error: any) {
    console.error('Error updating Stripe product/price:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}
