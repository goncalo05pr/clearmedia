"use client";

import { useState } from "react";

export default function TestimonialsSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah L.",
      company: "E-commerce B2B",
      role: "CEO & Founder",
      avatar: "👩‍💼",
      content: "KLIQZ a complètement transformé notre acquisition client. En 6 mois, nous avons multiplié notre ROI par 3.2 avec une réduction de 45% du coût par acquisition. Leur approche data-driven est redoutable.",
      result: "+320% ROI",
      metrics: {
        roi: "+320%",
        cpa: "-45%",
        growth: "+280%"
      }
    },
    {
      name: "Marc D.",
      company: "SaaS Scale-up",
      role: "Head of Growth",
      avatar: "👨‍💻",
      content: "Leur expertise en media buying nous a permis de passer de 50k€ à 500k€ de revenus mensuels en moins d'un an. Le suivi performance et l'optimisation continue sont impressionnants.",
      result: "+900% Croissance",
      metrics: {
        roi: "+850%",
        revenue: "+900%",
        scale: "x10"
      }
    },
    {
      name: "Julie M.",
      company: "Marketplace Premium",
      role: "CMO",
      avatar: "👩‍💼",
      content: "Service exceptionnel ! KLIQZ nous a accompagnés dans notre levée de fonds avec des résultats qui ont convaincu les investisseurs. Stratégies créatives et exécution parfaite.",
      result: "2.5M€ Levée",
      metrics: {
        funding: "2.5M€",
        valuation: "+400%",
        investors: "12"
      }
    },
    {
      name: "Thomas R.",
      company: "EdTech Startup",
      role: "Founder",
      avatar: "👨‍🎓",
      content: "Grâce à leurs stratégies multi-canaux, nous avons atteint notre première année de rentabilité en 8 mois au lieu de 18. Vraiment impressionnant !",
      result: "10 mois d'avance",
      metrics: {
        timeline: "-10 mois",
        profitability: "+125%",
        users: "+450%"
      }
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-black to-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ce que nos
            <span className="block bg-gradient-to-r from-[#ff4d2e] to-[#ff6b3d] bg-clip-text text-transparent">
              clients en disent
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Résultats authentiques de businesses transformés par nos stratégies
          </p>
        </div>

        {/* Main testimonial display */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Active testimonial */}
            <div className="rounded-2xl bg-gradient-to-br from-[#ff4d2e]/10 to-[#ff6b3d]/5 border border-[#ff4d2e]/20 p-8">
              <div className="flex items-start mb-6">
                <div className="text-5xl mr-4">{testimonials[activeTestimonial].avatar}</div>
                <div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {testimonials[activeTestimonial].name}
                  </div>
                  <div className="text-[#ff4d2e] font-medium">
                    {testimonials[activeTestimonial].role} @ {testimonials[activeTestimonial].company}
                  </div>
                </div>
              </div>
              
              <blockquote className="text-xl text-gray-300 leading-relaxed mb-8 italic">
                "{testimonials[activeTestimonial].content}"
              </blockquote>
              
              <div className="text-2xl font-bold bg-gradient-to-r from-[#ff4d2e] to-[#ff6b3d] bg-clip-text text-transparent">
                {testimonials[activeTestimonial].result}
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(testimonials[activeTestimonial].metrics).map(([key, value], index) => (
                <div key={index} className="rounded-xl bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border border-[#ff4d2e]/10 p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">{value}</div>
                  <div className="text-sm text-gray-400 capitalize">{key}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonial selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {testimonials.map((testimonial, index) => (
            <button
              key={index}
              onClick={() => setActiveTestimonial(index)}
              className={`p-4 rounded-xl border transition-all duration-300 text-left ${
                activeTestimonial === index
                  ? 'bg-gradient-to-br from-[#ff4d2e]/10 to-[#ff6b3d]/5 border-[#ff4d2e]/30 scale-105'
                  : 'bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border-[#ff4d2e]/10 hover:border-[#ff4d2e]/20'
              }`}
            >
              <div className="flex items-center mb-2">
                <div className="text-2xl mr-3">{testimonial.avatar}</div>
                <div>
                  <div className="font-semibold text-white text-sm">{testimonial.name}</div>
                  <div className="text-xs text-gray-400">{testimonial.company}</div>
                </div>
              </div>
              <div className="text-sm font-medium text-[#ff4d2e]">
                {testimonial.result}
              </div>
            </button>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-8 px-8 py-4 rounded-full bg-gradient-to-r from-[#ff4d2e]/5 to-[#ff6b3d]/5 border border-[#ff4d2e]/20">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-400 text-xl">⭐</span>
              <span className="text-white font-medium">4.9/5 sur 200+ avis</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400 text-xl">✓</span>
              <span className="text-white font-medium">98% de satisfaction</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-400 text-xl">🏆</span>
              <span className="text-white font-medium">Meilleure agence 2024</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
