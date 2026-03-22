export type Lesson = {
  id: string;
  title: string;
  durationMinutes: number;
  /** URL embed YouTube/Vimeo (ex: https://www.youtube.com/embed/VIDEO_ID) */
  videoEmbedUrl?: string;
};

export type Module = {
  id: string;
  title: string;
  lessons: Lesson[];
};

const socialAdsModules: Module[] = [
  {
    id: "mod-1",
    title: "Fondamentaux paid social",
    lessons: [
      {
        id: "l1",
        title: "Cartographie des objectifs et KPIs",
        durationMinutes: 18,
        // Ajoute ton URL embed (YouTube/Vimeo) dans formation-content.ts
      },
      {
        id: "l2",
        title: "Structure de campagne Meta (CBO vs ABO)",
        durationMinutes: 24,
      },
    ],
  },
  {
    id: "mod-2",
    title: "Creatives et tests",
    lessons: [
      {
        id: "l3",
        title: "Framework de tests creatives",
        durationMinutes: 22,
      },
      {
        id: "l4",
        title: "TikTok Spark Ads et hooks",
        durationMinutes: 19,
      },
    ],
  },
];

const funnelModules: Module[] = [
  {
    id: "mod-1",
    title: "Architecture du funnel",
    lessons: [
      {
        id: "l1",
        title: "Offre principale et sequence de valeur",
        durationMinutes: 28,
      },
      {
        id: "l2",
        title: "Landing et pages de vente",
        durationMinutes: 31,
      },
    ],
  },
  {
    id: "mod-2",
    title: "Monetisation",
    lessons: [
      {
        id: "l3",
        title: "Upsell, downsell, order bump",
        durationMinutes: 26,
      },
      {
        id: "l4",
        title: "Email de relance et automation",
        durationMinutes: 20,
      },
    ],
  },
];

const copyModules: Module[] = [
  {
    id: "mod-1",
    title: "Copywriting direct response",
    lessons: [
      {
        id: "l1",
        title: "Structure AIDA et hooks",
        durationMinutes: 21,
      },
      {
        id: "l2",
        title: "Long copy vs short copy",
        durationMinutes: 17,
      },
    ],
  },
  {
    id: "mod-2",
    title: "Closing et objections",
    lessons: [
      {
        id: "l3",
        title: "Scripts d appel et DM",
        durationMinutes: 25,
      },
      {
        id: "l4",
        title: "Gestion des objections recurrentes",
        durationMinutes: 23,
      },
    ],
  },
];

const contentByFormationId: Record<string, Module[]> = {
  "formation-social-ads": socialAdsModules,
  "formation-funnel-premium": funnelModules,
  "formation-copy-closing": copyModules,
};

export function getFormationModules(formationId: string): Module[] | null {
  return contentByFormationId[formationId] ?? null;
}
