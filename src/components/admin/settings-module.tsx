"use client";

import { useState, useEffect } from "react";

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  socialLinks: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
  };
  features: {
    enableBlog: boolean;
    enableForum: boolean;
    enableNewsletter: boolean;
  };
}

export default function SettingsModule() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "KLIQZ",
    siteDescription: "Plateforme de formations en marketing digital",
    contactEmail: "contact@kliqz.com",
    maintenanceMode: false,
    allowRegistrations: true,
    socialLinks: {
      facebook: "https://facebook.com/kliqz",
      twitter: "https://twitter.com/kliqz",
      linkedin: "https://linkedin.com/company/kliqz",
      instagram: "https://instagram.com/kliqz"
    },
    seo: {
      metaTitle: "KLIQZ - Formations en Marketing Digital",
      metaDescription: "Devenez expert en marketing digital avec nos formations professionnelles",
      keywords: "marketing digital, formations, social ads, copywriting"
    },
    features: {
      enableBlog: true,
      enableForum: false,
      enableNewsletter: true
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'seo' | 'social' | 'features'>('general');

  useEffect(() => {
    // Simuler le chargement des paramètres - en production, ça viendrait de Supabase
    const loadSettings = async () => {
      try {
        // En production: const { data } = await supabase.from('settings').select('*').single();
        // setSettings(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading settings:', error);
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      console.log('Saving settings:', settings);
      // En production: await supabase.from('settings').update(settings).eq('id', 'main');
      
      // Simuler une sauvegarde réussie
      setTimeout(() => {
        setSaving(false);
        alert('Paramètres sauvegardés avec succès !');
      }, 1000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaving(false);
      alert('Erreur lors de la sauvegarde des paramètres');
    }
  };

  const handleReset = async () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
      try {
        console.log('Resetting settings to defaults');
        // En production: await supabase.from('settings').update(defaultSettings).eq('id', 'main');
        
        // Réinitialiser aux valeurs par défaut
        const defaultSettings: SiteSettings = {
          siteName: "KLIQZ",
          siteDescription: "Plateforme de formations en marketing digital",
          contactEmail: "contact@kliqz.com",
          maintenanceMode: false,
          allowRegistrations: true,
          socialLinks: {
            facebook: "",
            twitter: "",
            linkedin: "",
            instagram: ""
          },
          seo: {
            metaTitle: "KLIQZ - Formations en Marketing Digital",
            metaDescription: "Devenez expert en marketing digital avec nos formations professionnelles",
            keywords: ""
          },
          features: {
            enableBlog: true,
            enableForum: false,
            enableNewsletter: true
          }
        };
        
        setSettings(defaultSettings);
        alert('Paramètres réinitialisés avec succès !');
      } catch (error) {
        console.error('Error resetting settings:', error);
        alert('Erreur lors de la réinitialisation des paramètres');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">⚙️ Paramètres du Site</h3>
        <div className="flex space-x-3">
          <button
            onClick={handleReset}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            Réinitialiser
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <span className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Sauvegarde...
              </span>
            ) : (
              'Sauvegarder'
            )}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          {(['general', 'seo', 'social', 'features'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300'
              }`}
            >
              {tab === 'general' ? 'Général' :
               tab === 'seo' ? 'SEO' :
               tab === 'social' ? 'Réseaux Sociaux' : 'Fonctionnalités'}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom du site</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email de contact</label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description du site</label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Mode maintenance</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.allowRegistrations}
                  onChange={(e) => setSettings({...settings, allowRegistrations: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Autoriser les inscriptions</span>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
              <input
                type="text"
                value={settings.seo.metaTitle}
                onChange={(e) => setSettings({...settings, seo: {...settings.seo, metaTitle: e.target.value}})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
              <textarea
                value={settings.seo.metaDescription}
                onChange={(e) => setSettings({...settings, seo: {...settings.seo, metaDescription: e.target.value}})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mots-clés SEO</label>
              <input
                type="text"
                value={settings.seo.keywords}
                onChange={(e) => setSettings({...settings, seo: {...settings.seo, keywords: e.target.value}})}
                placeholder="séparés par des virgules"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                <input
                  type="url"
                  value={settings.socialLinks.facebook}
                  onChange={(e) => setSettings({...settings, socialLinks: {...settings.socialLinks, facebook: e.target.value}})}
                  placeholder="https://facebook.com/kliqz"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                <input
                  type="url"
                  value={settings.socialLinks.twitter}
                  onChange={(e) => setSettings({...settings, socialLinks: {...settings.socialLinks, twitter: e.target.value}})}
                  placeholder="https://twitter.com/kliqz"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                <input
                  type="url"
                  value={settings.socialLinks.linkedin}
                  onChange={(e) => setSettings({...settings, socialLinks: {...settings.socialLinks, linkedin: e.target.value}})}
                  placeholder="https://linkedin.com/company/kliqz"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                <input
                  type="url"
                  value={settings.socialLinks.instagram}
                  onChange={(e) => setSettings({...settings, socialLinks: {...settings.socialLinks, instagram: e.target.value}})}
                  placeholder="https://instagram.com/kliqz"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.features.enableBlog}
                  onChange={(e) => setSettings({...settings, features: {...settings.features, enableBlog: e.target.checked}})}
                  className="mr-3"
                />
                <div>
                  <div className="text-sm font-medium text-gray-700">Activer le blog</div>
                  <div className="text-xs text-gray-500">Permet de publier des articles de blog</div>
                </div>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.features.enableForum}
                  onChange={(e) => setSettings({...settings, features: {...settings.features, enableForum: e.target.checked}})}
                  className="mr-3"
                />
                <div>
                  <div className="text-sm font-medium text-gray-700">Activer le forum</div>
                  <div className="text-xs text-gray-500">Espace de discussion entre membres</div>
                </div>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.features.enableNewsletter}
                  onChange={(e) => setSettings({...settings, features: {...settings.features, enableNewsletter: e.target.checked}})}
                  className="mr-3"
                />
                <div>
                  <div className="text-sm font-medium text-gray-700">Activer la newsletter</div>
                  <div className="text-xs text-gray-500">Envoi d'emails marketing</div>
                </div>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
