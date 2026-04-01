export type Formation = {
  id: string;
  title: string;
  description: string;
  price: number;
  stripePriceId?: string;
  stripe_product_id?: string;
  stripe_price_id?: string;
};

export const formations: Formation[] = [
  {
    id: "formation-seo-masterclass",
    title: "SEO Masterclass",
    description:
      "Maîtrise le SEO technique et stratégique pour dominer Google et générer du trafic organique qualifié.",
    price: 97,
    stripePriceId: "price_seo_masterclass", // À créer dans Stripe Dashboard
  },
  {
    id: "formation-ads-pro",
    title: "Ads Pro",
    description:
      "Deviens expert en publicités payantes (Meta, TikTok, Google) avec un ROI garanti.",
    price: 147,
    stripePriceId: "price_ads_pro", // À créer dans Stripe Dashboard
  },
  {
    id: "formation-social-branding",
    title: "Social Media & Personal Branding",
    description:
      "Construis une marque personnelle puissante et transforme ton audience en clients payants.",
    price: 79,
    stripePriceId: "price_social_branding", // À créer dans Stripe Dashboard
  },
];

export function getFormationById(id: string) {
  return formations.find((formation) => formation.id === id);
}
