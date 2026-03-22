import Stripe from "stripe";

let stripeClient: Stripe | null = null;

/** Evite d instancier Stripe au chargement du module (build sans cle). */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY manquant");
  }
  if (!stripeClient) {
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}
