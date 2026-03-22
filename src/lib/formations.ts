export type Formation = {
  id: string;
  title: string;
  description: string;
  price: number;
};

export const formations: Formation[] = [
  {
    id: "formation-social-ads",
    title: "Social Ads Performance",
    description:
      "Apprends a concevoir des campagnes Meta et TikTok rentables pour des offres digitales.",
    price: 97,
  },
  {
    id: "formation-funnel-premium",
    title: "Funnel Premium",
    description:
      "Structure un funnel complet (landing, offres, upsell) pour augmenter la valeur client.",
    price: 147,
  },
  {
    id: "formation-copy-closing",
    title: "Copywriting & Closing",
    description:
      "Maitrise les scripts et frameworks de copywriting qui transforment ton trafic en ventes.",
    price: 79,
  },
];

export function getFormationById(id: string) {
  return formations.find((formation) => formation.id === id);
}
