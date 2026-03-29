"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { HomepageContent } from "@/lib/cms-types";

export default function CMSHomepageModule() {
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'stats' | 'services' | 'testimonials'>('hero');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const supabase = createClient();
      
      // Load homepage content from Supabase
      const { data, error } = await supabase
        .from('cms_homepage')
        .select('*')
        .single();

      if (error) {
        console.error('Error loading homepage content:', error);
        // Initialize with default content if none exists
        const defaultContent: HomepageContent = {
          id: 'default',
          heroTitle: "Votre trafic devient revenu automatique",
          heroSubtitle: "KLIQZ transforme vos visiteurs en clients payants",
          heroDescription: "Stratégies data-driven • Media buying expert • ROI garanti",
          stats: {
            satisfactionRate: 98,
            averageRoi: 320,
            support: "24/7"
          },
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
        };

        // Create default content in Supabase
        const { error: insertError } = await supabase
          .from('cms_homepage')
          .insert({
            id: 'default',
            content: defaultContent,
            updated_at: new Date().toISOString()
          });

        if (insertError) {
          console.error('Error creating default content:', insertError);
        } else {
          setContent(defaultContent);
        }
      } else {
        setContent(data.content as HomepageContent);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading content:', error);
      setLoading(false);
    }
  };

  const saveContent = async () => {
    if (!content) return;

    setSaving(true);
    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from('cms_homepage')
        .update({
          content: content,
          updated_at: new Date().toISOString()
        })
        .eq('id', content.id);

      if (error) {
        console.error('Error saving content:', error);
        alert('Erreur lors de la sauvegarde');
      } else {
        alert('Contenu sauvegardé avec succès !');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const updateContent = (path: string, value: any) => {
    if (!content) return;

    const newContent = { ...content };
    const keys = path.split('.');
    let current: any = newContent;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    setContent(newContent);
  };

  const addTestimonial = () => {
    if (!content) return;

    const newTestimonial = {
      id: Date.now().toString(),
      name: "",
      company: "",
      role: "",
      content: "",
      result: "",
      metrics: {},
      avatar: "👤"
    };

    updateContent('testimonials', [...content.testimonials, newTestimonial]);
  };

  const removeTestimonial = (id: string) => {
    if (!content) return;
    updateContent('testimonials', content.testimonials.filter(t => t.id !== id));
  };

  const updateTestimonial = (id: string, field: string, value: any) => {
    if (!content) return;

    const updatedTestimonials = content.testimonials.map(testimonial =>
      testimonial.id === id ? { ...testimonial, [field]: value } : testimonial
    );

    updateContent('testimonials', updatedTestimonials);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">📝</div>
        <p className="text-gray-500 text-lg">Impossible de charger le contenu</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">📝 CMS - Page d'accueil</h3>
        <button
          onClick={saveContent}
          disabled={saving}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium"
        >
          {saving ? 'Sauvegarde...' : '💾 Sauvegarder'}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'hero', label: 'Hero' },
              { id: 'stats', label: 'Stats' },
              { id: 'services', label: 'Services' },
              { id: 'testimonials', label: 'Témoignages' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Hero Section */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre Hero</label>
                <input
                  type="text"
                  value={content.heroTitle}
                  onChange={(e) => updateContent('heroTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sous-titre Hero</label>
                <input
                  type="text"
                  value={content.heroSubtitle}
                  onChange={(e) => updateContent('heroSubtitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description Hero</label>
                <textarea
                  value={content.heroDescription}
                  onChange={(e) => updateContent('heroDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Stats Section */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Taux de satisfaction (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={content.stats.satisfactionRate}
                    onChange={(e) => updateContent('stats.satisfactionRate', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Cette valeur sera calculée automatiquement depuis les vraies données</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ROI moyen (%)</label>
                  <input
                    type="number"
                    min="0"
                    value={content.stats.averageRoi}
                    onChange={(e) => updateContent('stats.averageRoi', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Cette valeur sera calculée automatiquement depuis les vraies données</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Support</label>
                  <input
                    type="text"
                    value={content.stats.support}
                    onChange={(e) => updateContent('stats.support', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Services Section */}
          {activeTab === 'services' && (
            <div className="space-y-8">
              {Object.entries(content.services).map(([key, service]) => (
                <div key={key} className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                      <input
                        type="text"
                        value={service.title}
                        onChange={(e) => updateContent(`services.${key}.title`, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={service.description}
                        onChange={(e) => updateContent(`services.${key}.description`, e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Features (un par ligne)</label>
                      <textarea
                        value={service.features.join('\n')}
                        onChange={(e) => updateContent(`services.${key}.features`, e.target.value.split('\n').filter(f => f.trim()))}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Testimonials Section */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold text-gray-900">Témoignages clients</h4>
                <button
                  onClick={addTestimonial}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  + Ajouter un témoignage
                </button>
              </div>

              <div className="space-y-4">
                {content.testimonials.map((testimonial, index) => (
                  <div key={testimonial.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                            <input
                              type="text"
                              value={testimonial.name}
                              onChange={(e) => updateTestimonial(testimonial.id, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise</label>
                            <input
                              type="text"
                              value={testimonial.company}
                              onChange={(e) => updateTestimonial(testimonial.id, 'company', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                            <input
                              type="text"
                              value={testimonial.role}
                              onChange={(e) => updateTestimonial(testimonial.id, 'role', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Avatar</label>
                            <input
                              type="text"
                              value={testimonial.avatar}
                              onChange={(e) => updateTestimonial(testimonial.id, 'avatar', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              placeholder="👤"
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
                          <textarea
                            value={testimonial.content}
                            onChange={(e) => updateTestimonial(testimonial.id, 'content', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Résultat</label>
                          <input
                            type="text"
                            value={testimonial.result}
                            onChange={(e) => updateTestimonial(testimonial.id, 'result', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => removeTestimonial(testimonial.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-400">
        Dernière mise à jour: {new Date(content.lastUpdated).toLocaleString('fr-FR')}
      </div>
    </div>
  );
}
