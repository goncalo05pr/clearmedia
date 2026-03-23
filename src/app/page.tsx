"use client";

import Link from "next/link";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export default function Home() {
  const visibleSections = useScrollAnimation();

  return (
    <div className="space-y-32">
      {/* Hero Section */}
      <section id="hero" className="relative overflow-hidden rounded-3xl glass-strong p-8 sm:p-12 md:p-20 scroll-animate">
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
      <section id="stats" className="text-center scroll-animate">
        <h2 className="font-heading mb-16 text-3xl font-bold uppercase tracking-[0.15em]">
          Nos résultats en chiffres
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { value: "150+", label: "Clients accompagnés", icon: "👥" },
            { value: "320%", label: "ROI moyen", icon: "📈" },
            { value: "7 ans", label: "Expérience", icon: "⚡" },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className={`card-gradient rounded-2xl p-8 scroll-animate ${
                index === 0 ? 'scroll-animate-left' : index === 2 ? 'scroll-animate-right' : ''
              }`}
            >
              <div className="mb-4 text-4xl">{stat.icon}</div>
              <div className="mb-2 text-5xl font-black bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-lg font-semibold text-neutral-200">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="scroll-animate">
        <h2 className="font-heading mb-16 text-center text-3xl font-bold uppercase tracking-[0.15em]">
          Nos services
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "SEO",
              description: "Optimisation complète pour dominer les résultats de recherche et attirer un trafic qualifié.",
              icon: "🔍",
              gradient: "from-[#8B5CF6] to-[#6366F1]",
            },
            {
              title: "Publicités Payantes",
              description: "Campagnes Google Ads, Meta Ads et LinkedIn optimisées pour un ROI maximal.",
              icon: "📈",
              gradient: "from-[#EC4899] to-[#FF4D2E]",
            },
            {
              title: "Social Media",
              description: "Stratégie de contenu et community management pour engager votre audience.",
              icon: "💬",
              gradient: "from-[#FF4D2E] to-[#F97316]",
            },
            {
              title: "Content Marketing",
              description: "Création de contenu à forte valeur ajoutée qui convertit les visiteurs en clients.",
              icon: "✍️",
              gradient: "from-[#F97316] to-[#8B5CF6]",
            },
            {
              title: "Analytics & Data",
              description: "Suivi performance et analyse des données pour optimiser vos décisions marketing.",
              icon: "📊",
              gradient: "from-[#6366F1] to-[#EC4899]",
            },
            {
              title: "Branding",
              description: "Identité visuelle forte et cohérente pour vous démarquer de la concurrence.",
              icon: "🎨",
              gradient: "from-[#8B5CF6] to-[#FF4D2E]",
            },
          ].map((service, index) => (
            <div
              key={service.title}
              className={`card-gradient group rounded-2xl p-8 scroll-animate ${
                index % 2 === 0 ? 'scroll-animate-left' : 'scroll-animate-right'
              }`}
            >
              <div className={`mb-6 text-5xl bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}>
                {service.icon}
              </div>
              <h3 className="font-heading mb-4 text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#8B5CF6] group-hover:to-[#EC4899] group-hover:bg-clip-text transition-all">
                {service.title}
              </h3>
              <p className="text-lg leading-relaxed text-neutral-300">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="scroll-animate">
        <h2 className="font-heading mb-16 text-center text-3xl font-bold uppercase tracking-[0.15em]">
          Comment ça marche
        </h2>
        <div className="grid gap-8 md:grid-cols-4">
          {[
            {
              step: "01",
              title: "Audit & Stratégie",
              description: "Analyse de votre situation actuelle et définition d'une stratégie sur mesure.",
              icon: "🔍",
            },
            {
              step: "02",
              title: "Mise en Place",
              description: "Déploiement des campagnes et optimisation des canaux d'acquisition.",
              icon: "🚀",
            },
            {
              step: "03",
              title: "Optimisation",
              description: "Analyse des performances et ajustements continus pour maximiser le ROI.",
              icon: "⚡",
            },
            {
              step: "04",
              title: "Scaling",
              description: "Déploiement de la stratégie gagnante à plus grande échelle.",
              icon: "📈",
            },
          ].map((item, index) => (
            <div
              key={item.step}
              className={`relative text-center scroll-animate ${
                index % 2 === 0 ? 'scroll-animate-left' : 'scroll-animate-right'
              }`}
            >
              <div className="mb-4 text-3xl font-black bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
                {item.step}
              </div>
              <div className="mb-4 text-4xl">{item.icon}</div>
              <h3 className="font-heading mb-3 text-xl font-bold text-white">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-neutral-300">
                {item.description}
              </p>
              {item.step !== "04" && (
                <div className="absolute top-8 left-full hidden h-1 w-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] md:block"></div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="scroll-animate">
        <h2 className="font-heading mb-16 text-center text-3xl font-bold uppercase tracking-[0.15em]">
          Témoignages clients
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              name: "Marie Dubois",
              company: "TechStart",
              content: "KLIQZ a transformé notre acquisition client. ROI de 450% en 6 mois.",
              rating: 5,
            },
            {
              name: "Jean Martin",
              company: "E-Shop Pro",
              content: "Service exceptionnel et résultats mesurables. Notre trafic a triplé.",
              rating: 5,
            },
            {
              name: "Sophie Laurent",
              company: "B2B Solutions",
              content: "Stratégie pertinente et exécution parfaite. Je recommande vivement.",
              rating: 5,
            },
          ].map((testimonial, index) => (
            <div
              key={testimonial.name}
              className={`card-gradient rounded-2xl p-8 scroll-animate ${
                index === 0 ? 'scroll-animate-left' : index === 2 ? 'scroll-animate-right' : ''
              }`}
            >
              <div className="mb-6 flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-2xl text-[#FFD700]">
                    ⭐
                  </span>
                ))}
              </div>
              <p className="white-text mb-6 text-lg leading-relaxed italic">
                "{testimonial.content}"
              </p>
              <div>
                <div className="font-bold text-white text-lg">{testimonial.name}</div>
                <div className="text-sm text-[#8B5CF6] font-semibold">{testimonial.company}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Scrolling Banner */}
      <section className="overflow-hidden">
        <div className="relative flex animate-scroll">
          <div className="flex gap-8 whitespace-nowrap">
            {[
              "🔍 SEO • 📈 Publicités • 💬 Social Media • ✍️ Content • 📊 Analytics • 🎨 Branding •",
              "🔍 SEO • 📈 Publicités • 💬 Social Media • ✍️ Content • 📊 Analytics • 🎨 Branding •",
              "🔍 SEO • 📈 Publicités • 💬 Social Media • ✍️ Content • 📊 Analytics • 🎨 Branding •",
            ].map((text, i) => (
              <span
                key={i}
                className="text-xl font-bold bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#FF4D2E] bg-clip-text text-transparent"
              >
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="cta" className="relative overflow-hidden rounded-3xl glass-strong p-12 text-center md:p-20 scroll-animate">
        <div className="absolute inset-0 animate-gradient opacity-20"></div>
        <div
          className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full animate-glow"
          style={{
            background: "radial-gradient(circle, #FF4D2E 0%, #F97316 50%, #8B5CF6 100%)",
          }}
        />
        <div className="relative z-10">
          <h2 className="white-text font-heading mb-8 text-4xl font-black md:text-5xl lg:text-6xl">
            Prêt à{" "}
            <span className="bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#FF4D2E] bg-clip-text text-transparent animate-gradient">
              scaler
            </span>
            {" "}?
          </h2>
          <p className="white-text mx-auto mb-12 max-w-3xl text-xl text-neutral-200 md:text-2xl">
            Rejoignez les entreprises qui font confiance à KLIQZ pour leur croissance. 
            Discutons de votre projet dès aujourd'hui.
          </p>
          <Link
            href="/formations"
            className="btn-gradient inline-flex items-center justify-center rounded-full px-12 py-6 text-xl font-bold text-white transition-all hover:scale-105 hover:shadow-2xl animate-bounce-slow"
          >
            🚀 Démarrer maintenant
          </Link>
        </div>
      </section>
    </div>
  );
}
