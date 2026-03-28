"use client";

import { useState } from "react";

export default function FinalCTASection() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-black via-[#0a0a0a] to-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#ff4d2e]/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-[#ff6b3d]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#ff4d2e]/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main heading */}
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Prêt à
            <span className="block bg-gradient-to-r from-[#ff4d2e] via-[#ff6b3d] to-[#ff8a65] bg-clip-text text-transparent">
              scaler votre business ?
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
            Rejoignez les entreprises qui font confiance à KLIQZ pour transformer leur acquisition client en machine à revenus
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <a
              href="/formations"
              className="group relative inline-flex items-center justify-center px-10 py-5 bg-[#ff4d2e] text-white font-bold text-xl rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#ff4d2e]/30"
            >
              <span className="relative z-10">🚀 Démarrer maintenant</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff4d2e] to-[#ff6b3d] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
            
            <a
              href="/connexion"
              className="group inline-flex items-center justify-center px-10 py-5 border-2 border-[#ff4d2e]/30 text-white font-bold text-xl rounded-full transition-all duration-300 hover:bg-[#ff4d2e]/10 hover:border-[#ff4d2e]/50 hover:scale-105"
            >
              📚 Voir les formations
            </a>
          </div>

          {/* Email capture form */}
          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border border-[#ff4d2e]/10 p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Commencez votre croissance dès aujourd'hui
              </h3>
              <p className="text-gray-400 mb-6">
                Recevez notre guide gratuit : "5 erreurs à éviter en acquisition payante"
              </p>
              
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="flex-1 px-6 py-4 bg-black/50 border border-[#ff4d2e]/20 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-[#ff4d2e]/50 transition-colors duration-300"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-[#ff4d2e] text-white font-bold rounded-full transition-all duration-300 hover:bg-[#ff6b3d] hover:scale-105"
                >
                  {isSubmitted ? "✓ Envoyé !" : "Recevoir le guide"}
                </button>
              </form>
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔒</span>
              <span className="font-medium">100% Sécurisé</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span className="font-medium">Résultats rapides</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <span className="font-medium">ROI garanti</span>
            </div>
          </div>

          {/* Final motivation */}
          <div className="mt-12 p-6 rounded-xl bg-gradient-to-r from-[#ff4d2e]/5 to-[#ff6b3d]/5 border border-[#ff4d2e]/20">
            <p className="text-lg text-white font-medium">
              🏆 
              <span className="ml-2">
                Plus de 200 entreprises nous font déjà confiance pour leur croissance
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
