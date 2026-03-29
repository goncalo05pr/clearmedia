-- Créer la table cms_content simplifiée
CREATE TABLE IF NOT EXISTS public.cms_content (
  id TEXT PRIMARY KEY,
  content JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insérer un contenu JSON basique sans concaténation
INSERT INTO public.cms_content (id, content) VALUES (
  'homepage',
  '{
    "id": "homepage",
    "heroTitle": "Votre trafic devient revenu automatique",
    "heroSubtitle": "KLIQZ transforme vos visiteurs en clients payants",
    "heroDescription": "Stratégies data-driven • Media buying expert • ROI garanti",
    "stats": {
      "satisfactionRate": 98,
      "averageRoi": 320,
      "support": "24/7"
    },
    "services": {
      "seo": {
        "title": "SEO Optimisation",
        "description": "Positionnement premium sur Google avec des stratégies techniques avancées",
        "features": ["SEO technique", "Content marketing", "Link building", "Local SEO"]
      },
      "ads": {
        "title": "Paid Ads",
        "description": "Campagnes performantes sur Meta, TikTok, LinkedIn avec optimisation continue",
        "features": ["Meta Ads", "TikTok Ads", "Google Ads", "Retargeting"]
      },
      "socialMedia": {
        "title": "Social Media",
        "description": "Gestion complète des réseaux sociaux avec création de contenu engageant",
        "features": ["Stratégie contenu", "Community management", "Influence marketing", "Social ads"]
      },
      "content": {
        "title": "Content Creation",
        "description": "Contenu percutant qui convertit vos visiteurs en clients",
        "features": ["Copywriting", "Video creation", "Blog posts", "Email marketing"]
      },
      "analytics": {
        "title": "Analytics",
        "description": "Suivi performance en temps réel et optimisation basée sur les données",
        "features": ["Dashboard custom", "A/B testing", "Conversion tracking", "ROI analysis"]
      },
      "branding": {
        "title": "Branding",
        "description": "Identité visuelle forte qui vous démarque de la concurrence",
        "features": ["Logo design", "Brand strategy", "Visual identity", "Brand guidelines"]
      }
    },
    "testimonials": [
      {
        "id": "1",
        "name": "Sarah L.",
        "company": "E-commerce B2B",
        "role": "CEO & Founder",
        "content": "KLIQZ a complètement transformé notre acquisition client. En 6 mois, nous avons multiplié notre ROI par 3.2.",
        "result": "+320% ROI",
        "metrics": {"roi": "+320%", "revenue": "+320%", "scale": "x3.2"},
        "avatar": "👩‍💼"
      },
      {
        "id": "2",
        "name": "Marc D.",
        "company": "SaaS Scale-up",
        "role": "Head of Growth",
        "content": "Leur expertise en media buying nous a permis de passer de 50k€ à 500k€ de revenus mensuels en moins d''un an.",
        "result": "+900% Croissance",
        "metrics": {"roi": "+850%", "revenue": "+900%", "scale": "x10"},
        "avatar": "👨‍💻"
      }
    ],
    "lastUpdated": "2024-03-29T15:40:00.000Z"
  }'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  content = EXCLUDED.content,
  updated_at = NOW();
