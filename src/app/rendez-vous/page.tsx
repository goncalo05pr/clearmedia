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
          
          {/* Sous-titre accrocheur */}
          <p 
            className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto font-medium"
            style={{ color: "#e5e5e5" }}
          >
            Transformez vos ambitions en réalité avec l'expertise de nos coachs spécialisés
          </p>
          
          {/* Description supplémentaire */}
          <p 
            className="text-lg max-w-3xl mx-auto opacity-80"
            style={{ color: "#a0a0a0" }}
          >
            30 minutes gratuites pour analyser votre situation, définir vos objectifs et co-construire votre plan de succès.
          </p>
        </div>

        {/* Avantages */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg border border-gray-800 hover:border-red-500/50 transition-all" style={{ backgroundColor: "#1a1a1a" }}>
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-3" style={{ color: "#ffffff" }}>
                Gratuit et sans engagement
              </h3>
              <p style={{ color: "#a0a0a0" }}>
                Un appel découverte 100% gratuit pour évaluer ensemble la pertinence de notre accompagnement.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg border border-gray-800 hover:border-red-500/50 transition-all" style={{ backgroundColor: "#1a1a1a" }}>
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-3" style={{ color: "#ffffff" }}>
                Réponse sous 24h
              </h3>
              <p style={{ color: "#a0a0a0" }}>
                Confirmation immédiate et prise en charge rapide pour démarrer votre parcours sans attendre.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg border border-gray-800 hover:border-red-500/50 transition-all" style={{ backgroundColor: "#1a1a1a" }}>
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3" style={{ color: "#ffffff" }}>
                Stratégie personnalisée
              </h3>
              <p style={{ color: "#a0a0a0" }}>
                Analyse approfondie de vos besoins et proposition d'un plan d'action sur mesure.
              </p>
            </div>
          </div>
        </div>

        {/* Calendly Widget */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-8">
            <h3 
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{ color: "#ffffff" }}
            >
              Choisissez votre créneau
            </h3>
            <p style={{ color: "#a0a0a0" }}>
              Sélectionnez le moment qui vous convient le mieux pour votre appel stratégique
            </p>
          </div>
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

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "#ffffff" }}
            >
              Questions fréquentes
            </h3>
            <p style={{ color: "#a0a0a0" }}>
              Tout ce que vous devez savoir sur nos appels stratégiques
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="p-6 rounded-lg border border-gray-800" style={{ backgroundColor: "#1a1a1a" }}>
              <h4 className="text-xl font-bold mb-3" style={{ color: "#ff4d2e" }}>
                Qu'est-ce qu'un appel stratégique ?
              </h4>
              <p style={{ color: "#e5e5e5" }}>
                C'est un appel de 30 minutes avec l'un de nos experts pour analyser votre situation actuelle, 
                identifier vos objectifs et définir les meilleures stratégies pour les atteindre. 
                Nous évaluons ensemble comment nos formations peuvent vous aider.
              </p>
            </div>
            
            <div className="p-6 rounded-lg border border-gray-800" style={{ backgroundColor: "#1a1a1a" }}>
              <h4 className="text-xl font-bold mb-3" style={{ color: "#ff4d2e" }}>
                L'appel est-il vraiment gratuit ?
              </h4>
              <p style={{ color: "#e5e5e5" }}>
                Oui, l'appel découverte est 100% gratuit et sans aucun engagement. 
                Notre objectif est de vous apporter une valeur maximale dès ce premier échange 
                et de vous aider à prendre la meilleure décision pour votre avenir professionnel.
              </p>
            </div>
            
            <div className="p-6 rounded-lg border border-gray-800" style={{ backgroundColor: "#1a1a1a" }}>
              <h4 className="text-xl font-bold mb-3" style={{ color: "#ff4d2e" }}>
                Que se passe-t-il après l'appel ?
              </h4>
              <p style={{ color: "#e5e5e5" }}>
                Après l'appel, vous recevrez un résumé personnalisé avec des recommandations concrètes. 
                Si vous décidez de continuer avec nous, nous vous proposerons un programme adapté 
                à vos objectifs et à votre budget. Aucune pression, juste des solutions sur mesure.
              </p>
            </div>
          </div>
        </div>

        {/* Call-to-action final */}
        <div className="text-center mt-16">
          <div className="max-w-3xl mx-auto p-8 rounded-lg" style={{ backgroundColor: "#1a1a1a", border: "1px solid #ff4d2e" }}>
            <h3 className="text-2xl font-bold mb-4" style={{ color: "#ff4d2e" }}>
              Prêt à démarrer votre transformation ?
            </h3>
            <p className="text-lg mb-6" style={{ color: "#ffffff" }}>
              Réservez votre appel gratuit dès maintenant et prenez la première étape vers votre succès.
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
  );
}
