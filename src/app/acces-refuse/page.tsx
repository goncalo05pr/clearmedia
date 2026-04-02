"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AccessDeniedPage() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers l'accueil après 10 secondes
    const timer = setTimeout(() => {
      router.push("/");
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-black flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          {/* Icône d'erreur */}
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          {/* Titre */}
          <h1 className="text-4xl font-bold text-white mb-4">Accès refusé</h1>
          
          {/* Message principal */}
          <p className="text-xl text-gray-300 mb-6">
            Votre accès à la plateforme a été temporairement suspendu
          </p>

          {/* Explications possibles */}
          <div className="bg-white/5 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold text-white mb-4">Causes possibles :</h2>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="text-red-400 mr-2">•</span>
                <span>Suspension temporaire de votre compte par l'administration</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-400 mr-2">•</span>
                <span>Révocation de l'accès à une formation spécifique</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-400 mr-2">•</span>
                <span>Problème de paiement ou d'abonnement</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-400 mr-2">•</span>
                <span>Violation des conditions d'utilisation</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={() => router.push("/")}
              className="w-full bg-[#ff4d2e] hover:bg-[#ff6b3d] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 hover:shadow-2xl"
            >
              Retour à l'accueil
            </button>

            <button
              onClick={() => window.location.href = "mailto:support@kliqz.com"}
              className="w-full border-2 border-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:bg-white/10 hover:scale-105"
            >
              Contacter le support
            </button>
          </div>

          {/* Message de redirection automatique */}
          <div className="mt-8 text-sm text-gray-400">
            <p>Vous serez automatiquement redirigé vers l'accueil dans <span id="countdown">10</span> secondes...</p>
          </div>

          {/* Script pour le compte à rebours */}
          <script dangerouslySetInnerHTML={{
            __html: `
              let countdown = 10;
              const countdownElement = document.getElementById('countdown');
              const timer = setInterval(() => {
                countdown--;
                if (countdownElement) {
                  countdownElement.textContent = countdown;
                }
                if (countdown <= 0) {
                  clearInterval(timer);
                }
              }, 1000);
            `
          }} />
        </div>
      </div>
    </div>
  );
}
