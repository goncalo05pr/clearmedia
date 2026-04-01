import type { Formation } from "@/lib/formations";

/**
 * Price IDs Stripe Dashboard (Products > Prices).
 * Si absent pour une formation, le checkout utilise price_data (montant du catalogue).
 */
export function getStripePriceIdForFormation(formationId: Formation["id"]): string | undefined {
  const map: Record<Formation["id"], string | undefined> = {
    "formation-seo-masterclass": process.env.STRIPE_PRICE_SEO_MASTERCLASS,
    "formation-ads-pro": process.env.STRIPE_PRICE_ADS_PRO,
    "formation-social-branding": process.env.STRIPE_PRICE_SOCIAL_BRANDING,
  };
  const id = map[formationId];
  return id && id.startsWith("price_") ? id : undefined;
}
