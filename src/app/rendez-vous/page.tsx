"use client";

import { useEffect } from "react";

export default function RendezVousPage() {
  useEffect(() => {
    // Charger le script Calendly
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    // Nettoyer le script quand le composant est démonté
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a0a" }}>
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          {/* Logo KLIQZ */}
          <div className="mb-8">
            <h1 
              className="text-6xl md:text-7xl font-bold tracking-tight"
              style={{ color: "#ff4d2e" }}
            >
              KLIQZ
            </h1>
          </div>
          
          {/* Titre principal */}
          <h2 
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: "#ffffff" }}
          >
            Réservez votre appel stratégique
          </h2>
          
          {/* Sous-titre */}
          <p 
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
            style={{ color: "#e5e5e5" }}
          >
            Un appel gratuit de 30 minutes pour discuter de votre projet
          </p>
          
          {/* Description supplémentaire */}
          <p 
            className="text-lg max-w-2xl mx-auto opacity-80"
            style={{ color: "#a0a0a0" }}
          >
            Nos experts vous accompagnent dans la définition de vos objectifs et vous proposons les meilleures solutions pour votre réussite.
          </p>
        </div>

        {/* Calendly Widget */}
        <div className="max-w-4xl mx-auto">
          <div 
            className="calendly-inline-widget"
            data-url="https://calendly.com/kliqz/30min?hide_event_type_details=1&hide_gdpr_banner=1&background_color=0a0a0a&text_color=ffffff&primary_color=ff4d2e"
            style={{ 
              minWidth: "320px", 
              height: "750px",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
            }}
          />
        </div>

        {/* Footer informations */}
        <div className="text-center mt-16">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="p-6 rounded-lg" style={{ backgroundColor: "#1a1a1a" }}>
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: "#ffffff" }}>
                  Analyse personnalisée
                </h3>
                <p style={{ color: "#a0a0a0" }}>
                  Étude approfondie de vos besoins et objectifs professionnels pour un accompagnement sur mesure.
                </p>
              </div>
              <div className="p-6 rounded-lg" style={{ backgroundColor: "#1a1a1a" }}>
                <div className="text-4xl mb-4">�</div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: "#ffffff" }}>
                  Stratégie de croissance
                </h3>
                <p style={{ color: "#a0a0a0" }}>
                  Définition d'un plan d'action concret pour développer vos compétences et atteindre vos ambitions.
                </p>
              </div>
              <div className="p-6 rounded-lg" style={{ backgroundColor: "#1a1a1a" }}>
                <div className="text-4xl mb-4">�</div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: "#ffffff" }}>
                  Résultats garantis
                </h3>
                <p style={{ color: "#a0a0a0" }}>
                  Suivi personnalisé et méthodes éprouvées pour vous assurer une progression rapide et efficace.
                </p>
              </div>
            </div>
            
            {/* Call-to-action final */}
            <div className="mt-12 p-8 rounded-lg" style={{ backgroundColor: "#1a1a1a", border: "1px solid #ff4d2e" }}>
              <h3 className="text-2xl font-bold mb-4" style={{ color: "#ff4d2e" }}>
                Prêt à démarrer ?
              </h3>
              <p className="text-lg mb-6" style={{ color: "#ffffff" }}>
                Réservez votre appel dès maintenant et prenez la première étape vers votre succès.
              </p>
              <a 
                href="https://calendly.com/kliqz/30min?hide_event_type_details=1&hide_gdpr_banner=1&background_color=0a0a0a&text_color=ffffff&primary_color=ff4d2e"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105"
                style={{ 
                  backgroundColor: "#ff4d2e", 
                  color: "#ffffff",
                  boxShadow: "0 10px 25px -5px rgba(255, 77, 46, 0.3)"
                }}
              >
                Réserver mon appel gratuit
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
