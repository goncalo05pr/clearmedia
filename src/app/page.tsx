import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-32">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 sm:p-12 md:p-16">
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-[0.15]"
          style={{
            background: "radial-gradient(circle, #ff4d2e 0%, transparent 70%)",
          }}
        />
        <div className="relative">
          <p className="mb-8 text-xs font-medium uppercase tracking-[0.3em] text-[#ff4d2e]">
            Agence growth & acquisition
          </p>
          <h1 className="max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
            Transformez votre trafic en{" "}
            <span className="text-[#ff4d2e]">revenus prévisibles</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-neutral-400 md:text-xl">
            KLIQZ structure votre système d'acquisition pour générer des clients qualifiés de manière constante. 
            Stratégie data-driven, media buying performant et optimisation conversion.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              href="/formations"
              className="inline-flex items-center justify-center rounded-full bg-[#ff4d2e] px-8 py-4 text-base font-medium text-white transition hover:bg-[#ff6a4d] hover:scale-105"
            >
              Démarrer ma croissance
            </Link>
            <Link
              href="/connexion"
              className="inline-flex items-center justify-center rounded-full border border-white/[0.12] px-8 py-4 text-base font-medium text-white transition hover:border-[#ff4d2e]/50 hover:text-[#ff4d2e]"
            >
              Voir les cas clients
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="text-center">
        <h2 className="font-heading mb-16 text-sm font-medium uppercase tracking-[0.15em] text-neutral-500">
          Nos résultats en chiffres
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { value: "150+", label: "Clients accompagnés" },
            { value: "320%", label: "ROI moyen" },
            { value: "7 ans", label: "Expérience" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-8 transition hover:border-white/[0.1]"
            >
              <div className="text-4xl font-bold text-[#ff4d2e] md:text-5xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-neutral-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section>
        <h2 className="font-heading mb-16 text-center text-sm font-medium uppercase tracking-[0.15em] text-neutral-500">
          Nos services
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "SEO",
              description: "Optimisation complète pour dominer les résultats de recherche et attirer un trafic qualifié.",
              icon: "🔍",
            },
            {
              title: "Publicités Payantes",
              description: "Campagnes Google Ads, Meta Ads et LinkedIn optimisées pour un ROI maximal.",
              icon: "📈",
            },
            {
              title: "Social Media",
              description: "Stratégie de contenu et community management pour engager votre audience.",
              icon: "💬",
            },
            {
              title: "Content Marketing",
              description: "Création de contenu à forte valeur ajoutée qui convertit les visiteurs en clients.",
              icon: "✍️",
            },
            {
              title: "Analytics & Data",
              description: "Suivi performance et analyse des données pour optimiser vos décisions marketing.",
              icon: "📊",
            },
            {
              title: "Branding",
              description: "Identité visuelle forte et cohérente pour vous démarquer de la concurrence.",
              icon: "🎨",
            },
          ].map((service) => (
            <div
              key={service.title}
              className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all hover:border-[#ff4d2e]/30 hover:bg-white/[0.04]"
            >
              <div className="mb-4 text-3xl">{service.icon}</div>
              <h3 className="font-heading mb-3 text-xl font-semibold text-white group-hover:text-[#ff4d2e]">
                {service.title}
              </h3>
              <p className="text-sm leading-relaxed text-neutral-400">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section>
        <h2 className="font-heading mb-16 text-center text-sm font-medium uppercase tracking-[0.15em] text-neutral-500">
          Comment ça marche
        </h2>
        <div className="grid gap-8 md:grid-cols-4">
          {[
            {
              step: "01",
              title: "Audit & Stratégie",
              description: "Analyse de votre situation actuelle et définition d'une stratégie sur mesure.",
            },
            {
              step: "02",
              title: "Mise en Place",
              description: "Déploiement des campagnes et optimisation des canaux d'acquisition.",
            },
            {
              step: "03",
              title: "Optimisation",
              description: "Analyse des performances et ajustements continus pour maximiser le ROI.",
            },
            {
              step: "04",
              title: "Scaling",
              description: "Déploiement de la stratégie gagnante à plus grande échelle.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="relative text-center"
            >
              <div className="mb-4 text-2xl font-bold text-[#ff4d2e]">
                {item.step}
              </div>
              <h3 className="font-heading mb-3 text-lg font-semibold text-white">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-neutral-400">
                {item.description}
              </p>
              {item.step !== "04" && (
                <div className="absolute top-2 left-full hidden h-0.5 w-full bg-gradient-to-r from-[#ff4d2e]/20 to-transparent md:block" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section>
        <h2 className="font-heading mb-16 text-center text-sm font-medium uppercase tracking-[0.15em] text-neutral-500">
          Témoignages clients
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              name: "Marie Dubois",
              company: "TechStart",
              content: "KLIQZ a transformé notre acquisition client. ROI de 450% en 6 mois.",
            },
            {
              name: "Jean Martin",
              company: "E-Shop Pro",
              content: "Service exceptionnel et résultats mesurables. Notre trafic a triplé.",
            },
            {
              name: "Sophie Laurent",
              company: "B2B Solutions",
              content: "Stratégie pertinente et exécution parfaite. Je recommande vivement.",
            },
          ].map((testimonial) => (
            <div
              key={testimonial.name}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition hover:border-white/[0.1]"
            >
              <div className="mb-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-[#ff4d2e]">
                    ★
                  </span>
                ))}
              </div>
              <p className="mb-4 text-sm leading-relaxed text-neutral-300 italic">
                "{testimonial.content}"
              </p>
              <div>
                <div className="font-semibold text-white">{testimonial.name}</div>
                <div className="text-xs text-neutral-500">{testimonial.company}</div>
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
              "SEO • Publicités • Social Media • Content • Analytics • Branding •",
              "SEO • Publicités • Social Media • Content • Analytics • Branding •",
              "SEO • Publicités • Social Media • Content • Analytics • Branding •",
            ].map((text, i) => (
              <span
                key={i}
                className="text-lg font-medium text-neutral-600"
              >
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-r from-[#ff4d2e]/10 to-transparent p-12 text-center md:p-16">
        <div
          className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-[0.1]"
          style={{
            background: "radial-gradient(circle, #ff4d2e 0%, transparent 70%)",
          }}
        />
        <div className="relative">
          <h2 className="font-heading mb-6 text-3xl font-semibold text-white md:text-4xl lg:text-5xl">
            Prêt à scaler ?
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-neutral-400">
            Rejoignez les entreprises qui font confiance à KLIQZ pour leur croissance. 
            Discutons de votre projet dès aujourd'hui.
          </p>
          <Link
            href="/formations"
            className="inline-flex items-center justify-center rounded-full bg-[#ff4d2e] px-10 py-4 text-base font-medium text-white transition hover:bg-[#ff6a4d] hover:scale-105"
          >
            Démarrer maintenant
          </Link>
        </div>
      </section>
    </div>
  );
}
