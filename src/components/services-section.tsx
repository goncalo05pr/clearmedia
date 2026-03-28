"use client";

import { useState } from "react";

export default function ServicesSection() {
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  const services = [
    {
      icon: "🔍",
      title: "SEO Optimisation",
      description: "Positionnement premium sur Google avec des stratégies techniques avancées et contenu optimisé",
      features: ["SEO technique", "Content marketing", "Link building", "Local SEO"]
    },
    {
      icon: "🎯",
      title: "Paid Ads",
      description: "Campagnes performantes sur Meta, TikTok, LinkedIn avec optimisation continue",
      features: ["Meta Ads", "TikTok Ads", "Google Ads", "Retargeting"]
    },
    {
      icon: "📱",
      title: "Social Media",
      description: "Gestion complète des réseaux sociaux avec création de contenu engageant",
      features: ["Stratégie contenu", "Community management", "Influence marketing", "Social ads"]
    },
    {
      icon: "📝",
      title: "Content Creation",
      description: "Contenu percutant qui convertit vos visiteurs en clients",
      features: ["Copywriting", "Video creation", "Blog posts", "Email marketing"]
    },
    {
      icon: "📊",
      title: "Analytics",
      description: "Suivi performance en temps réel et optimisation basée sur les données",
      features: ["Dashboard custom", "A/B testing", "Conversion tracking", "ROI analysis"]
    },
    {
      icon: "🎨",
      title: "Branding",
      description: "Identité visuelle forte qui vous démarque de la concurrence",
      features: ["Logo design", "Brand strategy", "Visual identity", "Brand guidelines"]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-black to-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Nos services
            <span className="block bg-gradient-to-r from-[#ff4d2e] to-[#ff6b3d] bg-clip-text text-transparent">
              expert
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Une offre complète pour transformer votre présence digitale en machine à revenus
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border border-[#ff4d2e]/10 p-8 transition-all duration-300 hover:scale-105 hover:border-[#ff4d2e]/30 cursor-pointer"
              onMouseEnter={() => setHoveredService(index)}
              onMouseLeave={() => setHoveredService(null)}
            >
              {/* Background effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff4d2e]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="text-5xl mb-6 transform transition-transform duration-300 group-hover:scale-110">
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#ff4d2e] transition-colors duration-300">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <div className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="flex items-center text-sm text-gray-500 group-hover:text-gray-300 transition-colors duration-300"
                    >
                      <div className="w-1.5 h-1.5 bg-[#ff4d2e] rounded-full mr-3"></div>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="text-[#ff4d2e] font-semibold text-sm hover:text-[#ff6b3d] transition-colors duration-300">
                    En savoir plus →
                  </button>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-[#ff4d2e] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-block rounded-2xl bg-gradient-to-r from-[#ff4d2e]/10 to-[#ff6b3d]/10 border border-[#ff4d2e]/20 p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Besoin d'une solution sur mesure ?
            </h3>
            <p className="text-gray-400 mb-6 max-w-2xl">
              Nous créons des stratégies personnalisées basées sur vos objectifs spécifiques
            </p>
            <button className="bg-[#ff4d2e] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#ff6b3d] transition-colors duration-300">
              🚀 Demander un devis
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
