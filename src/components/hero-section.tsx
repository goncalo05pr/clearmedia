"use client";

import { useEffect, useState } from "react";

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin w-12 h-12 border-4 border-[#ff4d2e] border-t-transparent rounded-full"></div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff4d2e]/10 via-black to-[#ff4d2e]/5"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#ff4d2e]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-[#ff4d2e]/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#ff4d2e]/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(255,77,46,0.05)_25%,transparent_26%,transparent_74%,rgba(255,77,46,0.05)_75%,transparent_76%,transparent)] bg-[size:50px_50px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-7xl mx-auto">
        <div className="animate-fade-in-up">
          {/* Badge */}
          <div className="inline-block mb-6 px-4 py-2 bg-[#ff4d2e]/10 border border-[#ff4d2e]/20 rounded-full backdrop-blur-sm">
            <span className="text-sm font-semibold text-[#ff4d2e] tracking-wider uppercase">
              🚀 Performance Marketing Agency
            </span>
          </div>

          {/* Main Title */}
          <h1 className="mb-8 text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight">
            <span className="block text-white mb-2">
              Votre trafic devient
            </span>
            <span className="block bg-gradient-to-r from-[#ff4d2e] via-[#ff6b3d] to-[#ff8a65] bg-clip-text text-transparent">
              revenu automatique
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mb-12 text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            KLIQZ transforme vos visiteurs en clients payants. 
            <span className="block text-[#ff4d2e] font-semibold mt-2">
              Stratégies data-driven • Media buying expert • ROI garanti
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href="/formations"
              className="group relative inline-flex items-center justify-center px-8 py-4 bg-[#ff4d2e] text-white font-semibold text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#ff4d2e]/25"
            >
              <span className="relative z-10">🎯 Démarrer ma croissance</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff4d2e] to-[#ff6b3d] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
            
            <a
              href="/formations"
              className="group inline-flex items-center justify-center px-8 py-4 border-2 border-[#ff4d2e]/30 text-white font-semibold text-lg rounded-full transition-all duration-300 hover:bg-[#ff4d2e]/10 hover:border-[#ff4d2e]/50 hover:scale-105"
            >
              📚 Voir les formations
            </a>
          </div>

          {/* Social Proof */}
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <span className="font-medium">4.9/5 rating</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">👥</span>
              <span className="font-medium">200+ clients</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💰</span>
              <span className="font-medium">2.3M€ générés</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-[#ff4d2e]/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-[#ff4d2e] rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
}
