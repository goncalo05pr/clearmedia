"use client";

import { useState, useEffect } from "react";
import { HomepageContent } from "@/lib/cms-types";
import { calculateHomepageStats, getHomepageContent, getReviewsForHomepage } from "@/lib/cms-utils";
import ReviewForm from "@/components/review-form";

interface StatsData {
  formationsSold: number;
  satisfactionRate: number;
  averageRoi: number;
  clientsCount: number;
  support: string;
}

interface Review {
  id: string;
  rating: number;
  comment?: string;
  user?: {
    email: string;
  };
  formation?: {
    title: string;
  };
  created_at: string;
}

export default function CMSEnabledHomepage() {
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [stats, setStats] = useState<StatsData>({
    formationsSold: 0,
    satisfactionRate: 98,
    averageRoi: 320,
    clientsCount: 247,
    support: "24/7"
  });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const [homepageContent, statsData, reviewsData] = await Promise.all([
        getHomepageContent(),
        calculateHomepageStats(),
        getReviewsForHomepage()
      ]);

      if (homepageContent) {
        setContent(homepageContent);
      } else {
        // Fallback content if CMS not configured
        setContent({
          id: 'default',
          heroTitle: "Votre trafic devient revenu automatique",
          heroSubtitle: "KLIQZ transforme vos visiteurs en clients payants",
          heroDescription: "Stratégies data-driven • Media buying expert • ROI garanti",
          stats: statsData,
          services: {
            seo: {
              title: "SEO Optimisation",
              description: "Positionnement premium sur Google avec des stratégies techniques avancées",
              features: ["SEO technique", "Content marketing", "Link building", "Local SEO"]
            },
            ads: {
              title: "Paid Ads",
              description: "Campagnes performantes sur Meta, TikTok, LinkedIn avec optimisation continue",
              features: ["Meta Ads", "TikTok Ads", "Google Ads", "Retargeting"]
            },
            socialMedia: {
              title: "Social Media",
              description: "Gestion complète des réseaux sociaux avec création de contenu engageant",
              features: ["Stratégie contenu", "Community management", "Influence marketing", "Social ads"]
            },
            content: {
              title: "Content Creation",
              description: "Contenu percutant qui convertit vos visiteurs en clients",
              features: ["Copywriting", "Video creation", "Blog posts", "Email marketing"]
            },
            analytics: {
              title: "Analytics",
              description: "Suivi performance en temps réel et optimisation basée sur les données",
              features: ["Dashboard custom", "A/B testing", "Conversion tracking", "ROI analysis"]
            },
            branding: {
              title: "Branding",
              description: "Identité visuelle forte qui vous démarque de la concurrence",
              features: ["Logo design", "Brand strategy", "Visual identity", "Brand guidelines"]
            }
          },
          testimonials: [
            {
              id: "1",
              name: "Sarah L.",
              company: "E-commerce B2B",
              role: "CEO & Founder",
              content: "KLIQZ a complètement transformé notre acquisition client. En 6 mois, nous avons multiplié notre ROI par 3.2.",
              result: "+320% ROI",
              metrics: { roi: "+320%", revenue: "+320%", scale: "x3.2" },
              avatar: "👩‍💼"
            },
            {
              id: "2",
              name: "Marc D.",
              company: "SaaS Scale-up",
              role: "Head of Growth",
              content: "Leur expertise en media buying nous a permis de passer de 50k€ à 500k€ de revenus mensuels en moins d'un an.",
              result: "+900% Croissance",
              metrics: { roi: "+850%", revenue: "+900%", scale: "x10" },
              avatar: "👨‍💻"
            }
          ],
          lastUpdated: new Date().toISOString()
        });
      }

      setStats(statsData);
      setReviews(reviewsData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading content:', error);
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const renderTestimonial = (testimonial: any, isReview: boolean = false) => {
    if (isReview) {
      return (
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          <div className="flex items-center mb-6">
            <div className="text-4xl mr-4">👤</div>
            <div>
              <div className="font-bold text-white">
                {testimonial.user?.email?.split('@')[0] || 'Anonymous'}
              </div>
              <div className="text-gray-300 text-sm">
                Formation: {testimonial.formation?.title || 'Formation'}
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            {renderStars(testimonial.rating)}
          </div>
          
          {testimonial.comment && (
            <blockquote className="text-gray-300 mb-6 italic">
              "{testimonial.comment}"
            </blockquote>
          )}
          
          <div className="text-sm text-gray-400">
            {new Date(testimonial.created_at).toLocaleDateString('fr-FR')}
          </div>
        </div>
      );
    }

    // Original testimonial rendering
    return (
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
        <div className="flex items-center mb-6">
          <div className="text-4xl mr-4">{testimonial.avatar}</div>
          <div>
            <div className="font-bold text-white">{testimonial.name}</div>
            <div className="text-gray-300">{testimonial.role}</div>
            <div className="text-[#ff4d2e]">{testimonial.company}</div>
          </div>
        </div>
        <blockquote className="text-gray-300 mb-6 italic">
          "{testimonial.content}"
        </blockquote>
        <div className="text-2xl font-bold text-[#ff4d2e]">
          {testimonial.result}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#ff4d2e] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h1 className="text-2xl font-bold text-white mb-2">CMS en cours de configuration</h1>
          <p className="text-gray-400">Le contenu sera bientôt disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff4d2e]/20 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-white to-[#ff4d2e] bg-clip-text text-transparent">
            {content.heroTitle}
          </h1>
          <h2 className="text-xl md:text-2xl lg:text-3xl text-[#ff4d2e] mb-3 md:mb-4">
            {content.heroSubtitle}
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 max-w-3xl mx-auto">
            {content.heroDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = '/formations';
              }}
              className="w-full sm:w-auto bg-[#ff4d2e] hover:bg-[#ff6b3d] text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-base md:text-lg transition-all hover:scale-105 hover:shadow-2xl relative z-20"
            >
              Commencer maintenant
            </button>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = '/rendez-vous';
              }}
              className="w-full sm:w-auto border-2 border-white/20 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-base md:text-lg transition-all hover:bg-white/10 hover:scale-105 relative z-20"
            >
              Voir les résultats
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-black to-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/10">
              <div className="text-3xl md:text-4xl font-bold text-[#ff4d2e] mb-2">{stats.formationsSold}</div>
              <div className="text-gray-300 text-sm md:text-base">Formations vendues</div>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/10">
              <div className="text-3xl md:text-4xl font-bold text-[#ff4d2e] mb-2">{stats.satisfactionRate}%</div>
              <div className="text-gray-300 text-sm md:text-base">Taux de satisfaction</div>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/10">
              <div className="text-3xl md:text-4xl font-bold text-[#ff4d2e] mb-2">{stats.clientsCount}+</div>
              <div className="text-gray-300 text-sm md:text-base">Clients satisfaits</div>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/10">
              <div className="text-3xl md:text-4xl font-bold text-[#ff4d2e] mb-2">{stats.support}</div>
              <div className="text-gray-300 text-sm md:text-base">Support disponible</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-20 px-4 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Nos Services</h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Des solutions complètes pour transformer votre présence en ligne en machine à revenus
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {Object.entries(content.services).map(([key, service]) => (
              <div key={key} className="group bg-white/5 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/10 hover:border-[#ff4d2e]/50 transition-all duration-300 hover:scale-105">
                <div className="text-3xl md:text-4xl mb-4">
                  {key === 'seo' && '🔍'}
                  {key === 'ads' && '📱'}
                  {key === 'socialMedia' && '📱'}
                  {key === 'content' && '✍️'}
                  {key === 'analytics' && '📊'}
                  {key === 'branding' && '🎨'}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">{service.title}</h3>
                <p className="text-gray-300 mb-6 text-sm md:text-base">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-400 text-sm md:text-base">
                      <span className="text-[#ff4d2e] mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#0a0a0a] to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Avis des Étudiants</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Découvrez ce que nos étudiants disent de nos formations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mix of CMS testimonials and real reviews */}
            {content.testimonials.slice(0, 1).map((testimonial, index) => (
              <div key={`cms-${index}`}>
                {renderTestimonial(testimonial, false)}
              </div>
            ))}
            {reviews.slice(0, 1).map((review, index) => (
              <div key={`review-${index}`}>
                {renderTestimonial(review, true)}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prêt à transformer votre trafic en revenus ?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Rejoignez les centaines d'étudiants qui font déjà confiance à KLIQZ
          </p>
          <button className="bg-[#ff4d2e] hover:bg-[#ff6b3d] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 hover:shadow-2xl">
            Démarrer votre projet
          </button>
        </div>
      </section>
    </div>
  );
}
