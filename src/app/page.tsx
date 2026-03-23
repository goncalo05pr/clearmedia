"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#8B5CF6] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-32">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl glass-strong p-8 sm:p-12 md:p-20">
        <div className="absolute inset-0 animate-gradient opacity-10"></div>
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full animate-glow"
          style={{
            background: "radial-gradient(circle, #8B5CF6 0%, #EC4899 50%, #FF4D2E 100%)",
          }}
        />
        <div className="relative z-10">
          <p className="mb-8 text-xs font-bold uppercase tracking-[0.3em] text-[#8B5CF6] animate-pulse-slow">
            🚀 Agence growth & acquisition
          </p>
          <h1 className="white-text mb-8 max-w-5xl text-5xl font-black leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            Transformez votre trafic en{" "}
            <span className="bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#FF4D2E] bg-clip-text text-transparent animate-gradient">
              revenus prévisibles
            </span>
          </h1>
          <p className="white-text mb-12 max-w-3xl text-xl leading-relaxed text-neutral-200 md:text-2xl">
            KLIQZ structure votre système d'acquisition pour générer des clients qualifiés de manière constante. 
            <span className="font-bold bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
              {" "}Stratégie data-driven, media buying performant et optimisation conversion.
            </span>
          </p>
          <div className="flex flex-wrap gap-6">
            <Link
              href="/formations"
              className="btn-gradient rounded-full px-10 py-5 text-lg font-bold text-white transition-all hover:scale-105 hover:shadow-2xl animate-bounce-slow"
            >
              🎯 Démarrer ma croissance
            </Link>
            <Link
              href="/connexion"
              className="glass-strong rounded-full px-10 py-5 text-lg font-bold text-white transition-all hover:scale-105 hover:bg-white/20"
            >
              📊 Voir les cas clients
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="glass-strong rounded-3xl p-8 sm:p-12">
        <h2 className="white-text mb-12 text-3xl font-black text-center">
          📊 Résultats qui parlent d'eux-mêmes
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="card-gradient rounded-2xl p-6 text-center">
            <div className="text-3xl mb-3 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] bg-clip-text text-transparent">
              🎯
            </div>
            <div className="text-3xl font-black text-white mb-2">+247%</div>
            <div className="text-sm text-neutral-300">ROI moyen</div>
          </div>
          <div className="card-gradient rounded-2xl p-6 text-center">
            <div className="text-3xl mb-3 bg-gradient-to-r from-[#EC4899] to-[#FF4D2E] bg-clip-text text-transparent">
              💰
            </div>
            <div className="text-3xl font-black text-white mb-2">2.3M€</div>
            <div className="text-sm text-neutral-300">Revenus générés</div>
          </div>
          <div className="card-gradient rounded-2xl p-6 text-center">
            <div className="text-3xl mb-3 bg-gradient-to-r from-[#FF4D2E] to-[#F97316] bg-clip-text text-transparent">
              📈
            </div>
            <div className="text-3xl font-black text-white mb-2">+180%</div>
            <div className="text-sm text-neutral-300">Croissance trafic</div>
          </div>
          <div className="card-gradient rounded-2xl p-6 text-center">
            <div className="text-3xl mb-3 bg-gradient-to-r from-[#F97316] to-[#8B5CF6] bg-clip-text text-transparent">
              ⏱️
            </div>
            <div className="text-3xl font-black text-white mb-2">3.2s</div>
            <div className="text-sm text-neutral-300">Temps chargement</div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="glass-strong rounded-3xl p-8 sm:p-12">
        <h2 className="white-text mb-12 text-3xl font-black text-center">
          🚀 Nos services expert
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: "🎯",
              title: "Media Buying",
              description: "Acquisition ciblée sur les meilleures plateformes pour maximiser votre ROI"
            },
            {
              icon: "📊",
              title: "Analytics & Data",
              description: "Suivi performance en temps réel et optimisation basée sur les données"
            },
            {
              icon: "🔄",
              title: "Optimization",
              description: "Tests A/B continus et optimisation des taux de conversion"
            },
            {
              icon: "📱",
              title: "Multi-canal",
              description: "Stratégie cohérente sur tous les canaux d'acquisition"
            },
            {
              icon: "🎨",
              title: "Creative Ads",
              description: "Créations percutantes adaptées à votre audience cible"
            },
            {
              icon: "⚡",
              title: "Scaling",
              description: "Déploiement rapide des campagnes performantes"
            }
          ].map((service, index) => (
            <div key={index} className="card-gradient rounded-2xl p-6">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="white-text mb-3 text-xl font-bold">{service.title}</h3>
              <p className="text-neutral-300 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="glass-strong rounded-3xl p-8 sm:p-12">
        <h2 className="white-text mb-12 text-3xl font-black text-center">
          ⚡ Comment ça marche
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              step: "01",
              title: "Audit & Stratégie",
              description: "Analyse de votre situation actuelle et définition des objectifs"
            },
            {
              step: "02",
              title: "Configuration",
              description: "Mise en place des outils et des campagnes initiales"
            },
            {
              step: "03",
              title: "Optimisation",
              description: "Ajustement continu basé sur les performances réelles"
            },
            {
              step: "04",
              title: "Scaling",
              description: "Déploiement à grande échelle des stratégies validées"
            }
          ].map((step, index) => (
            <div key={index} className="card-gradient rounded-2xl p-6 text-center">
              <div className="text-2xl font-black text-[#8B5CF6] mb-4">{step.step}</div>
              <h3 className="white-text mb-3 text-lg font-bold">{step.title}</h3>
              <p className="text-neutral-300 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="glass-strong rounded-3xl p-8 sm:p-12">
        <h2 className="white-text mb-12 text-3xl font-black text-center">
          💬 Ce que nos clients en disent
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: "Sarah L.",
              company: "E-commerce B2B",
              text: "KLIQZ a transformé notre acquisition client. ROI de 320% en 6 mois.",
              result: "+320% ROI"
            },
            {
              name: "Marc D.",
              company: "SaaS Scale-up",
              text: "Leur approche data-driven nous a permis de réduire notre CPA de 45%.",
              result: "-45% CPA"
            },
            {
              name: "Julie M.",
              company: "Marketplace",
              text: "Service exceptionnel ! Notre croissance a explosé grâce à leurs stratégies.",
              result: "x2.5 Croissance"
            }
          ].map((testimonial, index) => (
            <div key={index} className="card-gradient rounded-2xl p-6">
              <div className="mb-4">
                <div className="text-xl font-bold text-white">{testimonial.name}</div>
                <div className="text-sm text-[#8B5CF6]">{testimonial.company}</div>
              </div>
              <p className="text-neutral-300 mb-4 leading-relaxed italic">"{testimonial.text}"</p>
              <div className="text-lg font-bold bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
                {testimonial.result}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Scrolling Banner */}
      <section className="glass-strong rounded-3xl p-8 overflow-hidden">
        <div className="animate-scroll whitespace-nowrap">
          <span className="inline-block px-8 text-2xl font-bold text-white">
            🚀 KLIQZ • Media Buying Expert • Performance Marketing • Growth Hacking • 
          </span>
          <span className="inline-block px-8 text-2xl font-bold text-white">
            🎯 Data-Driven Strategy • Creative Optimization • ROI Maximization • 
          </span>
          <span className="inline-block px-8 text-2xl font-bold text-white">
            ⚡ Rapid Scaling • A/B Testing • Conversion Optimization • 
          </span>
          <span className="inline-block px-8 text-2xl font-bold text-white">
            📊 Analytics & Reporting • Multi-Channel Strategy • Creative Ads • 
          </span>
          <span className="inline-block px-8 text-2xl font-bold text-white">
            🚀 KLIQZ • Media Buying Expert • Performance Marketing • Growth Hacking • 
          </span>
        </div>
      </section>

      {/* Final CTA */}
      <section className="glass-strong rounded-3xl p-8 sm:p-12 text-center">
        <h2 className="white-text mb-6 text-3xl font-black">
          🎯 Prêt à exploser votre croissance ?
        </h2>
        <p className="white-text mb-12 max-w-3xl text-xl leading-relaxed">
          Rejoignez les entreprises qui font confiance à KLIQZ pour leur acquisition client.
        </p>
        <div className="flex flex-wrap gap-6 justify-center">
          <Link
            href="/connexion"
            className="btn-gradient rounded-full px-12 py-6 text-xl font-bold text-white transition-all hover:scale-105 hover:shadow-2xl"
          >
            🚀 Démarrer maintenant
          </Link>
          <Link
            href="/formations"
            className="glass-strong rounded-full px-12 py-6 text-xl font-bold text-white transition-all hover:scale-105 hover:bg-white/20"
          >
            📚 Voir les formations
          </Link>
        </div>
      </section>
    </div>
  );
}
