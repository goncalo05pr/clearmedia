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
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black" style={{ backgroundColor: "#0a0a0a" }}>
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 
            className="text-5xl md:text-6xl font-bold mb-6"
            style={{ color: "#ff4d2e" }}
          >
            KLIQZ
          </h1>
          <p className="text-xl text-gray-300 mb-4">
            Prenez rendez-vous avec notre équipe
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Réservez un créneau pour discuter de vos besoins et découvrir comment nos formations peuvent vous aider à atteindre vos objectifs.
          </p>
        </div>

        {/* Calendly Widget */}
        <div className="max-w-4xl mx-auto">
          <div 
            className="calendly-inline-widget"
            data-url="https://calendly.com/kliqz"
            style={{ 
              minWidth: "320px", 
              height: "700px",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
          />
        </div>

        {/* Informations additionnelles */}
        <div className="text-center mt-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Pourquoi prendre rendez-vous ?
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-gray-900 p-6 rounded-lg">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Conseil personnalisé
                </h3>
                <p className="text-gray-400">
                  Discutez de vos objectifs spécifiques et obtenez des recommandations sur mesure.
                </p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg">
                <div className="text-3xl mb-3">📚</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Présentation des formations
                </h3>
                <p className="text-gray-400">
                  Découvrez en détail nos programmes et comment ils s'adaptent à vos besoins.
                </p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg">
                <div className="text-3xl mb-3">🚀</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Plan d'action
                </h3>
                <p className="text-gray-400">
                  Élaborez un parcours d'apprentissage personnalisé pour atteindre vos objectifs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
