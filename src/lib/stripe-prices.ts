import type { Formation } from "@/lib/formations";

/**
 * Price IDs Stripe Dashboard (Products > Prices).
 * Si absent pour une formation, le checkout utilise price_data (montant du catalogue).
 */
export function getStripePriceIdForFormation(formationId: Formation["id"]): string | undefined {
  const map: Record<Formation["id"], string | undefined> = {
    "formation-social-ads": process.env.STRIPE_PRICE_FORMATION_SOCIAL_ADS,
    "formation-funnel-premium": process.env.STRIPE_PRICE_FORMATION_FUNNEL_PREMIUM,
    "formation-copy-closing": process.env.STRIPE_PRICE_FORMATION_COPY_CLOSING,
  };
  const id = map[formationId];
  return id && id.startsWith("price_") ? id : undefined;
}
