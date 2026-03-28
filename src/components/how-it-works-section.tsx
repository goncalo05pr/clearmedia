"use client";

import { useState } from "react";

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = [
    {
      number: "01",
      title: "Audit & Stratégie",
      description: "Analyse complète de votre situation actuelle et définition d'une stratégie data-driven personnalisée",
      details: ["Audit performance", "Analyse concurrentielle", "Définition KPIs", "Roadmap stratégique"]
    },
    {
      number: "02",
      title: "Configuration",
      description: "Mise en place des campagnes et optimisation des canaux d'acquisition",
      details: ["Setup campagnes", "Configuration tracking", "Intégration outils", "Tests initiaux"]
    },
    {
      number: "03",
      title: "Optimisation",
      description: "Ajustements continus basés sur les données réelles pour maximiser le ROI",
      details: ["A/B testing", "Optimisation CPC", "Amélioration conversion", "Reporting hebdo"]
    },
    {
      number: "04",
      title: "Scaling",
      description: "Déploiement à grande échelle des stratégies validées pour croissance exponentielle",
      details: ["Scaling budget", "Expansion canaux", "Automatisation", "Growth hacking"]
    }
  ];

  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Comment ça
            <span className="block bg-gradient-to-r from-[#ff4d2e] to-[#ff6b3d] bg-clip-text text-transparent">
              marche
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Notre méthodologie éprouvée en 4 étapes pour transformer votre acquisition
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative"
              onMouseEnter={() => setActiveStep(index)}
              onMouseLeave={() => setActiveStep(null)}
            >
              {/* Connection lines */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-[#ff4d2e] to-transparent"></div>
              )}

              {/* Step card */}
              <div className={`relative h-full p-8 rounded-2xl border transition-all duration-300 ${
                activeStep === index
                  ? 'bg-gradient-to-br from-[#ff4d2e]/10 to-[#ff6b3d]/5 border-[#ff4d2e]/30 scale-105'
                  : 'bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border-[#ff4d2e]/10 hover:border-[#ff4d2e]/20'
              }`}>
                {/* Step number */}
                <div className={`text-3xl font-bold mb-6 transition-colors duration-300 ${
                  activeStep === index ? 'text-[#ff4d2e]' : 'text-gray-500'
                }`}>
                  {step.number}
                </div>

                {/* Title */}
                <h3 className={`text-xl font-bold mb-4 transition-colors duration-300 ${
                  activeStep === index ? 'text-white' : 'text-gray-300'
                }`}>
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 mb-6 leading-relaxed">
                  {step.description}
                </p>

                {/* Details list */}
                <div className={`space-y-2 transition-all duration-300 ${
                  activeStep === index ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0 overflow-hidden'
                }`}>
                  {step.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-center text-sm text-gray-500">
                      <div className="w-1.5 h-1.5 bg-[#ff4d2e] rounded-full mr-3"></div>
                      {detail}
                    </div>
                  ))}
                </div>

                {/* Icon indicator */}
                <div className={`absolute top-4 right-4 w-3 h-3 rounded-full transition-all duration-300 ${
                  activeStep === index
                    ? 'bg-[#ff4d2e] scale-125'
                    : 'bg-gray-600 scale-100'
                }`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Process flow indicator */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-4 px-8 py-4 rounded-full bg-gradient-to-r from-[#ff4d2e]/10 to-[#ff6b3d]/10 border border-[#ff4d2e]/20">
            <div className="flex items-center space-x-2">
              {steps.map((_, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    index <= (activeStep !== null ? activeStep : -1)
                      ? 'bg-[#ff4d2e]'
                      : 'bg-gray-600'
                  }`}></div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 transition-colors duration-300 ${
                      index < (activeStep !== null ? activeStep : -1)
                        ? 'bg-[#ff4d2e]'
                        : 'bg-gray-600'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
